import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BloomGame from './components/BloomGame';
import CommentsPage from './components/CommentsPage';
import TestPage from './components/test';


function App() {
  return (
    <Router basename="/">      
      <div className="p-4">
        <Routes>
          <Route path="/bloom/comments" element={<CommentsPage />} />
          <Route path="/bloom" element={<BloomGame />} />
          <Route path="/bloom/test" element={<TestPage />} />
          {/*<Route path="/" element={<BloomGame />} />  Default route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;