import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isUsernameUnique, updateUserProfile } from '../api/userApi';
import { User, Image, AtSign, Save, Loader2, Heart } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importando hooks

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient(); // Para invalidar o cache se necessário
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    photoURL: '',
    favoriteTeam: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        username: user.username || '',
        photoURL: user.photoURL || '',
        favoriteTeam: user.favoriteTeam || '',
      });
    }
  }, [user]);

  // Usando useMutation para a lógica de atualização
  const updateProfileMutation = useMutation({
    mutationFn: async (dataToUpdate) => {
      if (dataToUpdate.username && dataToUpdate.username !== user.username) {
        const unique = await isUsernameUnique(dataToUpdate.username, user.uid);
        if (!unique) {
          throw new Error('Este nome de usuário já está em uso.');
        }
      }
      await updateUserProfile(user.uid, dataToUpdate);
    },
    onSuccess: () => {
      setSuccess('Perfil atualizado com sucesso!');
      setError('');
      // Poderíamos invalidar a query do usuário aqui se a tivéssemos em cache
      // queryClient.invalidateQueries(['user', user.uid]);
    },
    onError: (err) => {
      setError(err.message || 'Ocorreu um erro ao atualizar o perfil.');
      setSuccess('');
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const dataToUpdate = {
      fullName: formData.fullName,
      username: formData.username,
      photoURL: formData.photoURL,
      favoriteTeam: formData.favoriteTeam,
    };
    updateProfileMutation.mutate(dataToUpdate);
  };
  
  // (O código JSX que foi removido aqui não era usado, então a versão abaixo é mais limpa)
  // if (authLoading) { ... }
  if (authLoading || !user) {
    return <div className="flex justify-center items-center p-8"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div>
      {/* Título responsivo */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-slate-800">Meu Perfil</h1>
      <div className="max-w-xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={formData.photoURL || `https://ui-avatars.com/api/?name=${user.fullName || user.email}&size=128&background=random`} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-200"
            />
          </div>
          <hr />
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md" placeholder="Seu nome" />
              </div>
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">Nome de Usuário</label>
              <div className="relative">
                <AtSign className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md" placeholder="seu.usuario" />
              </div>
            </div>
            <div>
              <label htmlFor="favoriteTeam" className="block text-sm font-medium text-slate-700 mb-1">Time do Coração</label>
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" name="favoriteTeam" id="favoriteTeam" value={formData.favoriteTeam} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md" placeholder="Seu time favorito" />
              </div>
            </div>
            <div>
              <label htmlFor="photoURL" className="block text-sm font-medium text-slate-700 mb-1">URL da Foto</label>
              <div className="relative">
                <Image className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" name="photoURL" id="photoURL" value={formData.photoURL} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md" placeholder="https://..." />
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-emerald-500 text-sm">{success}</p>}

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={updateProfileMutation.isPending} className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-slate-400">
              {updateProfileMutation.isPending ? <Loader2 className="animate-spin w-5 h-5" /> : <Save className="w-5 h-5" />}
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}