import type {AppRouter} from '../backend/trpc'
import { createTRPCReact } from '@trpc/react-query'
import {defaultContext} from '@tanstack/react-query'

export const trpc = createTRPCReact<AppRouter>({
  // Strange, https://github.com/TanStack/query/discussions/4619#discussioncomment-6132080
  reactQueryContext: defaultContext
});
