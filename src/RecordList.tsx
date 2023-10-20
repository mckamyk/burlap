import {trpc} from './trpc'
import type { GroupedFinding } from '../backend/db/schema'
import { useState } from 'react'

export const GroupedList = () => {
  const [page, setPage] = useState(0)
  const {data} = trpc.getGrouped.useQuery({limit: 25, offset: page*25})

  return (
    <div className="w-full">
      <div className="bg-slate-700 rounded flex justify-end items-center">
        {data && (
          <>
          <button className="p-2 hover:shadow-lg rounded-lg hover:bg-slate-800 transition-colors" disabled={!page} onClick={() => setPage(page - 1)}>{'<-'}</button>
            <span>Page {page+1}/{Math.ceil(data.total/25)}</span>
          <button className="p-2" disabled={page+1 === Math.ceil(data.total/25)} onClick={() => setPage(page + 1)}>{'->'}</button>
          </>
        )}
      </div>
      {data && data.findings.map(g => (
        <GroupedFindingItem key={g.id} finding={g} />
      ))}
    </div>
  )
}

const GroupedFindingItem = ({finding}: {finding: GroupedFinding}) => {
  return (
    <div className="grid grid-cols-8 w-full justify-between">
      <div className="cols-span-1">{finding.id}</div>
      <div className="cols-span-1">{finding.status}</div>
      <div className="cols-span-1">{finding.owner}</div>
      <div className="cols-span-1">{finding.securityAnalyst}</div>
      <div className="cols-span-1">{finding.severity}</div>
    </div>
  )
}
