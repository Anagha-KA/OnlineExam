import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Database, FileText, BarChart, LogOut, LayoutDashboard } from 'lucide-react';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to highlight the active menu item
  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0a0b14', color: 'white' }}>
      
      {/* Sidebar Section */}
      <div style={{ 
        width: '260px', 
        background: '#11121d', 
        padding: '25px', 
        borderRight: '1px solid #1f212e',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ color: '#00d1ff', marginBottom: '40px', letterSpacing: '1px' }}>Nebula LMS</h2>
        
        <nav style={{ flex: 1 }}>
          <SidebarItem 
            icon={<Database size={20}/>} 
            label="Question Bank" 
            to="/admin/questions" 
            active={isActive('/admin/questions')} 
          />
          <SidebarItem 
            icon={<FileText size={20}/>} 
            label="Exam Builder" 
            to="/admin/builder" 
            active={isActive('/admin/builder')} 
          />
          <SidebarItem 
            icon={<BarChart size={20}/>} 
            label="Reports & Analytics" 
            to="/admin/reports" 
            active={isActive('/admin/reports')} 
          />
        </nav>

        {/* Bottom Section: Logout */}
        <div style={{ borderTop: '1px solid #1f212e', paddingTop: '20px' }}>
          <button 
            onClick={() => navigate('/')} 
            style={logoutButtonStyle}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: '#0a0b14' }}>
        {children}
      </div>
    </div>
  );
};

// Sub-component for Sidebar Items to keep code clean
const SidebarItem = ({ icon, label, to, active }) => (
  <Link to={to} style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '15px', 
    padding: '12px 15px', 
    textDecoration: 'none', 
    borderRadius: '10px', 
    marginBottom: '8px',
    transition: '0.3s',
    color: active ? '#fff' : '#8b8d97',
    background: active ? 'rgba(0, 209, 255, 0.1)' : 'transparent',
    borderLeft: active ? '4px solid #00d1ff' : '4px solid transparent'
  }}>
    {icon} 
    <span style={{ fontWeight: active ? 'bold' : 'normal' }}>{label}</span>
  </Link>
);

const logoutButtonStyle = {
  width: '100%',
  background: 'none',
  border: 'none',
  color: '#ff4d4d',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '10px',
  fontSize: '16px',
  fontWeight: 'bold'
};

export default AdminLayout;