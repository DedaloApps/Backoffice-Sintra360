import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { FaSortUp, FaSortDown, FaDownload } from 'react-icons/fa';
import * as XLSX from 'xlsx';

type Participante = {
  id: string;
  nome: string;
  email: string;
  telemovel: string;
  freguesia: string;
  criadoEm: any;
};

export default function Participantes() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [ordemAscendente, setOrdemAscendente] = useState(true);

  useEffect(() => {
    const fetchParticipantes = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'participantes'));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Participante[];

        setParticipantes(lista);
      } catch (error) {
        console.error('❌ Erro ao buscar participantes:', error);
      }
    };

    fetchParticipantes();
  }, []);

  const participantesOrdenados = [...participantes].sort((a, b) => {
    const dataA = a.criadoEm?.toDate?.()?.getTime?.() ?? 0;
    const dataB = b.criadoEm?.toDate?.()?.getTime?.() ?? 0;
    return ordemAscendente ? dataA - dataB : dataB - dataA;
  });

  const exportarParaExcel = () => {
    const dados = participantesOrdenados.map((p) => ({
      Nome: p.nome,
      Email: p.email,
      Telemóvel: p.telemovel,
      Freguesia: p.freguesia,
      Data: p.criadoEm?.toDate?.().toLocaleString?.() ?? '-'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participantes');
    XLSX.writeFile(workbook, 'participantes.xlsx');
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#0089a7]">Participantes</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOrdemAscendente(!ordemAscendente)}
            className="flex items-center gap-1 text-[#0089a7] text-sm font-semibold hover:underline"
          >
            {ordemAscendente ? <FaSortUp /> : <FaSortDown />}
            Ordenar por data
          </button>

          <button
            onClick={exportarParaExcel}
            className="flex items-center gap-2 px-3 py-2 bg-[#0089a7] text-white text-sm rounded hover:bg-[#00768f]"
          >
            <FaDownload />
            Exportar Excel
          </button>
        </div>
      </div>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0089a7] text-white">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Telemóvel</th>
              <th className="px-4 py-2">Freguesia</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {participantesOrdenados.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.nome}</td>
                <td className="px-4 py-2">{p.email}</td>
                <td className="px-4 py-2">{p.telemovel}</td>
                <td className="px-4 py-2">{p.freguesia}</td>
                <td className="px-4 py-2">
                  {p.criadoEm?.toDate?.().toLocaleString?.() ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
