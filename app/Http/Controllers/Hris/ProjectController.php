<?php

namespace App\Http\Controllers\Hris;

use App\Http\Controllers\Controller;
use App\Support\DemoData;
use App\Support\DemoMode;
use Inertia\Inertia;

class ProjectController extends Controller
{
    /**
     * Project dashboard (Module 11). Kept at /demo/projects so the demo hub
     * link keeps working, and mirrored at /demo/projects/dashboard.
     */
    public function index()
    {
        return $this->dashboard();
    }

    /**
     * Project dashboard — total, active, completed and overdue projects,
     * portfolio by status, recent projects and a quick action into the
     * registry.
     */
    public function dashboard()
    {
        return Inertia::render('demo/ProjectDashboard', $this->payload());
    }

    /**
     * Project registry — the directory of every project with New project /
     * edit / status actions, plus generate + export.
     */
    public function projects()
    {
        return Inertia::render('demo/ProjectRegistry', $this->payload());
    }

    /**
     * One project's detail — description, team, milestones and timeline in a
     * dedicated page.
     */
    public function project(int $project)
    {
        $projectData = collect(DemoData::projects())->firstWhere('id', $project);

        if (! $projectData) {
            return redirect()->route('demo.projects.registry');
        }

        return Inertia::render('demo/ProjectDetail', array_merge(
            $this->payload(),
            ['project' => $projectData],
        ));
    }

    /**
     * Project detail for a session-added project (id 1001+). The server has
     * no record for it — the page hydrates the project from sessionStorage,
     * staying inside this module.
     */
    public function sessionProject(int $project)
    {
        $projectData = collect(DemoData::projects())->firstWhere('id', $project);

        if (! $projectData) {
            return Inertia::render('demo/ProjectDetail', array_merge(
                $this->payload(),
                ['project' => [
                    'id' => $project,
                    'name' => 'Project',
                    'description' => '',
                    'start_date' => '',
                    'end_date' => '',
                    'status' => 'Planning',
                    'department' => '',
                    'lead_id' => null,
                    'team_ids' => [],
                    'milestones' => [],
                    'budget' => 0,
                ]],
            ));
        }

        return redirect()->route('demo.projects.registry');
    }

    /**
     * Project reports — project summary, by department, by status and team
     * utilization, with generate + export.
     */
    public function reports()
    {
        return Inertia::render('demo/ProjectReports', $this->payload());
    }

    /**
     * Shared payload for the project pages. Everyone who can be assigned to
     * a project (with their record) plus the seeded project registry.
     */
    private function payload(): array
    {
        return [
            'employees' => collect(DemoMode::employees())->map(fn ($e) => [
                'id' => $e['id'],
                'no' => $e['no'],
                'name' => $e['name'],
                'department' => $e['department'],
                'position' => $e['position'],
            ])->values()->all(),
            'projects' => DemoMode::blank() ? [] : DemoData::projects(),
        ];
    }
}