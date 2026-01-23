import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BarberPage from './pages/BarberPage'; // Tu contenido actual
import VciousPage from './pages/VciousPage'; // La nueva tienda

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta principal de la Barbería */}
        <Route path="/" element={<BarberPage />} />
        
        {/* Nueva ruta exclusiva para tu marca de ropa */}
        <Route path="/v-cious" element={<VciousPage />} />
      </Routes>
    </Router>
  );
};

export default App;
