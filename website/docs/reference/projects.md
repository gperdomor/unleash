---
id: projects
title: Projects
---

:::info feature availability

All users get access to projects, but only pro and enterprise users can create, update, or delete them.

:::

This document explains how Unleash uses projects, including how to create and maintain them.

## The default project

All users get access to the default project. You cannot delete this project. You can, however, rename it if you're using the pro or enterprise version of Unleash.

## Understanding purpose of projects {#understanding-purpose-of-projects}

Projects are a way to organize your feature flags within Unleash. Within a large organization, having multiple feature flags, staying on top of the feature flags might become a challenge. Every feature flag will be part of a project. Projects can be linked to a development team or to functional modules within the software.

A common pattern is to organize the feature flags according to key areas of the application, e.g. “Basic user process” and “Advanced user process”. This is illustrated below.

![A diagram with two boxes labeled "Basic user process" and "Advanced user process", respectively. The former contains features "New login" and "Winter theme enablement", the latter "New in-app purchase" and "Updated invoice repository".](/img/project_concept.png)

## Projects and environments

You can configure which [environments](./environments.md) should be available within a project. By default, all globally available environments are available. You can only enable/disable a feature flag for the environments you configure for a project.

Within the admin UI, the projects are available under the "environments" tab of the project page. Changing them requires the project owner role.

## Creating a new project {#creating-a-new-project}

When you log into Unleash for the first time, there is a Default project already created. All feature flags are included in the Default project, unless explicitly set to a different one.

From the top-line menu – click on “Projects”

![The Unleash admin UI with the "Projects" nav link in the top bar highlighted.](/img/projects_button.png)

The UI shows the currently available projects. To create a new project, use the “new project” button.

![A list of projects. There is a button saying "Add new project".](/img/projects_new_project.png)

The configuration of a new Project is now available. the following input is available to create the new Project.

![A project creation form. The "Create" button is highlighted.](/img/projects_save_new_project_v2.png)

| Item               | Description                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------|
| Project Id         | Id for this Project                                                                         |
| Project name       | The name of the Project.                                                                    |
| Description        | A short description of the project                                                          |
| Mode               | The project [collaboration mode](/reference/project-collaboration-mode.md)                  |
| Default Stickiness | The default stickiness for the project. This setting controls the default stickiness value for variants and for the gradual rollout strategy.                                                                 |

## Deleting an existing project {#deleting-an-existing-project}

To keep your feature flags clean, removing deprecated projects is important. From the overview of Projects –

1. In the top right of the project card, find the project menu represented by three vertical dots.

![A list of projects. Each project has three vertical dots — a kebab menu — next to it.](/img/projects_menu_button.png)

2. Click on Delete Project

![A list of projects. Each project has three vertical dots — a kebab menu — next to it, which exposes a menu with the "Edit project" and "Delete project" options when interacted with.](/img/projects_delete_button.png)

## Filter feature flags on projects {#filter-feature-toggles-on-projects}

When browsing the feature flags in Unleash, you might want to filter the view by looking only at the ones included in the project of interest. This is possible from the Feature flag overview.

From the UI top navigation menu, choose "Feature flags".

![The Unleash Admin UI navigation menu with the "Feature flags" option highlighted by a red arrow.](/img/projects_menu.png)

The list of features flags can be filtered on the project of your choice. By default, all feature flags are listed in the view. You can use the search to filter to a specific project or even for multiple projects in the same time if you need.

![The feature flag list with flags scoped to the "fintech" project. The filter is activated by using a form control.](/img/project_select.png)

In the search you can type "project:specific-name" to filter that project only.

![The feature flag list with an overlay listing all the projects available. You can select a project and the list will update with the flags belonging to that project.](/img/projects_select_dropdown.png)

The view will now be updated with the filtered feature flags.

## Assigning project to a new feature flag {#assigning-project-to-a-new-feature-toggle}

When you create a new feature flag, you can choose which project to create it in. The default project is whatever project you are currently configuring.

![A form to create a flag. An arrow points to an input labeled "project".](/img/projects_change_project.png)

All available projects are available from the drop-down menu.

![A form to create a flag. The "project" input is expanded to show projects you can create the flag in.](/img/projects_toggle_project_dropdown.png)

## Change project for an existing feature flag {#change-project-for-an-existing-feature-toggle}

If you want to change which project a feature flag belongs to, you can change that from the feature flag's configuration page. Under the _settings_ tab, choose the _project_ option and choose the new project from the dropdown menu.

![A feature flag's settings tab. The project setting shows a dropdown to change projects.](/img/projects_existing_toggle_dropdown.png)

## Project default strategy
import Figure from '@site/src/components/Figure/Figure.tsx'

:::info Availability

The project default strategy feature is generally available starting with **Unleash 5.2.0**.

:::

You can define default strategies for each of a project's environments. The default strategy for an environment will be added to a feature when you enable it in an environment **if and only if** the feature has **no active strategies** defined.

All default project strategies use the [gradual rollout activation strategy](activation-strategies.md). By default, the rollout 100%. You can customize the strategies by changing the rollout percentage and adding [constraints](strategy-constraints.md) and [segments](segments.mdx) as you would for any other strategy.

### Configuration

Custom strategies are configured from each project's project settings tab.

<Figure caption="The default strategy configuration page is available from the project settings tab." img="/img/project-settings-default-strategy.png" />

The default strategies screen lists a strategy for each of the project's environments

<Figure caption="Each strategy can be individually configured with the corresponding edit button." img="/img/edit-default-strategy.png" />

## Project overview

The project overview gives statistics for a project, including:
* the number of all changes/events in the past 30 days compared to previous 30 days
* the average time from when a feature was created to when it was enabled in the "production" environment. This value is calculated for all features in the project lifetime.
* the number of features created in the past 30 days compared to previous 30 days
* the number of features archived in the past 30 days compared to previous 30 days

![Project overview with 4 statistics for total changes, average time to production, features created and features archived.](/img/project_overview.png)
