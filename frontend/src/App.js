// import { useState } from 'react';
import './App.css';
// import MainPage from './pages/home/MainPage.jsx';
import LayoutRoutes from './Routes/LayoutRoutes.jsx'

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <LayoutRoutes />
    </div>
  );
}

export default App;
