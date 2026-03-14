# AI Development Protocol

Agents operate using shared documents.

## Primary Documents

- `agent-board.md`
- `task-queue.md`
- `sprint.md`
- `architecture.md`
- `ownership-map.md`

## Status Types

- `todo`
- `in-progress`
- `done`
- `approved`
- `revision-required`

## Agent Loop

1. Read `task-queue.md`
2. Find tasks assigned to you
3. Mark task `in-progress`
4. Execute task
5. Mark task `done`
6. Update `agent-board.md`
7. Repeat

## Validation Loop

1. 验收 Agent scans tasks marked `done`
2. Reviews implementation
3. Marks `approved` or `revision-required`
4. Creates follow-up tasks if needed

## Orchestration Loop

1. 总控 Agent scans `agent-board`
2. Moves finished tasks to completed
3. Ensures `task-queue` always has tasks
4. Generates new tasks aligned with `sprint.md`
5. Assigns tasks to agents

## Rules

Tasks must be small:

- one endpoint
- one UI page
- one service
- one migration

Total `todo` tasks must always be `>= 3`
