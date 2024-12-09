import { HashRouter as Router } from 'react-router-dom'; //changed this from BrowserRouter
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