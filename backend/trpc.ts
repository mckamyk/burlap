import { initTRPC } from "@trpc/server"
import { z } from "zod"
import * as trpcExpress from "@trpc/server/adapters/express"
import { inferAsyncReturnType } from '@trpc/server';

// If we chose to add context to requests, add it here.
export const createContext = (_: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  greetMe: t.procedure.input(z.object({name: z.string()})).output(z.string()).query(i => {
    return `Hello, ${i.input.name}`
  })
})

export type AppRouter = typeof appRouter
