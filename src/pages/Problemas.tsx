import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

type Problema = {
  id: string;
  nome: string;
  email: string;
  descricao: string;
  imagem: string;
  localizacao: string;
  criadoEm: any;
};

export default function Problemas() {
  const [problemas, setProblemas] = useState<Problema[]>([]);
  const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

  useEffect(() => {
    const fetchProblemas = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'problemas'));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Problema[];

        setProblemas(lista);
      } catch (error) {
        console.error('❌ Erro ao buscar problemas:', error);
      }
    };

    fetchProblemas();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#0089a7] mb-6">Problemas Reportados</h2>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0089a7] text-white">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2">Localização</th>
              <th className="px-4 py-2">Imagem</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {problemas.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.nome}</td>
                <td className="px-4 py-2">{p.email}</td>
                <td className="px-4 py-2">{p.descricao}</td>
                <td className="px-4 py-2">{p.localizacao}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setImagemSelecionada(p.imagem)}
                    className="text-blue-600 underline"
                  >
                    Ver imagem
                  </button>
                </td>
                <td className="px-4 py-2">
                  {p.criadoEm?.toDate?.().toLocaleString?.() ?? '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal da Imagem */}
      {imagemSelecionada && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white rounded p-4 max-w-xl w-full shadow-lg">
            <img src={imagemSelecionada} alt="Problema" className="w-full h-auto rounded" />
            <button
              className="mt-4 px-4 py-2 bg-[#0089a7] text-white rounded"
              onClick={() => setImagemSelecionada(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
