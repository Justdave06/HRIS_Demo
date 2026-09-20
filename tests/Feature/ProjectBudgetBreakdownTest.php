<?php

test('project budget breakdown page loads for a seeded project', function () {
    $response = $this->get(route('demo.projects.registry.show.budget', ['project' => 1]));

    $response->assertOk();
});
