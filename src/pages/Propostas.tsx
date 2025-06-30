import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

type Proposta = {
  id: string;
  nome: string;
  proposta: string;
  criadoEm: any;
};

export default function Propostas() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);

  useEffect(() => {
    const fetchPropostas = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'propostas'));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Proposta[];

        setPropostas(lista);
      } catch (error) {
        console.error('❌ Erro ao buscar propostas:', error);
      }
    };

    fetchPropostas();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#0089a7] mb-6">Propostas de Melhoria</h2>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0089a7] text-white">
            <tr>
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2">Proposta</th>
              <th className="px-4 py-2">Data</th>
            </tr>
          </thead>
          <tbody>
            {propostas.map((p) => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.nome}</td>
                <td className="px-4 py-2">{p.proposta}</td>
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
