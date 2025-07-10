import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://rvyrwajzpxgcmiwctsfy.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2eXJ3YWp6cHhnY21pd2N0c2Z5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3MTU4MDYsImV4cCI6MjA2NjI5MTgwNn0.98cF56D4Y3fPr5YG8tUHLpWuFwJWMOKRBJkSdN76a50"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções de autenticação Supabase
export const auth = {
  signUp: async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: userData.nome,
          telefone: userData.telefone || "",
          morada: userData.morada || "",
        },
      },
    })
    return { data, error }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  getCurrentUser: async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    return { user, error }
  },

  onAuthStateChange: (callback: any) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Funções para buscar dados
export const data = {
  getProfiles: async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })
    return { data, error }
  },

  getUsers: async () => {
    // Alternativa: buscar da tabela auth.users se tiveres acesso de admin
    const { data, error } = await supabase.auth.admin.listUsers()
    return { data, error }
  },
}
