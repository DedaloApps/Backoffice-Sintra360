import { useEffect, useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { db } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';

type Evento = {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
};

export default function Agenda() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [data, setData] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idEdicao, setIdEdicao] = useState<string | null>(null);

  const fetchEventos = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'agenda'));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Evento[];
      setEventos(lista);
    } catch (error) {
      console.error('❌ Erro ao buscar eventos:', error);
    }
  };

  useEffect(() => {
    fetchEventos();
  }, []);

  const submeterEvento = async () => {
    if (!data || !titulo || !descricao)
      return alert('Preenche todos os campos.');

    try {
      if (modoEdicao && idEdicao) {
        const ref = doc(db, 'agenda', idEdicao);
        await updateDoc(ref, { data, titulo, descricao });
      } else {
        await addDoc(collection(db, 'agenda'), {
          data,
          titulo,
          descricao,
          criadoEm: Timestamp.now(),
        });
      }

      setData('');
      setTitulo('');
      setDescricao('');
      setModoEdicao(false);
      setIdEdicao(null);
      fetchEventos();
    } catch (error) {
      console.error('❌ Erro ao guardar evento:', error);
    }
  };

  const editar = (evento: Evento) => {
    setData(evento.data);
    setTitulo(evento.titulo);
    setDescricao(evento.descricao);
    setModoEdicao(true);
    setIdEdicao(evento.id);
  };

  const apagar = async (id: string) => {
    const confirmar = confirm('Tens a certeza que queres eliminar este evento?');
    if (!confirmar) return;

    try {
      await deleteDoc(doc(db, 'agenda', id));
      fetchEventos();
    } catch (error) {
      console.error('❌ Erro ao apagar evento:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#0089a7] mb-6">Agenda de Atividades</h2>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-4">
          {modoEdicao ? 'Editar evento' : 'Adicionar novo evento'}
        </h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="date"
            className="border p-2 rounded w-full md:w-1/4"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <input
            type="text"
            placeholder="Título"
            className="border p-2 rounded w-full md:flex-1"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            type="text"
            placeholder="Descrição"
            className="border p-2 rounded w-full md:flex-1"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <button
          onClick={submeterEvento}
          className="bg-[#0089a7] text-white py-2 px-4 rounded hover:bg-[#00738c]"
        >
          {modoEdicao ? 'Guardar Alterações' : 'Adicionar Evento'}
        </button>
      </div>

      <div className="overflow-auto rounded shadow bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#0089a7] text-white">
            <tr>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Título</th>
              <th className="px-4 py-2">Descrição</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{evento.data}</td>
                <td className="px-4 py-2">{evento.titulo}</td>
                <td className="px-4 py-2">{evento.descricao}</td>
                <td className="px-4 py-2 text-right space-x-2">
  <button
    onClick={() => editar(evento)}
    className="text-[#0089a7] hover:text-[#005f73]"
    title="Editar"
  >
    <FaEdit />
  </button>
  <button
    onClick={() => apagar(evento.id)}
    className="text-red-600 hover:text-red-800"
    title="Eliminar"
  >
    <FaTrash />
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
