// src/pages/MatchDetailPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Seu arquivo de config do Firebase
import { useAuth } from '../contexts/AuthContext'; // Seu contexto de autenticação

// ... outros imports e componentes

// Função para buscar os detalhes da partida (você já deve ter algo parecido)
const fetchMatchDetails = async (matchId) => {
  const matchRef = doc(db, 'matches', matchId);
  const matchSnap = await getDoc(matchRef);
  if (!matchSnap.exists()) {
    throw new Error('Partida não encontrada');
  }
  return { id: matchSnap.id, ...matchSnap.data() };
};

// Função para marcar a partida como assistida
const markAsWatched = async ({ userId, matchId }) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    watchedMatches: arrayUnion(matchId) // arrayUnion previne duplicatas
  });
};

export function MatchDetailPage() {
  const { id } = useParams();
  const { user } = useAuth(); // Pega o usuário logado
  const queryClient = useQueryClient();

  // Query para buscar os dados da partida
  const { data: match, isLoading, isError } = useQuery({
    queryKey: ['match', id],
    queryFn: () => fetchMatchDetails(id),
  });

  // Query para buscar dados do usuário (para saber o que ele já assistiu)
  // Assumimos que a chave 'userProfile' é usada para guardar os dados do usuário do Firestore
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile', user?.uid],
    queryFn: async () => {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      return userSnap.data();
    },
    enabled: !!user, // Só executa se o usuário estiver logado
  });
  
  // Mutation para atualizar o status de "assistido"
  const markAsWatchedMutation = useMutation({
    mutationFn: markAsWatched,
    onSuccess: () => {
      // Invalida a query do perfil do usuário para que ela seja recarregada
      // com os novos dados, atualizando a UI automaticamente.
      queryClient.invalidateQueries({ queryKey: ['userProfile', user.uid] });
      // Poderia exibir um toast de sucesso aqui
    },
    onError: (error) => {
      console.error("Erro ao marcar como assistido:", error);
      // Exibir toast de erro
    }
  });

  if (isLoading) return <div>Carregando partida...</div>;
  if (isError) return <div>Erro ao carregar a partida.</div>;

  const isFinished = match.status === 'finished';
  const isWatched = userProfile?.watchedMatches?.includes(match.id);

  const handleMarkAsWatched = () => {
    if (!user) return; // Ou redirecionar para login
    markAsWatchedMutation.mutate({ userId: user.uid, matchId: match.id });
  };

  return (
    <div className="container mx-auto p-4">
      {/* ... Detalhes da partida, placar, etc. ... */}
      <h1>{match.homeTeam.name} vs {match.awayTeam.name}</h1>

      {/* NOVO: Botão "Marcar como Assistido" */}
      {isFinished && !isWatched && user && (
        <button
          onClick={handleMarkAsWatched}
          disabled={markAsWatchedMutation.isLoading}
          className="my-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-white font-bold disabled:bg-green-800"
        >
          {markAsWatchedMutation.isLoading ? 'Salvando...' : 'Marcar como Assistido'}
        </button>
      )}
      {isWatched && (
        <p className="my-4 text-green-400 font-semibold">✔ Você já marcou esta partida como assistida.</p>
      )}

      {/* Seção de Comentários */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comentários</h2>
        {/* Lógica para exibir os comentários existentes */}

        {/* Formulário de novo comentário */}
        {isWatched ? (
          <div>
            {/* Seu formulário de comentário aqui. Agora ele só aparece se o jogo foi assistido. */}
            <textarea placeholder="Deixe sua avaliação sobre o jogo..." className="w-full p-2 rounded bg-gray-700 text-white"></textarea>
            <button className="mt-2 px-4 py-2 bg-blue-600 rounded">Enviar Comentário</button>
          </div>
        ) : (
          isFinished && user && <p className="text-gray-400">Marque a partida como "assistida" para poder comentar.</p>
        )}
      </div>
    </div>
  );
}