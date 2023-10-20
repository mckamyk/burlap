import { initTRPC } from "@trpc/server"
import { z } from "zod"
import * as trpcExpress from "@trpc/server/adapters/express"
import { inferAsyncReturnType } from '@trpc/server';
import {db} from './db/db'
import { groupedFindings, rawFindings } from "./db/schema";
import { sql } from "drizzle-orm";

// If we chose to add context to requests, add it here.
export const createContext = (_: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getRaws: t.procedure.query(() => {
    return db.select().from(rawFindings)
  }),
  getGrouped: t.procedure
    .input(z.object({
      limit: z.number().min(1),
      offset: z.number().min(0)
    }).optional())
    .query(async ({input}) => {
    const total = await db.select({count: sql<number>`count(*)`}).from(groupedFindings).then(r => r[0].count)
    const findings = await db.select().from(groupedFindings).limit(input?.limit || 25).offset(input?.offset || 0)
    return {
      total, findings
    }
  })
})

export type AppRouter = typeof appRouter
