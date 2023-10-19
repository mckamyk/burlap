import './App.css'
import { Providers } from './Providers'
import { RecordList } from './RecordList'

function App() {
  return (
    <Providers>
      <div className="bg-slate-900 min-h-screen">
        <RecordList />
      </div>
    </Providers>
  )
}

export default App
