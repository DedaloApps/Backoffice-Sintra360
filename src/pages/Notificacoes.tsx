import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

export default function Notificacoes() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const enviarNotificacao = async () => {
    if (!titulo || !mensagem) return alert('Preenche todos os campos.');

    try {
      await addDoc(collection(db, 'notificacoes'), {
        titulo,
        mensagem,
        enviadoEm: Timestamp.now()
      });

      alert('Notificação enviada!');
      setTitulo('');
      setMensagem('');
    } catch (error) {
      console.error('❌ Erro ao enviar notificação:', error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-[#0089a7] mb-6">Enviar Notificação</h2>

      <div className="bg-white p-4 rounded shadow max-w-xl">
        <input
          type="text"
          placeholder="Título"
          className="border p-2 rounded w-full mb-4"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <textarea
          placeholder="Mensagem"
          className="border p-2 rounded w-full mb-4 h-28 resize-none"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />

        <button
          onClick={enviarNotificacao}
          className="bg-[#0089a7] text-white py-2 px-4 rounded hover:bg-[#00738c]"
        >
          Enviar Notificação
        </button>
      </div>
    </div>
  );
}
