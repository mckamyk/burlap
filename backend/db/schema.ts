import {sqliteTable, text, integer, real} from 'drizzle-orm/sqlite-core'

// The sample DB file here has all of these fields filled.
// Going to assume NotNull for all
export const rawFindings = sqliteTable('raw_findings', {
  id: integer('id').primaryKey().notNull(),
  sourceSecurityToolName: text('source_security_tool_name').notNull(),
  sourceSecurityToolId: text('source_security_tool_Id').notNull(),
  sourceCollaborationToolName: text('source_collaberation_tool_name').notNull(),
  sourceCollaborationToolId: text('source_collaberation_tool_id').notNull(),
  severity: text('severity', {enum: ['low', 'medium', 'high', 'critical']}).notNull(),
  findingCreated: text('finding_created').notNull(),
  ticket_created: text('ticket_created').notNull(),
  description: text('description').notNull(),
  asset: text("asset").notNull(),
  status: text("status", {enum: ['fixed', 'open', 'in_progress']}).notNull(),
  remediationUrl: text("remediation_url").notNull(),
  remediationText: text("remediation_text").notNull(),
  groupedFindingId: integer("grouped_finding_id").notNull(),
})

export const groupedFindings = sqliteTable('grouped_findings', {
  id: integer('id').primaryKey().notNull(),
  groupingType: text("grouping_type").notNull(),
  grouping_key: text("grouping_key").notNull(),
  severity: text('severity', {enum: ['low', 'medium', 'high', 'critical']}).notNull(),
  groupedFindingCreated: text("grouped_finding_created").notNull(),
  sla: text("sla").notNull(),
  description: text("description").notNull(),
  securityAnalyst: text("security_analyst").notNull(),
  owner: text("owner").notNull(),
  workflow: text("workflow").notNull(),
  status: text("status", {enum: ['fixed', 'open', 'in_progress']}).notNull(),
  progress: real("progress").notNull(),
})
