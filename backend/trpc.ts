import { initTRPC } from "@trpc/server"
import { z } from "zod"
import * as trpcExpress from "@trpc/server/adapters/express"
import { inferAsyncReturnType } from '@trpc/server';
import {db} from './db/db'
import { rawFindings } from "./db/schema";

// If we chose to add context to requests, add it here.
export const createContext = (_: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  greetMe: t.procedure.input(z.object({name: z.string()})).output(z.string()).query(i => {
    return `Hello, ${i.input.name}`
  }),
  getRaws: t.procedure.query(() => {
    return db.select().from(rawFindings)
  })
})

export type AppRouter = typeof appRouter
