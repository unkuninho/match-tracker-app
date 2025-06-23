// src/api/footballApi.js

// Importa os dados do nosso arquivo JSON local
import mockData from '../data/mockApiResponse.json';

/**
 * SIMULA a busca de partidas lendo de um arquivo local.
 * Isso bypassa completamente os problemas de CORS/proxy para desenvolvimento.
 * @returns {Promise<Array>} Uma lista de partidas do arquivo local.
 */
export const fetchMatchesFromApi = async (dateFrom, dateTo) => {
  console.log("Modo de simulação: Lendo partidas do arquivo local mockApiResponse.json");
  
  // A função agora é muito simples: ela apenas retorna os dados do arquivo importado.
  // Usamos uma pequena espera (timeout) para simular o tempo de uma chamada de rede.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockData.matches || []);
    }, 500); // Espera 0.5 segundos
  });
};