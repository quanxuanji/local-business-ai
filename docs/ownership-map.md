# Ownership Map

## Frontend Agent

Owns:

- `apps/web/**`

Forbidden:

- `apps/api/**`
- `prisma/**`
- `infra/**`
- `packages/**`

## Backend Agent

Owns:

- `apps/api/src/common/**`
- `apps/api/src/config/**`
- `apps/api/src/modules/auth/**`
- `apps/api/src/modules/workspace/**`
- `apps/api/src/modules/customers/**`
- `apps/api/src/modules/appointments/**`
- `apps/api/src/modules/dashboard/**`
- `docs/backend-core-api.md`

Forbidden:

- `apps/api/src/prisma/**`
- `apps/api/src/modules/messaging/**`
- `apps/api/src/modules/workflows/**`
- `apps/api/src/modules/reviews/**`
- `apps/api/src/modules/ai/**`
- `apps/api/src/app.module.ts`

## Data/Infra Agent

Owns:

- `prisma/**`
- `apps/api/src/prisma/**`
- `infra/docker/**`
- `.env.example`
- `docs/data-contracts.md`

Forbidden:

- `apps/api/src/modules/**`
- `apps/web/**`

## AI/workflows Agent

Owns:

- `apps/api/src/modules/messaging/**`
- `apps/api/src/modules/workflows/**`
- `apps/api/src/modules/reviews/**`
- `apps/api/src/modules/ai/**`
- `docs/ai-workflow-contracts.md`

Forbidden:

- `apps/api/src/modules/auth/**`
- `apps/api/src/modules/workspace/**`
- `apps/api/src/modules/customers/**`
- `apps/api/src/modules/appointments/**`
- `apps/api/src/modules/dashboard/**`
- `apps/api/src/prisma/**`
- `apps/api/src/app.module.ts`

## 验收 Agent

Owns:

- review output only

May inspect:

- any file relevant to the completed task under review

Must not:

- expand product scope
- take over feature implementation except for a tiny fix if absolutely necessary

## Frozen Files

- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/api/src/app.module.ts`
- `apps/web/src/components/app-shell.tsx`
- `apps/web/src/components/feature-panel.tsx`
- `packages/shared/src/domain.ts`
