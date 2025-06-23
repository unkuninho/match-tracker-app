// src/api/mockApi.js

// ATENÇÃO: Este arquivo foi intencionalmente esvaziado.
// A fonte de dados oficial agora é o Firebase, através do matchesApi.js.
// Manter as funções exportadas (mas retornando dados vazios) previne erros
// em componentes que ainda possam importá-lo por engano.

export const Match = {
  list: async () => Promise.resolve([]), // Retorna uma lista de partidas VAZIA
  create: async (formData) => Promise.resolve({ ...formData, id: 'mock_id' }),
};

// As funções de User e UserFavorite foram removidas pois a lógica agora está no Firebase.