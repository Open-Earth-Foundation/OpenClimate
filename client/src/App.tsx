import { BrowserRouter } from 'react-router-dom';
import './App.css';
import MainLayout from './layouts/main-layout/main.layout';

function App() {
  return (
    <BrowserRouter>
        <MainLayout />
    </BrowserRouter>
  );
}

export default App;
