import { onBeforeUnmount, onMounted } from 'vue';

const media = (): MediaQueryList | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    return window.matchMedia('(prefers-color-scheme: dark)');
};

const forceLight = (): void => {
    document.documentElement.classList.remove('dark');
};

/**
 * Restore the user's real appearance (saved preference, or system) when
 * leaving the demo area, so the auth / settings pages keep their theme.
 */
const restoreAppearance = (): void => {
    const saved = localStorage.getItem('appearance');
    const dark =
        saved === 'dark' || (saved !== 'light' && media()?.matches === true);

    document.documentElement.classList.toggle('dark', dark);
};

/**
 * The HRIS demo always renders in light mode so every module page shares the
 * same clean white canvas, regardless of the user's appearance preference.
 * The real theme is restored as soon as the demo area unmounts.
 */
export function useDemoLight(): void {
    const query = media();

    onMounted(() => {
        forceLight();

        // The appearance system re-applies dark when the OS theme changes;
        // keep the demo light until it unmounts.
        query?.addEventListener('change', forceLight);
    });

    onBeforeUnmount(() => {
        query?.removeEventListener('change', forceLight);
        restoreAppearance();
    });
}
