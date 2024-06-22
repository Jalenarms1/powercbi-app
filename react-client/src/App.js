import './App.css';
import { Navbar } from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { Home } from './components/Home';
import { MyReports } from './components/MyReports';
import { Sidebar } from './components/Sidebar';
import { SignIn } from './components/SignIn';
import './axiosSetup.js'
import { isAuthenticated } from './jwt-helper.js';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ContainerProvider } from './context/ContainerContext.jsx';

function AppContent() {
  const location = useLocation()

  const {user} = useAuth()
  console.log(user);

  return (
    <div className="bg-white h-screen">
      
        <Navbar path={location.pathname} />
        {!user ? <SignIn /> : 
        (
          <div className='flex gap-6'>
            <Sidebar />
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route  path="/my-reports" element={<MyReports />} />
            </Routes>
            
          </div>
        )}

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
      <AuthProvider>
        <ContainerProvider>
          <AppContent />

        </ContainerProvider>

      </AuthProvider>
    </Router>
  );
}

export default App;
