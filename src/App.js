import {Routes , Route, Navigate } from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Resume from './components/Resume/Resume';
import ProtectedRoute from './components/Resume/ProtectedRoute'
import JobDashBoard from './components/Jobs/JobDashboard'

 
function App() {
  return (
   <div className="App">
    <Routes>
    <Route path='/' element={<Navigate to='/user/register'/>}/>
    <Route path='/user/register' element={<Register/>}/>
    <Route path='/user/login' element={<Login/>}/>
    <Route path='/user/resume/analyze' element={<ProtectedRoute>
      <Resume />
    </ProtectedRoute>
  }/>

  <Route path="user/add/job" element={<ProtectedRoute>
    <JobDashBoard/>
  </ProtectedRoute>}/>
    </Routes>
   </div>
  );
}

export default App;
