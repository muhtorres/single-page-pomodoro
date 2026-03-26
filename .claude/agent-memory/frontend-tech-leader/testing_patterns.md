---
name: testing_patterns
description: Jest + RTL test setup patterns, store seeding, and how to handle Zustand state in tests
type: project
---

## Store seeding in beforeEach
Use `useStore.setState({...})` directly — do NOT call async store actions in beforeEach as they may not resolve before the test starts.

## Zustand store state across tests
Each `beforeEach` must reset ALL relevant stores, not just the one under test. Example:
- TaskList tests: reset both `useTaskStore` AND `useProjectStore`
- AddTask tests: need `useProjectStore` with a project and `selectedProjectId` set so submit is enabled

## Nested beforeEach for different requirements
When different describe blocks need different store state, use a global `beforeEach` for the common base and a nested `beforeEach` inside the describe block for overrides.

## makeTask helper must include all required Task fields
After adding `projectId` to the Task interface, `makeTask` must include `projectId: null` as a default to avoid TS errors.

## Turbopack build errors in worktrees
`npm run build` fails in git worktrees due to Turbopack workspace root detection. Use `npx tsc --noEmit` to type-check instead. The build error is infrastructure, not code.

**Why:** Tests failed after adding projectStore because AddTask's submit button became disabled (requires project selection). TaskList tests failed because a project filter was set. Proper store setup per describe block fixed both.
**How to apply:** Always seed all stores that components consume, not just the store the test is focused on.
