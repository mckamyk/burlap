import { ArrowDownIcon, XMarkIcon } from "@heroicons/react/20/solid"
import { FilterOptions } from "../App"
import { trpc } from "../trpc"
import {Listbox, RadioGroup} from '@headlessui/react'
import { twMerge } from "tailwind-merge"

type StatusItem = {
  name: string
  value: FilterOptions['status']
  count?: number
}
type SevItem = {
  name: string
  value: FilterOptions['severity']
  count?: number
}

export const Filters = ({filters, setFilters}: {filters: FilterOptions, setFilters: (filters: FilterOptions) => void}) => {
  const {data, isLoading} = trpc.getFilterOptions.useQuery(filters)

  const stati: StatusItem[] = [
    { // count is undefined if data itself doesn't exist, 0 if it doesn but that item doesn't exist
      name: 'Open',
      value: 'open',
      count: data ? data.status.find(a => a.status === 'open')?.count || 0 : undefined
    },
    {
      name: 'In Progress',
      value: 'in_progress',
      count: data ? data.status.find(a => a.status === 'in_progress')?.count || 0 : undefined
    },
    {
      name: 'Fixed',
      value: 'fixed',
      count: data ? data.status.find(a => a.status === 'fixed')?.count || 0 : undefined
    },
  ]

  const sevs: SevItem[] = [
    {
      name: 'Critical',
      value: 'critical',
      count: data ? data.severity.find(a => a.severity === 'critical')?.count || 0 : undefined
    },
    {
      name: 'High',
      value: 'high',
      count: data ? data.severity.find(a => a.severity === 'high')?.count || 0 : undefined
    },
    {
      name: 'Medium',
      value: 'medium',
      count: data ? data.severity.find(a => a.severity === 'medium')?.count || 0 : undefined
    },
    { // count is undefined if data itself doesn't exist, 0 if it doesn but that item doesn't exist
      name: 'Low',
      value: 'low',
      count: data ? data.severity.find(a => a.severity === 'low')?.count || 0 : undefined
    },
  ]

  return (
    <div className="relative h-full border-2 border-gray-700 rounded-lg">
      <div className="absolute -top-[19px] left-3 px-2 py-1 bg-slate-900 font-bold text-gray-200">Filters</div>

      <div className="p-4">
        <Listbox value={filters.owner || ""} onChange={(opt) => setFilters({...filters, owner: opt})}>
          <div className="text-sm text-gray-400 font-semibold pl-2">Owner:</div>
          <div className="relative">
            <Listbox.Button className="bg-gray-700 rounded-md shadow shadow-gray-400/50 h-8 flex items-center w-full overflow-clip">
              <div className="grow">
                {filters.owner || ""}
              </div>
              {filters.owner ? (
                <XMarkIcon onClick={(e) => {setFilters({...filters, owner: undefined}); e.preventDefault()}} className="h-8 w-8 p-2 hover:bg-gray-500 transition-colors" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-2" />
              )}
            </Listbox.Button>
            <Listbox.Options className="rounded-md top-9 absolute w-full overflow-clip z-10 shadow shadow-gray-400/50">
              {!isLoading && data && data.owner.map(owner => (
                <Listbox.Option className="hover:bg-gray-500 transition-colors px-2 py-1 bg-gray-700 cursor-pointer flex justify-between" key={owner.owner} value={owner.owner}>
                  <span>{owner.owner}</span> <span>({owner.count})</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <Listbox value={filters.analyst || ""} onChange={(opt) => setFilters({...filters, analyst: opt})}>
          <div className="text-sm text-gray-400 font-semibold pl-2">Analyst:</div>
          <div className="relative">
            <Listbox.Button className="bg-gray-700 rounded-md shadow shadow-gray-400/50 h-8 flex items-center w-full overflow-clip">
              <div className="grow">
                {filters.analyst || ""}
              </div>
              {filters.analyst ? (
                <XMarkIcon onClick={(e) => {setFilters({...filters, analyst: undefined}); e.preventDefault()}} className="h-8 w-8 p-2 hover:bg-gray-500 transition-colors" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 mr-2" />
              )}
            </Listbox.Button>
            <Listbox.Options className="rounded-md top-9 absolute w-full overflow-clip shadow shadow-gray-400/50">
              {!isLoading && data && data.analyst.map(analyst => (
                <Listbox.Option className="hover:bg-gray-500 transition-colors px-2 py-1 bg-gray-700 cursor-pointer flex justify-between" key={analyst.analyst} value={analyst.analyst}>
                  <span>{analyst.analyst}</span> <span>({analyst.count})</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </Listbox>

        <RadioGroup value={filters.status || ""} onChange={(opt: FilterOptions['status']) => setFilters({...filters, status: opt})}>
          <RadioGroup.Label className="text-sm text-gray-400 pl-2 font-semibold">Status:</RadioGroup.Label>
          <div className="rounded-md overflow-clip">
            {stati.map(stat => (
              <RadioGroup.Option key={stat.name} value={stat.value} className={({checked}) => twMerge("bg-gray-700 hover:bg-gray-500 flex items-center justify-between border-b border-b-gray-500 transition-colors last:border-none", checked && "bg-blue-800 hover:bg-blue-600")}>
                {({checked}) => (
                  <>
                    {checked ? <XMarkIcon onClick={() => setFilters({...filters, status: undefined})} className="h-8 w-8 p-1 text-white hover:bg-red-800" /> : <span className="h-8 w-8 p-1" />}
                    <span className="grow pl-1">{stat.name}</span>
                    <span className="pr-2">({stat.count})</span>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        <RadioGroup value={filters.severity || ""} onChange={(opt: FilterOptions['severity']) => setFilters({...filters, severity: opt})}>
          <RadioGroup.Label className="text-sm text-gray-400 pl-2 font-semibold">Severity:</RadioGroup.Label>
          <div className="rounded-md overflow-clip">
            {sevs.map(stat => (
              <RadioGroup.Option key={stat.name} value={stat.value} className={({checked}) => twMerge("bg-gray-700 hover:bg-gray-500 flex items-center justify-between border-b border-b-gray-500 transition-colors last:border-none", checked && "bg-blue-800 hover:bg-blue-600")}>
                {({checked}) => (
                  <>
                    {checked ? <XMarkIcon onClick={() => setFilters({...filters, severity: undefined})} className="h-8 w-8 p-1 text-white hover:bg-red-800" /> : <span className="h-8 w-8 p-1" />}
                    <span className="grow pl-1">{stat.name}</span>
                    <span className="pr-2">({stat.count})</span>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}
