import { useState } from 'react'
import Dashboard from './components/dashboard'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Dashboard />
    </div>
  )
}

export default App
