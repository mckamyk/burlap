import {trpc} from '../trpc'
import type { GroupedFinding } from '../../backend/db/schema'
import { useState } from 'react'
import { FilterOptions } from '../App'
import { ArrowRightIcon, ClockIcon } from '@heroicons/react/20/solid'
import { twMerge } from 'tailwind-merge'

const pageSize = 15

export const GroupedList = ({filters}: {filters: FilterOptions}) => {
  const [page, setPage] = useState(0)
  const {data} = trpc.getGrouped.useQuery({limit: pageSize, offset: page*pageSize, filters})

  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-t-md flex justify-center items-center">
        {data && (
          <>
          <button className="p-2 hover:shadow-lg rounded-lg hover:bg-slate-800 transition-colors" disabled={!page} onClick={() => setPage(page - 1)}>{'<-'}</button>
            <span>Page {page+1}/{Math.ceil(data.total/pageSize)}</span>
          <button className="p-2" disabled={page+1 === Math.ceil(data.total/pageSize)} onClick={() => setPage(page + 1)}>{'->'}</button>
          </>
        )}
      </div>
      <div className="space-y-2 p-4 border-2 border-gray-700 rounded-b-md">
        {data && data.findings.map(g => (
          <GroupedFindingItem key={g.id} finding={g} />
        ))}
      </div>
    </div>
  )
}

const year = new Date(0).setUTCFullYear(1971)
const month = new Date(0).setUTCMonth(1)
const day = new Date(0).setUTCDate(2)

const formatDiff = (diff: number) => {
  let remain = diff
  const y = Math.floor(remain/year)
  remain = remain - y * year

  const m = Math.floor(remain/month)
  remain = remain - m * month

  const d = Math.floor(remain/day)

  if (y) {
    return `${y}y and ${m}mo ago`
  } else if (m) {
    return `${m}mo and ${d}d ago`
  } else if (d) {
    return `${d} day${d === 1 ? '' : 's'} ago`
  } else {
    return "<1 days ago"
  }
}

const GroupedFindingItem = ({finding}: {finding: GroupedFinding}) => {
  const diff = new Date().getTime() - new Date(finding.groupedFindingCreated).getTime()
  const diffString = formatDiff(diff)

  const progress = Math.floor(finding.progress*100).toString() + "%"
  console.log("progress", progress)

  return (
    <div className={twMerge("grid grid-cols-10 w-full h-10 px-2 bg-gray-700 items-center border border-transparent shadow")}>
      <div className="col-span-1 flex items-center">#{finding.id} <ClockIcon className="ml-2 text-yellow-500 h-4 w-4" /></div>
      <div className="col-span-1">
        <div className="text-xs">Owner</div>
        <div className="">
          {finding.owner}
        </div>
      </div>
      <div className="col-span-1">
        <div className="text-xs">Analyst</div>
        <div className="">
          {finding.securityAnalyst}
        </div>
      </div>
      <div className="col-span-2">{diffString}</div>

      <div className={twMerge("col-span-1 uppercase", finding.severity === "high" && "text-yellow-500 font-semibold", finding.severity === "critical" && "text-red-500 font-semibold")}>{finding.severity}</div>

      <div className="col-span-3">
        <div className="w-full h-6 bg-gray-800 relative rounded-full overflow-clip">
          <div className={`absolute h-6 left-0 bg-blue-600`} style={{width: progress}} />
          <div className="absolute w-full left-0 text-center">{progress}</div>
        </div>
      </div>
      <div className="col-span-1 flex justify-end"><ArrowRightIcon className="h-6 w-6" /></div>
    </div>
  )
}
