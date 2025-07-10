"use client"

import { useEffect, useState } from "react"
import { db } from "../firebase"
import { supabase } from "../supabase"
import { collection, getDocs } from "firebase/firestore"
import { FaSortUp, FaSortDown, FaDownload, FaDatabase } from "react-icons/fa"
import * as XLSX from "xlsx"

type ParticipanteFirebase = {
  id: string
  nome: string
  email: string
  telemovel: string
  freguesia: string
  criadoEm: any
  origem: "Firebase"
}

type Participante = {
  id: string
  nome: string
  email: string
  telefone: string
  localizacao: string
  criadoEm: Date | null
  origem: "Firebase" | "Supabase"
}

export default function Participantes() {
  const [participantes, setParticipantes] = useState<Participante[]>([])
  const [ordemAscendente, setOrdemAscendente] = useState(false)
  const [filtroOrigem, setFiltroOrigem] = useState<"todos" | "Firebase" | "Supabase">("todos")
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    firebase: 0,
    supabase: 0,
    total: 0,
  })

  useEffect(() => {
    const fetchParticipantes = async () => {
      setLoading(true)
      try {
        // Buscar do Firebase
        const firebaseSnapshot = await getDocs(collection(db, "participantes"))
        const participantesFirebase = firebaseSnapshot.docs.map((doc) => {
          const data = doc.data() as ParticipanteFirebase
          return {
            id: doc.id,
            nome: data.nome || "",
            email: data.email || "",
            telefone: data.telemovel || "",
            localizacao: data.freguesia || "",
            criadoEm: data.criadoEm?.toDate?.() || null,
            origem: "Firebase" as const,
          }
        })

        // Buscar do Supabase (profiles)
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })

        let participantesSupabase: Participante[] = []

        if (!profilesError && profilesData) {
          participantesSupabase = profilesData.map((profile: any) => ({
            id: profile.id,
            nome: profile.nome || profile.full_name || "",
            email: profile.email || "",
            telefone: profile.telefone || profile.phone || "",
            localizacao: profile.morada || profile.address || "",
            criadoEm: profile.created_at ? new Date(profile.created_at) : null,
            origem: "Supabase" as const,
          }))
        }

        // Se não conseguir buscar profiles, tentar buscar users do auth
        if (participantesSupabase.length === 0) {
          try {
            const {
              data: { users },
              error: usersError,
            } = await supabase.auth.admin.listUsers()

            if (!usersError && users) {
              participantesSupabase = users.map((user: any) => ({
                id: user.id,
                nome: user.user_metadata?.nome || user.user_metadata?.full_name || "",
                email: user.email || "",
                telefone: user.user_metadata?.telefone || user.user_metadata?.phone || "",
                localizacao: user.user_metadata?.morada || user.user_metadata?.address || "",
                criadoEm: user.created_at ? new Date(user.created_at) : null,
                origem: "Supabase" as const,
              }))
            }
          } catch (authError) {
            console.log("Não foi possível acessar auth.admin - usando apenas profiles")
          }
        }

        // Combinar dados
        const todosParticipantes = [...participantesFirebase, ...participantesSupabase]
        setParticipantes(todosParticipantes)

        // Calcular estatísticas
        setStats({
          firebase: participantesFirebase.length,
          supabase: participantesSupabase.length,
          total: todosParticipantes.length,
        })
      } catch (error) {
        console.error("❌ Erro ao buscar participantes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchParticipantes()
  }, [])

  const participantesFiltrados = participantes.filter((p) => {
    if (filtroOrigem === "todos") return true
    return p.origem === filtroOrigem
  })

  const participantesOrdenados = [...participantesFiltrados].sort((a, b) => {
    const dataA = a.criadoEm?.getTime() ?? 0
    const dataB = b.criadoEm?.getTime() ?? 0
    return ordemAscendente ? dataA - dataB : dataB - dataA
  })

  const exportarParaExcel = () => {
    const dados = participantesOrdenados.map((p) => ({
      Nome: p.nome,
      Email: p.email,
      "Telemóvel/Telefone": p.telefone,
      "Freguesia/Localização": p.localizacao,
      Data: p.criadoEm?.toLocaleString() ?? "-",
      Origem: p.origem,
    }))

    const worksheet = XLSX.utils.json_to_sheet(dados)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes")
    XLSX.writeFile(workbook, `participantes_${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0089a7] mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando participantes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#0089a7]">Participantes</h2>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <FaDatabase className="text-orange-500" />
              Firebase: {stats.firebase}
            </span>
            <span className="flex items-center gap-1">
              <FaDatabase className="text-green-500" />
              Supabase: {stats.supabase}
            </span>
            <span className="font-semibold">Total: {stats.total}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={filtroOrigem}
            onChange={(e) => setFiltroOrigem(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0089a7]"
          >
            <option value="todos">Todos</option>
            <option value="Firebase">Firebase</option>
            <option value="Supabase">Supabase</option>
          </select>

          <button
            onClick={() => setOrdemAscendente(!ordemAscendente)}
            className="flex items-center gap-1 text-[#0089a7] text-sm font-semibold hover:underline"
          >
            {ordemAscendente ? <FaSortUp /> : <FaSortDown />}
            Ordenar por data
          </button>

          <button
            onClick={exportarParaExcel}
            className="flex items-center gap-2 px-3 py-2 bg-[#0089a7] text-white text-sm rounded hover:bg-[#00768f] transition-colors"
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
              <th className="px-4 py-2">Telefone</th>
              <th className="px-4 py-2">Localização</th>
              <th className="px-4 py-2">Data</th>
              <th className="px-4 py-2">Origem</th>
            </tr>
          </thead>
          <tbody>
            {participantesOrdenados.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  Nenhum participante encontrado
                </td>
              </tr>
            ) : (
              participantesOrdenados.map((p) => (
                <tr key={`${p.origem}-${p.id}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{p.nome || "-"}</td>
                  <td className="px-4 py-2">{p.email || "-"}</td>
                  <td className="px-4 py-2">{p.telefone || "-"}</td>
                  <td className="px-4 py-2">{p.localizacao || "-"}</td>
                  <td className="px-4 py-2">{p.criadoEm?.toLocaleString() ?? "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        p.origem === "Firebase" ? "bg-orange-100 text-orange-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      <FaDatabase size={10} />
                      {p.origem}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {participantesOrdenados.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Mostrando {participantesOrdenados.length} de {stats.total} participantes
        </div>
      )}
    </div>
  )
}
