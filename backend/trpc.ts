import { initTRPC } from "@trpc/server"
import { z } from "zod"
import * as trpcExpress from "@trpc/server/adapters/express"
import { inferAsyncReturnType } from '@trpc/server';
import {db} from './db/db'
import { groupedFindings, rawFindings } from "./db/schema";
import { sql, eq, and } from "drizzle-orm";
import { FilterOptions } from "../src/App";

// If we chose to add context to requests, add it here.
export const createContext = (_: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create();

const filtersInput = z.object({
  owner: z.string().optional(),
  analyst: z.string().optional(),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  status: z.enum(['fixed', 'in_progress', 'open']).optional(),
})

const buildFilterArray = (filters: FilterOptions) => {
  const out = []
  if (filters.owner) out.push(eq(groupedFindings.owner, filters.owner))
  if (filters.analyst) out.push(eq(groupedFindings.securityAnalyst, filters.analyst))
  if (filters.severity) out.push(eq(groupedFindings.severity, filters.severity))
  if (filters.status) out.push(eq(groupedFindings.status, filters.status))

  return and(...out)
}

export const appRouter = t.router({
  getRaws: t.procedure.query(() => {
    return db.select().from(rawFindings)
  }),

  getGrouped: t.procedure
    .input(z.object({
      limit: z.number().min(1),
      offset: z.number().min(0),
      filters: filtersInput.optional(),
    }).optional())
    .query(async ({input}) => {
    const filters = buildFilterArray(input?.filters || {})
    const total = await db.select({count: sql<number>`count(*)`}).from(groupedFindings).where(filters).then(r => r[0].count)
    const findings = await db.select().from(groupedFindings).where(filters).limit(input?.limit || 25).offset(input?.offset || 0)
    return {
      total, findings
    }
  }),

  getFilterOptions: t.procedure
    .input(filtersInput)
    .output(z.object({
      owner: z.array(z.object({
        owner: z.string(),
        count: z.number(),
      })),
      analyst: z.array(z.object({
        analyst: z.string(),
        count: z.number(),
      })),
      severity: z.array(z.object({
        severity: z.enum(['low', 'medium', 'high', 'critical']),
        count: z.number(),
      })),
      status: z.array(z.object({
        status: z.enum(['fixed', 'in_progress', 'open']),
        count: z.number(),
      })),
    })).query( async ({input}) => {

    const filters = buildFilterArray(input)

    const owner = db.select({count: sql<number>`count(${groupedFindings.owner})`, owner: groupedFindings.owner}).from(groupedFindings).groupBy(groupedFindings.owner).where(filters)
    const analyst = db.select({count: sql<number>`count(${groupedFindings.securityAnalyst})`, analyst: groupedFindings.securityAnalyst}).from(groupedFindings).groupBy(groupedFindings.securityAnalyst).where(filters)
    const status = db.select({count: sql<number>`count(${groupedFindings.status})`, status: groupedFindings.status}).from(groupedFindings).groupBy(groupedFindings.status).where(filters)
    const severity = db.select({count: sql<number>`count(${groupedFindings.severity})`, severity: groupedFindings.severity}).from(groupedFindings).groupBy(groupedFindings.severity).where(filters)

    return {
      owner: await owner.then(r => r.sort((a, b) => b.count - a.count)),
      analyst: await analyst.then(r => r.sort((a, b) => b.count - a.count)),
      status: await status.then(r => r.sort((a, b) => b.count - a.count)),
      severity: await severity.then(r => r.sort((a, b) => b.count - a.count)),
    }
  })
})

export type AppRouter = typeof appRouter
