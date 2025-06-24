// src/hooks/useWatched.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getWatchedHistory, markAsWatched, unmarkAsWatched } from '../api/watchedApi';

export function useWatched() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Busca e mantém em cache a lista de IDs de partidas assistidas
  const { data: watchedIds = [], isLoading } = useQuery({
    queryKey: ['watchedHistory', user?.uid],
    queryFn: () => getWatchedHistory(user.uid),
    enabled: !!user,
  });

  const watchedIdSet = new Set(watchedIds);

  // Mutação para marcar/desmarcar
  const mutation = useMutation({
    mutationFn: async ({ matchId, shouldWatch }) => {
      if (!user) throw new Error("Usuário não autenticado.");
      if (shouldWatch) {
        await markAsWatched(user.uid, matchId);
      } else {
        await unmarkAsWatched(user.uid, matchId);
      }
    },
    onSuccess: () => {
      // Invalida o cache para que a lista seja re-buscada com os novos dados
      queryClient.invalidateQueries({ queryKey: ['watchedHistory', user?.uid] });
    },
  });

  const toggleWatched = (matchId) => {
    if (!user) return;
    const isWatched = watchedIdSet.has(matchId);
    mutation.mutate({ matchId, shouldWatch: !isWatched });
  };

  const markMatchAsWatched = (matchId) => {
    if (!user) return;
    // Evita mutações desnecessárias se já estiver marcado
    if (!watchedIdSet.has(matchId)) {
        mutation.mutate({ matchId, shouldWatch: true });
    }
  };

  return {
    watchedIdSet,
    toggleWatched,
    isLoading,
    markAsWatched: markMatchAsWatched, // Expõe a função para uso externo
  };
}