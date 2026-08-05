# Repository Labels

Labels are the automation source of truth.

The canonical label list lives in `.github/labels.yml`.

## Required Label Groups

- `type:*`
- `status:*`
- `priority:*`
- `area:*`
- `version:*`
- `automation:*`

## Rules

- Human PRs into `develop` need a `type:*` label.
- Human PRs into `develop` need the approval policy defined by the project.
- Preview PRs need `type:release` and `automation:preview`.
- Release-candidate PRs need `type:release`.
- Release-candidate PRs need exactly one manually selected `version:*` label before merge.
- GitHub Projects may mirror labels, but workflow checks must read labels directly.

## Current Source Labels

Type labels:

- `type:bug`
- `type:feature`
- `type:task`
- `type:design`
- `type:docs`
- `type:refactor`
- `type:release`

Status labels:

- `status:triage`
- `status:ready`
- `status:blocked`
- `status:needs-info`
- `status:in-review`
- `status:approved`

Version labels:

- `version:patch`
- `version:minor`
- `version:major`

Automation labels:

- `automation:preview`
- `automation:release-candidate`
- `automation:production-release`
- `automation:sync`

Label sync automation keeps GitHub labels aligned with `.github/labels.yml`.
