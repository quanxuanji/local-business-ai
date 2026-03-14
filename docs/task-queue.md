# Task Queue

## In Progress

| Task ID | Owner | Priority | Description | Depends On |
| --- | --- | --- | --- | --- |
| `D-001` | Data/Infra Agent | P1 | Create `docs/data-contracts.md` covering MVP tables, enum storage values, workspace scoping, runtime notes, outbound-only messaging, timeline as a read model, and AI assistive-only boundaries | None |
| `F-002` | Frontend Agent | P1 | Implement the customer detail page shell using existing local customer feature data only | None |
| `W-001` | AI/workflows Agent | P2 | Create `docs/ai-workflow-contracts.md` for the current messaging, workflow, review, and AI module surfaces | None |
| `R-001` | 验收 Agent | P1 | Review the backend first slice for build safety, module boundaries, schema/API mismatches, and architectural drift | None |

## Todo

| Task ID | Owner | Priority | Description | Depends On |
| --- | --- | --- | --- | --- |
| `B-001` | Backend Agent | P1 | If `R-001` passes, create `docs/backend-core-api.md` for the existing auth, workspace, customers, appointments, and dashboard endpoints | `R-001` |
| `F-003` | Frontend Agent | P2 | Upgrade the appointments page into a lightweight list and schedule shell using local mock data only | `F-002` |
| `W-002` | AI/workflows Agent | P2 | Add a second documentation pass for review-management and workflow-trigger guardrails inside `docs/ai-workflow-contracts.md` | `W-001` |
| `B-002` | Backend Agent | P2 | Tighten customer list filtering contract and document supported query params if review finds no blockers | `R-001` |
| `D-002` | Data/Infra Agent | P3 | Extend `docs/data-contracts.md` with a short local setup runbook for migrate, generate, and seed commands | `D-001` |

## Recently Completed

| Task ID | Owner | Notes |
| --- | --- | --- |
| `T1` | Data/Infra Agent | Prisma schema and seed strategy verification is reflected by the checked-in migration and seed files |
| `T2` | Backend Agent | Customer list endpoint work is present in the customers module |
| `T3` | Frontend Agent | Customers list page is implemented in the frontend feature layer |
| `T5` | Backend Agent | Appointment update validation exists in `UpdateAppointmentDto` |
