import {trpc} from '../trpc'
import type { GroupedFinding, RawFinding } from '../../backend/db/schema'
import { useState } from 'react'
import { FilterOptions } from '../App'
import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, DocumentPlusIcon } from '@heroicons/react/20/solid'
import { twMerge } from 'tailwind-merge'
import { Listbox } from '@headlessui/react'

const pageSize = 15

export const GroupedList = ({filters}: {filters: FilterOptions}) => {
  const [page, setPage] = useState(0)
  const {data, isLoading } = trpc.getGrouped.useQuery({limit: pageSize, offset: page*pageSize, filters})
  const [selectedRecord, setSelectedRecord] = useState<GroupedFinding | undefined>();

  return (
    <div className="w-full">
      <div className="bg-gray-700 rounded-t-md flex justify-center items-center py-1">
        {selectedRecord && (
          <div>Finding Group #{selectedRecord.id}</div>
        ) || (
          <>
            <button className="p-1 hover:shadow-lg rounded-lg hover:bg-gray-800 transition-colors" disabled={!page} onClick={() => setPage(page - 1)}>
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
              <span className="mx-2">Page {page+1}/{data ? Math.ceil(data.total/pageSize) : '-'}</span>
            <button className="p-1 hover:shadow-lg rounded-lg hover:bg-gray-800 transition-colors" disabled={data && page+1 === Math.ceil(data.total/pageSize)} onClick={() => setPage(page + 1)}>
                <ArrowRightIcon className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      <div className="space-y-2 p-4 border-2 border-gray-700 rounded-b-md h-[748px]">
        {isLoading && <Loading />}
        {selectedRecord && (
          <SelectedGroupedFinding finding={selectedRecord} setFinding={setSelectedRecord} />
        )}
        {!selectedRecord && data && data.findings.map(g => (
          <GroupedFindingItem key={g.finding.id} finding={g.finding} raws={g.raws || 0} setSelected={setSelectedRecord} />
        ))}
      </div>
    </div>
  )
}

const year = new Date(0).setUTCFullYear(1971)
const month = new Date(0).setUTCMonth(1)
const day = new Date(0).setUTCDate(2)

const Loading = () => {
  const arr = new Array(pageSize).fill(0, 0, 15)

  return (
    <>
      {arr.map((_, i) => (
        <div className="h-10 bg-gray-700 animate-pulse" key={i} />
      ))}
    </>
  )
}

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

const GroupedFindingItem = ({finding, setSelected, raws}: {finding: GroupedFinding, setSelected: (finding: GroupedFinding) => void, raws: number}) => {
  const diff = new Date().getTime() - new Date(finding.groupedFindingCreated).getTime()
  const diffString = formatDiff(diff)

  const progress = Math.floor(finding.progress*100).toString() + "%"

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
          <div className={`absolute h-6 left-0 bg-gradient-to-r from-blue-800 to-blue-600`} style={{width: progress}} />
          <div className="absolute w-full left-0 text-center">{progress}</div>
        </div>
      </div>


      <div className="col-span-1 flex justify-end">
        <div onClick={() => setSelected(finding)} className="hover:bg-white/25 -m-2 pb-[6px] pt-[7px] cursor-pointer pl-2">
          <span className="text-sm">
            {raws} Findings
          </span>
          <ArrowRightIcon className="inline h-6 w-6" />
        </div>
      </div>
    </div>
  )
}

const SelectedGroupedFinding = ({finding, setFinding}: {finding: GroupedFinding, setFinding: (finding: GroupedFinding | undefined) => void}) => {
  const {data, isLoading} = trpc.getRaws.useQuery({id: finding.id})
  const {data: owners, isLoading: ownersLoading} = trpc.getPossibleOwners.useQuery()
  const {mutate} = trpc.changeOwner.useMutation()
  const [owner, setOwner] = useState<string>(finding.owner)

  const ownerChange = (owner: string) => {
    setOwner(owner)
    mutate({ id: finding.id, owner })
  }
  
  return (
    <>
      <div onClick={() => setFinding(undefined)} className="hover:bg-white/25 -mt-4 -ml-4 p-4 w-16 transition-colors">
        <ArrowLeftIcon className="h-6 w-6" />
      </div>
      <div className="grid grid-cols-2">
        <div className="grid grid-cols-3 gap-2">
          <div className="">
            <div className="text-xs font-bold text-gray-400">Owner</div>
            <Listbox value={owner} onChange={ownerChange}>
              <div className="relative">
                <Listbox.Button className="bg-gray-700 rounded-md shadow shadow-gray-400/50 h-8 flex items-center w-full overflow-clip">
                  <div className="grow">
                    {owner || ""}
                  </div>
                  <ArrowDownIcon className="h-4 w-4 mr-2" />
                </Listbox.Button>
                <Listbox.Options className="rounded-md top-9 absolute w-full overflow-clip z-10 shadow shadow-gray-400/50">
                  {!ownersLoading && owners && owners.map(owner => (
                    <Listbox.Option className="hover:bg-gray-500 transition-colors px-2 py-1 bg-gray-700 cursor-pointer flex justify-between" key={owner} value={owner}>
                      <span>{owner}</span>
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div className="">
            <div className="text-xs font-bold text-gray-400">Analyst</div>
            <div>{finding.securityAnalyst}</div>
          </div>

          <div className="">
            <div className="text-xs font-bold text-gray-400">Severity</div>
            <div>{finding.severity}</div>
          </div>

          <div className="">
            <div className="text-xs font-bold text-gray-400">Created</div>
            <div>{new Date(finding.groupedFindingCreated).toLocaleString()}</div>
          </div>

          <div className="">
            <div className="text-xs font-bold text-gray-400">SLA</div>
            <div>{new Date(finding.sla).toLocaleString()}</div>
          </div>

          <div className="">
            <div className="text-xs font-bold text-gray-400">Workflow</div>
            <div>{finding.workflow}</div>
          </div>
        </div>

        <div className="relative border-2 border-gray-600 p-2 rounded-md">
          <div className="absolute -top-2.5 left-2 bg-slate-900 px-1 text-xs">Description</div>
          <div>{finding.description}</div>
        </div>
      </div>

      <div className="h-2" />

      <div className="relative border-2 border-gray-600 h-[535px] rounded-md">
        <div className="absolute -top-4 bg-slate-900 px-1">Raw Findings</div>
        <div className="p-4 overflow-y-auto h-full space-y-2">
          {isLoading && 
            new Array(1).fill(0, 0, 1).map((_, x) => (
              <div key={x} className="bg-gray-800 animate-pulse h-[128px]" />
          ))}
          {data && data.map(d => <RawFinding key={d.id} finding={d} />)}
        </div>
      </div>
    </>
  )
}

const RawFinding = ({finding}: {finding: RawFinding}) => {

  const statusIcon = finding.status === 'open' ? <span className="text-sm text-cyan-500"><DocumentPlusIcon className="inline h-4 w-4" /> Open</span>
                    : finding.status === 'fixed' ? <span className="text-sm text-green-500"><CheckIcon className="inline h-4 w-4" /> Fixed</span>
                    : <span className="text-sm text-yellow-500"><ClockIcon className="inline h-4 w-4" /> In Progress</span>

  return (
    <div className="bg-gray-700 p-2">
      <div className="flex items-center gap-2">
        #{finding.id} - <span className={twMerge(finding.severity === "critical" && "text-red-500" || finding.severity === 'high' && "text-yellow-500" || "", "uppercase")}>{finding.severity}</span>
         - {statusIcon}
      </div>

      <div className="flex justify-left gap-4">
        <div>
          <div className="text-xs text-gray-400 font-bold">Finding Created</div>
          <div>{new Date(finding.findingCreated).toLocaleString()}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400 font-bold">Ticket Created</div>
          <div>{new Date(finding.ticket_created).toLocaleString()}</div>
        </div>

        <div>
          <div className="text-xs text-gray-400 font-bold">Asset</div>
          <div>{finding.asset}</div>
        </div>
      </div>
      <div className="bg-slate-800 p-2 mt-2">
        {finding.description}
      </div>
    </div>
  )
}
