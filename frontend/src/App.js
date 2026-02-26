import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import the new Signup page
import QuestionBank from './pages/admin/QuestionBank';
import ExamBuilder from './pages/admin/ExamBuilder';
import Reports from './pages/admin/Reports';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamPortal from './pages/student/ExamPortal';
import AdminLayout from './components/AdminLayout'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* NEW: Signup Route */}
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route path="/admin/questions" element={<QuestionBank />} />
        <Route path="/admin/builder" element={<ExamBuilder />} />
        <Route path="/admin/reports" element={<Reports />} />
        
        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/exam/:examId" element={<ExamPortal />} />
      </Routes>
    </Router>
  );
}

export default App;