/**
 * Minimal, dependency-free .xlsx (Excel) export.
 *
 * Builds a valid Open XML spreadsheet workbook — [Content_Types].xml,
 * workbook, styles and one worksheet per sheet — packs it into a ZIP
 * (STORED entries, no compression, with a hand-rolled CRC32) and triggers
 * a browser download. Numbers are written as numeric cells so Excel keeps
 * them right-aligned and sum-able; strings are inline-escaped XML.
 */

export type XlsxCell = string | number | null | undefined;

export type XlsxSheet = {
    /** Sheet tab name (max 31 chars, invalid chars are stripped). */
    name: string;
    /** Bold header row. Omit to export rows only. */
    headers?: string[];
    /** Data rows written below the headers. */
    rows: XlsxCell[][];
    /** Optional bold title line rendered above the headers. */
    title?: string;
};

const MAIN_NS = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const XLSX_MIME =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

/* ------------------------------------------------------------------ */
/* CRC32 (needed for ZIP entries)                                      */
/* ------------------------------------------------------------------ */

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);

    for (let i = 0; i < 256; i++) {
        let c = i;

        for (let k = 0; k < 8; k++) {
            c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
        }

        table[i] = c >>> 0;
    }

    return table;
})();

function crc32(bytes: Uint8Array): number {
    let crc = 0xffffffff;

    for (let i = 0; i < bytes.length; i++) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
}

/* ------------------------------------------------------------------ */
/* ZIP (stored, no compression)                                        */
/* ------------------------------------------------------------------ */

function dosDateTime(date: Date): { time: number; date: number } {
    return {
        time:
            (date.getHours() << 11) |
            (date.getMinutes() << 5) |
            (date.getSeconds() >> 1),
        date:
            ((Math.max(date.getFullYear() - 1980, 0) & 0x7f) << 9) |
            ((date.getMonth() + 1) << 5) |
            date.getDate(),
    };
}

type ZipEntry = { name: string; data: Uint8Array };

/** Packs files into an uncompressed ZIP blob (valid PKZIP archive). */
function buildZip(entries: ZipEntry[], stamp: Date): Blob {
    const { time, date } = dosDateTime(stamp);
    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];
    const central: Uint8Array[] = [];
    let offset = 0;

    for (const entry of entries) {
        const name = encoder.encode(entry.name);
        const crc = crc32(entry.data);
        const local = new Uint8Array(30 + name.length);
        const localView = new DataView(local.buffer);

        localView.setUint32(0, 0x04034b50, true); // local file header signature
        localView.setUint16(4, 20, true); // version needed
        localView.setUint16(6, 0x0800, true); // flags: UTF-8 names
        localView.setUint16(8, 0, true); // method: stored
        localView.setUint16(10, time, true);
        localView.setUint16(12, date, true);
        localView.setUint32(14, crc, true);
        localView.setUint32(18, entry.data.length, true); // compressed size
        localView.setUint32(22, entry.data.length, true); // uncompressed size
        localView.setUint16(26, name.length, true);
        localView.setUint16(28, 0, true); // extra length
        local.set(name, 30);

        chunks.push(local, entry.data);

        const dir = new Uint8Array(46 + name.length);
        const dirView = new DataView(dir.buffer);

        dirView.setUint32(0, 0x02014b50, true); // central directory signature
        dirView.setUint16(4, 20, true); // version made by
        dirView.setUint16(6, 20, true); // version needed
        dirView.setUint16(8, 0x0800, true); // flags
        dirView.setUint16(10, 0, true); // method
        dirView.setUint16(12, time, true);
        dirView.setUint16(14, date, true);
        dirView.setUint32(16, crc, true);
        dirView.setUint32(20, entry.data.length, true);
        dirView.setUint32(24, entry.data.length, true);
        dirView.setUint16(28, name.length, true);
        dirView.setUint16(30, 0, true); // extra
        dirView.setUint16(32, 0, true); // comment
        dirView.setUint16(34, 0, true); // disk start
        dirView.setUint16(36, 0, true); // internal attrs
        dirView.setUint32(38, 0, true); // external attrs
        dirView.setUint32(42, offset, true); // local header offset
        dir.set(name, 46);

        central.push(dir);

        offset += local.length + entry.data.length;
    }

    const centralSize = central.reduce((sum, part) => sum + part.length, 0);
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);

    endView.setUint32(0, 0x06054b50, true); // EOCD signature
    endView.setUint16(4, 0, true); // disk number
    endView.setUint16(6, 0, true); // central dir disk
    endView.setUint16(8, entries.length, true);
    endView.setUint16(10, entries.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true); // central dir offset
    endView.setUint16(20, 0, true); // comment length

    return new Blob([...chunks, ...central, end] as BlobPart[], {
        type: XLSX_MIME,
    });
}

/* ------------------------------------------------------------------ */
/* Worksheet XML                                                       */
/* ------------------------------------------------------------------ */

