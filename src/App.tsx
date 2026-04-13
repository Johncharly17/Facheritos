import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarberPage from './pages/BarberPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BarberPage />} />
      </Routes>
    </Router>
  );
};

export default App;
