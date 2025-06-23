import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "./firebase.js";
import { signOut } from 'firebase/auth';
import { useAuth } from "./hooks/useAuth.js";
import { Trophy, Calendar, Heart, Plus, User, List, Code, LogOut, Download, BookOpen, Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para controlar o menu no mobile
  const isAdmin = user?.role === 'admin';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Verificando autenticação...</div>;
  }

  const navigationItems = [
    { title: "Dashboard", url: "/", icon: Calendar },
    { title: "Todas as Partidas", url: "/all-matches", icon: List },
    { title: "Minhas Partidas", url: "/favorites", icon: Heart },
    { title: "Meu Perfil", url: "/profile", icon: User },
    { title: "Como Usar (Tutorial)", url: "/tutorial", icon: BookOpen }
  ];

  const adminItems = [
    { title: "Adicionar Partida", url: "/add-match", icon: Plus },
    { title: "Sincronizar Partidas", url: "/sync-matches", icon: Download },
    { title: "Código Fonte", url: "/source-code", icon: Code }
  ];

  // Componente Sidebar refatorado para ser reutilizável e controlável
  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 p-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
          <Trophy className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900">MatchTracker</h1>
          <p className="text-xs text-slate-600">Suas partidas</p>
        </div>
      </div>

      <nav className="flex-grow flex flex-col gap-6">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Navegação</h2>
          <ul className="space-y-1">
            {navigationItems.map(item => (
              <li key={item.title}>
                <Link to={item.url} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${location.pathname === item.url ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-slate-100'}`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {isAdmin && (
          <div>
            <h2 className="text-xs font-semibold text-slate-500 uppercase px-2 mb-2">Administração</h2>
            <ul className="space-y-1">
              {adminItems.map(item => (
                <li key={item.title}>
                  <Link to={item.url} onClick={() => setIsSidebarOpen(false)} className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors ${location.pathname === item.url ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:bg-slate-100'}`}>
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      {user && (
        <div className="mt-auto">
          <Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="block p-2 rounded-lg transition-colors hover:bg-slate-50">
            <div className="flex items-center gap-3">
              <img src={`https://ui-avatars.com/api/?name=${user.fullName || user.email}&background=random`} alt="User avatar" className="w-10 h-10 rounded-full object-cover bg-slate-200" />
              <div>
                <p className="font-semibold text-sm truncate" title={user.fullName || user.email}>{user.fullName || user.email}</p>
                <p className="text-xs text-slate-600">{isAdmin ? 'Administrador' : 'Usuário'}</p>
              </div>
            </div>
          </Link>
          <button onClick={handleLogout} className="w-full text-left mt-2 p-3 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-lg flex items-center gap-3 transition-colors">
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="relative min-h-screen md:flex bg-slate-100 font-sans">
      {/* Overlay para fechar o menu no mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white border-r w-64 p-4 flex flex-col gap-4 transform transition-transform duration-300 ease-in-out z-30 
                   ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:relative md:translate-x-0`}
      >
        <SidebarContent />
      </aside>

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Header no Mobile com botão de menu */}
        <header className="md:hidden sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm p-4 z-10 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <h1 className="font-bold text-lg text-slate-900">MatchTracker</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
            {isSidebarOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </header>
        
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}