function escapeXml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;')
        // Strip control chars that are illegal in XML 1.0.
        .replaceAll(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

/** 0-based column index to spreadsheet reference: 0 -> A, 25 -> Z, 26 -> AA. */
function colRef(index: number): string {
    let name = '';
    let n = index;

    do {
        name = String.fromCharCode(65 + (n % 26)) + name;
        n = Math.floor(n / 26) - 1;
    } while (n >= 0);

    return name;
}

function cellXml(cell: XlsxCell, ref: string, bold = false): string {
    const style = bold ? ' s="1"' : '';

    if (cell === null || cell === undefined || cell === '') {
        return '';
    }

    if (typeof cell === 'number' && Number.isFinite(cell)) {
        return `<c r="${ref}"${style}><v>${cell}</v></c>`;
    }

    return `<c r="${ref}" t="inlineStr"${style}><is><t xml:space="preserve">${escapeXml(
        String(cell),
    )}</t></is></c>`;
}

function displayWidth(value: string): number {
    // Rough CJK-aware width estimate so columns don't clip.
    let width = 0;

    for (const char of value) {
        width += char.charCodeAt(0) > 0xff ? 2 : 1;
    }

    return width;
}

function sheetXml(sheet: XlsxSheet): string {
    const headerRows: XlsxCell[][] = [];

    if (sheet.title) {
        headerRows.push([sheet.title]);
    }

    if (sheet.headers) {
        headerRows.push(sheet.headers);
    }

    const allRows = [...headerRows, ...sheet.rows];
    const columnCount = Math.max(
        1,
        ...allRows.map((row) => row.length),
        sheet.headers?.length ?? 1,
    );

    // Column widths from the longest cell per column (capped for sanity).
    const widths = Array.from({ length: columnCount }, (_, col) => {
        const longest = Math.max(
            ...allRows.map(
                (row) => displayWidth(String(row[col] ?? '')) + 3,
            ),
        );

        return Math.min(Math.max(longest, 9), 60);
    });
    const colsXml = `<cols>${widths
        .map(
            (width, index) =>
                `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`,
        )
        .join('')}</cols>`;

    // Freeze the title/header block so it stays visible while scrolling.
    const freezeRows = headerRows.length;
    const paneXml =
        freezeRows > 0
            ? `<sheetViews><sheetView workbookViewId="0"><pane ySplit="${freezeRows}" topLeftCell="A${freezeRows + 1}" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
            : '<sheetViews><sheetView workbookViewId="0"/></sheetViews>';

    const rowXml = allRows
        .map((row, rowIndex) => {
            const number = rowIndex + 1;
            // Bold styling for title + header rows only.
            const bold = rowIndex < freezeRows;
            const cells = Array.from({ length: columnCount }, (_, col) =>
                cellXml(row[col] ?? null, `${colRef(col)}${number}`, bold),
            );

            return `<row r="${number}">${cells.join('')}</row>`;
        })
        .join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="${MAIN_NS}">${colsXml}${paneXml}<sheetData>${rowXml}</sheetData></worksheet>`;
}

/* ------------------------------------------------------------------ */
/* Workbook assembly                                                   */
/* ------------------------------------------------------------------ */

function sanitizeSheetName(name: string, index: number): string {
    const cleaned = name
        .replaceAll(/[\\/?*[\]:]/g, ' ')
        .trim()
        .replaceAll(/\s+/g, ' ');

    return (cleaned === '' ? `Sheet${index + 1}` : cleaned).slice(0, 31);
}

function buildWorkbook(sheets: XlsxSheet[], stamp: Date): Blob {
    const safeSheets = sheets.map((sheet, index) => ({
        ...sheet,
        name: sanitizeSheetName(sheet.name, index),
    }));

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${safeSheets
        .map(
            (_, index) =>
                `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`,
        )
        .join('')}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`;

    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;

    const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="${MAIN_NS}" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${safeSheets
        .map(
            (sheet, index) =>
                `<sheet name="${escapeXml(sheet.name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`,
        )
        .join('')}</sheets></workbook>`;

    const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${safeSheets
        .map(
            (_, index) =>
                `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`,
        )
        .join('')}<Relationship Id="rId${safeSheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`;

    // Style 1 = bold (used for titles and headers).
    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="${MAIN_NS}"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>`;

    const encoder = new TextEncoder();
    const entries: ZipEntry[] = [
        { name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
        { name: '_rels/.rels', data: encoder.encode(rootRels) },
        { name: 'xl/workbook.xml', data: encoder.encode(workbook) },
        { name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
        { name: 'xl/styles.xml', data: encoder.encode(styles) },
        ...safeSheets.map((sheet, index) => ({
            name: `xl/worksheets/sheet${index + 1}.xml`,
            data: encoder.encode(sheetXml(sheet)),
        })),
    ];

    return buildZip(entries, stamp);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

function triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = filename.replace(/\.csv$/, '.xlsx');
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Build and download a real .xlsx workbook.
 *
 * @param filename e.g. "attendance-report" — ".xlsx" is appended if missing.
 */
export function exportXlsx(filename: string, sheets: XlsxSheet[]): void {
    triggerDownload(
        buildWorkbook(sheets, new Date()),
        filename.includes('.') ? filename : `${filename}.xlsx`,
    );
}

/** Convenience wrapper for the common single-sheet export. */
export function exportSheet(
    filename: string,
    sheetName: string,
    headers: string[],
    rows: XlsxCell[][],
): void {
    exportXlsx(filename, [{ name: sheetName, headers, rows }]);
}
