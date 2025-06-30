import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaUserPlus,
  FaBug,
  FaLightbulb,
  FaCalendarAlt,
  FaBell,
  FaSignOutAlt
} from 'react-icons/fa';

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-[#0089a7] text-white flex flex-col">
      {/* Topo - Branding e Navegação */}
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Sintra 360</h1>
        <nav className="flex flex-col gap-1">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaHome /> Dashboard
          </NavLink>
          <NavLink to="/participantes" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaUserPlus /> Participantes
          </NavLink>
          <NavLink to="/propostas" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaLightbulb /> Propostas
          </NavLink>
          <NavLink to="/problemas" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaBug /> Problemas
          </NavLink>
          <NavLink to="/agenda" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaCalendarAlt /> Agenda
          </NavLink>
          <NavLink to="/notificacoes" className={({ isActive }) => isActive ? 'bg-[#007c94] px-4 py-3 rounded flex items-center gap-2' : 'hover:bg-[#007c94] px-4 py-3 rounded flex items-center gap-2'}>
            <FaBell /> Notificações
          </NavLink>
        </nav>
      </div>

      {/* Espaçador que empurra o conteúdo para o fundo */}
      <div className="flex-grow"></div>

      {/* Fundo - Logout e Logo */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white px-4 py-3 hover:bg-[#007c94] w-full text-left rounded"
        >
          <FaSignOutAlt className="text-lg" />
          <span>Logout</span>
        </button>

      </div>
    </div>
  );
}
