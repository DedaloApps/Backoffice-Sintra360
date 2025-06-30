import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar'; // Aqui usas mesmo o ficheiro Sidebar.tsx

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <Sidebar /> {/* A sidebar está aqui */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
