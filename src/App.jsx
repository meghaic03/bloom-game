import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BloomGame from './components/BloomGame';
import CommentsPage from './components/CommentsPage';

function App() {
  return (
    <Router>
      <div className="p-4">
        <Routes>
          <Route path="/bloom" element={<BloomGame />} />
          <Route path="/bloom/comments" element={<CommentsPage />} />
          <Route path="/" element={<BloomGame />} /> {/* Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

/*import BloomGame from './components/BloomGame'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <BloomGame />
    </div>
  )
}

export default App*/

/*import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/