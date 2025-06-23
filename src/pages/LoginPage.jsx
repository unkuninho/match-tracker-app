// --- INÍCIO DO ARQUIVO LoginPage.jsx (ATUALIZADO) ---

import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase.js';
// Importações atualizadas
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Define a persistência para a sessão do navegador
  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .catch((error) => {
        console.error("Erro ao definir a persistência da sessão:", error);
      });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (err) {
      setError('Falha ao fazer login. Verifique seu e-mail e senha.');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        fullName: email.split('@')[0]
      });

      navigate('/');
    } catch (err) {
      setError('Falha ao criar a conta. O e-mail já pode estar em uso.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="flex flex-col items-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Trophy className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-center text-slate-900">Match Tracker</h2>
        </div>
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-bold text-gray-600 block">E-mail</label>
            <input
              id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-bold text-gray-600 block">Senha</label>
            <input
              id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleLogin} disabled={loading} className="w-full py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold transition disabled:opacity-50">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <button onClick={handleSignUp} disabled={loading} className="w-full py-3 px-4 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-semibold transition disabled:opacity-50">
              {loading ? 'Criando...' : 'Criar Conta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- FIM DO ARQUIVO LoginPage.jsx ---