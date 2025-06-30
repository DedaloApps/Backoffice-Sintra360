export default function Header() {
    return (
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center w-full fixed top-0 left-64 z-40">
        <h1 className="text-2xl font-semibold text-gray-800">Painel de Controlo</h1>
        <div>
          {/* Aqui podes meter um botão de logout, perfil ou toggle de dark mode futuramente */}
        </div>
      </header>
    );
  }
  