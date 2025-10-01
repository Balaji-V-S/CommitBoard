import { useState } from 'react'
import Dashboard from './components/dashboard'
import Footer from './components/footer'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Dashboard />
      <Footer/>
    </div>
  )
}

export default App
