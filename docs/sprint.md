# Current Sprint

## Sprint Goal

Ship the first safe MVP operator slice on top of the scaffold without changing the architecture.

## Priority Order

1. customer management
2. appointments management
3. dashboard
4. reviews management
5. AI suggestions
6. workflow automation

## Current Cycle Focus

- Close missing handoff docs so implementation can move without guesswork
- Review the first backend slice before new backend changes
- Keep frontend on customer management and appointments shells
- Keep AI/workflows constrained to MVP-safe, assistive-only surfaces

## Allowed Task Size

- one documentation file
- one UI page shell
- one endpoint improvement
- one DTO/validation improvement
- one review pass

## Frozen Areas

- `README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `tsconfig.base.json`
- `apps/api/src/app.module.ts`
- `apps/web/src/components/app-shell.tsx`
- `apps/web/src/components/feature-panel.tsx`
- `packages/shared/src/domain.ts`
