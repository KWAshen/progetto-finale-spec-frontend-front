import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Destinations from './pages/Destinations';
import DestinationDetail from './pages/DestinationDetail';
import Compare from './pages/Compare';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Destinations />} />
        <Route path="/destinations" element={<Destinations />} />
        <Route path="/destinations/:id" element={<DestinationDetail />} />
        <Route path="/compare" element={<Compare />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;