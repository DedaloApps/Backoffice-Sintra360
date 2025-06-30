import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaExclamationTriangle, FaLightbulb, FaCalendarAlt } from 'react-icons/fa';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import logo from '../assets/DEDALOCREATIVE.png';
import logosintra from '../assets/logo.png';

const Dashboard = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({
    participantes: 0,
    problemas: 0,
    propostas: 0,
    agenda: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const participantesSnapshot = await getDocs(collection(db, 'participantes'));
      const problemasSnapshot = await getDocs(collection(db, 'problemas'));
      const propostasSnapshot = await getDocs(collection(db, 'propostas'));
      const agendaSnapshot = await getDocs(collection(db, 'agenda'));

      setCounts({
        participantes: participantesSnapshot.size,
        problemas: problemasSnapshot.size,
        propostas: propostasSnapshot.size,
        agenda: agendaSnapshot.size,
      });
    };

    fetchData();
  }, []);

  const cards = [
    {
      label: 'Participantes',
      path: '/participantes',
      icon: <FaUsers className="text-4xl mb-2" />,
      count: counts.participantes,
    },
    {
      label: 'Problemas',
      path: '/problemas',
      icon: <FaExclamationTriangle className="text-4xl mb-2" />,
      count: counts.problemas,
    },
    {
      label: 'Propostas',
      path: '/propostas',
      icon: <FaLightbulb className="text-4xl mb-2" />,
      count: counts.propostas,
    },
    {
      label: 'Eventos',
      path: '/agenda',
      icon: <FaCalendarAlt className="text-4xl mb-2" />,
      count: counts.agenda,
    }
  ];

  return (
    
    <div className="flex flex-col flex-1 bg-gray-100 min-h-screen p-8">
    <div className="flex flex-col items-center mb-2">
      <img
        src={logosintra}
        alt="Sintra 360"
        className="w-52 object-contain mb-2"
      />
      <h1 className="text-2xl font-bold text-[#0089a7] text-center">
        Dashboard Geral
      </h1>
    </div>
  
    <p className="text-center text-sm text-gray-600 mb-10">
      Resumo dos dados da aplicação Sintra 360
    </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.path)}
            className="cursor-pointer bg-white rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center hover:shadow-lg transition duration-200"
          >
            <div className="text-[#0089a7]">{card.icon}</div>
            <p className="text-xl font-bold">{card.count}</p>
            <p className="text-gray-600">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-10 flex flex-col items-center pb-4">
        <p className="text-sm text-gray-500 mb-2 text-center">Desenvolvido por:</p>
        <img
          src={logo}
          alt="Dédalo Creative"
          className="w-32 h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default Dashboard;
