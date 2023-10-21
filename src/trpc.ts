import type {AppRouter} from '../backend/trpc'
import { createTRPCReact, inferReactQueryProcedureOptions } from '@trpc/react-query'
import {defaultContext} from '@tanstack/react-query'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const trpc = createTRPCReact<AppRouter>({
  // Strange, https://github.com/TanStack/query/discussions/4619#discussioncomment-6132080
  reactQueryContext: defaultContext
});

export type ReactQueryOptions = inferReactQueryProcedureOptions<AppRouter>;
export type RouterInputs = inferRouterInputs<AppRouter>
export type RouterOutputs = inferRouterOutputs<AppRouter>
