import logo from './logo.svg';
import './App.css';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { useEffect } from 'react';
import { MyReports } from './components/MyReports';
import { Sidebar } from './components/Sidebar';


function AppContent() {
  const location = useLocation()


  return (
    <div className="bg-zinc-300 h-screen">
      <Navbar path={location.pathname} />
      <div className='flex'>
        <Sidebar />
        <Routes>
          <Route exact path="/" component={<Home />} />
          <Route  path="/my-reports" component={<MyReports />} />
        </Routes>

      </div>
    </div>
      
    
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
