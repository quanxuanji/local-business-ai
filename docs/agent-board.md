# Agent Board

## Control State

- Mode: `continuous-orchestration`
- Architecture: `modular monolith`
- Root config churn: `forbidden unless escalated`
- Minimum queue depth: `3 todo tasks`

## Agent Status

| Agent | Status | Current Task | Blocking Condition |
| --- | --- | --- | --- |
| 总控 Agent | active | Reconcile board and queue, assign next small tasks | None |
| Frontend Agent | active | `F-002` customer detail page shell | Must stay inside `apps/web/**` |
| Backend Agent | blocked | Waiting on `R-001` review result | No new backend implementation until review completes |
| Data/Infra Agent | active | `D-001` create `docs/data-contracts.md` | Must not touch app modules |
| AI/workflows Agent | active | `W-001` create `docs/ai-workflow-contracts.md` | Must not touch core backend modules |
| 验收 Agent | active | `R-001` review backend first implementation slice | Reports merge-ready or revision-needed |

## Running Tasks

| Task ID | Owner | Scope | Owned Paths |
| --- | --- | --- | --- |
| `D-001` | Data/Infra Agent | Document the persistence/runtime contract for the existing MVP schema and local DB flow | `docs/data-contracts.md` |
| `F-002` | Frontend Agent | Upgrade the customer detail route using local feature data and reusable customer components only | `apps/web/src/app/[locale]/customers/[customerId]/page.tsx`, `apps/web/src/features/customers/**`, `apps/web/src/lib/**` |
| `W-001` | AI/workflows Agent | Document the current AI, messaging, workflows, and reviews module surfaces plus MVP guardrails | `docs/ai-workflow-contracts.md` |
| `R-001` | 验收 Agent | Review backend auth/workspace/customers/appointments/dashboard slice for build safety and boundary compliance | `apps/api/src/common/**`, `apps/api/src/config/**`, `apps/api/src/modules/auth/**`, `apps/api/src/modules/workspace/**`, `apps/api/src/modules/customers/**`, `apps/api/src/modules/appointments/**`, `apps/api/src/modules/dashboard/**` |

## Completed Tasks

| Task ID | Owner | Outcome | Evidence |
| --- | --- | --- | --- |
| `C-001` | Team | Monorepo scaffold completed and buildable | `apps/web/**`, `apps/api/**`, `packages/shared/**`, `prisma/schema.prisma`, `infra/docker/docker-compose.yml` |
| `C-002` | Data/Infra Agent | Prisma schema, migration, seed script, and Prisma config detected | `prisma/schema.prisma`, `prisma/migrations/**`, `prisma/seed.js`, `prisma.config.ts` |
| `C-003` | Backend Agent | Customer list endpoint implemented beyond initial scaffold | `apps/api/src/modules/customers/customers.controller.ts`, `apps/api/src/modules/customers/dto/customer-list-response.dto.ts` |
| `C-004` | Frontend Agent | Customers list page implemented with reusable feature components and local snapshot data | `apps/web/src/app/[locale]/customers/page.tsx`, `apps/web/src/features/customers/customer-list.tsx`, `apps/web/src/features/customers/data.ts` |
| `C-005` | Backend Agent | Appointment update DTO validation detected | `apps/api/src/modules/appointments/dto/update-appointment.dto.ts` |

## Next Scheduling Rules

1. Finish active tasks before claiming queued work.
2. Hand every finished implementation task to 验收 Agent before marking it merge-ready.
3. If review fails, create a revision task for the same owner with the smallest possible scope.
4. Keep tasks small: one doc, one page shell, one endpoint improvement, or one review at a time.
5. Respect ownership in [ownership-map.md](/C:/develop/code_project/local-business-ai/docs/ownership-map.md).
