import './App.css';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { MyReports } from './components/MyReports';
import { Sidebar } from './components/Sidebar';
import { SignIn } from './components/SignIn';


function AppContent() {
  const location = useLocation()



  return (
    <div className="bg-zinc-300 h-screen">
      {/* <Navbar path={location.pathname} /> */}
      <SignIn />
      {/* <div className='flex gap-6'>
        <Sidebar />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route  path="/my-reports" element={<MyReports />} />
        </Routes>
        
      </div> */}
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
