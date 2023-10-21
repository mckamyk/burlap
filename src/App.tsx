import { useState } from 'react'
import './App.css'
import { GroupedList } from './sections/RecordList'
import { trpc } from './trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
import { Filters } from './sections/Filters'
import { GroupedFinding } from '../backend/db/schema'
import { SeverityPie } from './sections/Pie'

export type FilterOptions = {
  owner?: string
  analyst?: string
  severity?: GroupedFinding['severity']
  status?: GroupedFinding['status']
}

function App() {
  const [queryClient] = useState(() => new QueryClient()) 
  const [trpcClient] = useState(() => trpc.createClient({
    links: [httpBatchLink({url: 'http://localhost:4000/trpc'})]
  }))

  const [filters, setFilters] = useState<FilterOptions>({})

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900 flex flex-col items-center">

          <div className="w-full bg-slate-900 h-16 text-center text-2xl italic font-bold">
            Burlap
          </div>

          <div className="max-w-[1200px] w-full grid grid-cols-4 gap-8">
            <div className="col-span-4 md:col-span-2 lg:col-span-1">
              <Filters filters={filters} setFilters={setFilters} />
            </div>
            <div className="col-span-4 md:col-span-2 lg:col-span-1 h-80 bg-green-800">
            </div>
            <div className="col-span-4 lg:col-span-2">
              <SeverityPie filters={filters} />
            </div>
          
            <div className="col-span-4">
              <GroupedList filters={filters} />
            </div>
          </div>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
