import { useState } from 'react'
import './App.css'
import { GroupedList } from './RecordList'
import { trpc } from './trpc'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'

function App() {
  const [queryClient] = useState(() => new QueryClient()) 
  const [trpcClient] = useState(() => trpc.createClient({
    links: [httpBatchLink({url: 'http://localhost:4000/trpc'})]
  }))

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-slate-900 flex flex-col items-center">
          <div className="w-[1200px]">
            <GroupedList />
          </div>
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  )
}

export default App
