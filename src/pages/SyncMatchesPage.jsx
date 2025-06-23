import React, { useState } from 'react';
import { fetchMatchesFromApi } from '../api/footballApi';
import { listMatches, addMatch } from '../api/matchesApi';
import { format } from 'date-fns';
import { Download, Loader2, CheckCircle, XCircle } from 'lucide-react';

// Função para "traduzir" os dados da API para o nosso formato
const transformApiData = (apiMatch) => {
  const isFinished = apiMatch.status === 'FINISHED';
  
  return {
    home_team: apiMatch.homeTeam.name,
    away_team: apiMatch.awayTeam.name,
    match_date: format(new Date(apiMatch.utcDate), 'yyyy-MM-dd'),
    match_time: format(new Date(apiMatch.utcDate), 'HH:mm'),
    championship: apiMatch.competition.name,
    tv_channel: 'A definir', // A API não fornece canal de TV
    status: isFinished ? 'finished' : 'scheduled', // Mapeia o status corretamente
    api_id: apiMatch.id, // ID da API para evitar duplicatas
    // Adiciona o placar se o jogo estiver finalizado
    home_score: isFinished ? apiMatch.score.fullTime.home : null,
    away_score: isFinished ? apiMatch.score.fullTime.away : null,
  };
};

export default function SyncMatchesPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSync = async () => {
    setLoading(true);
    setResult(null);

    try {
      // 1. Buscar partidas do nosso arquivo mock
      // Os parâmetros de data não são mais usados, mas mantemos a chamada da função
      const apiMatches = await fetchMatchesFromApi();

      // 2. Buscar partidas que já existem no nosso banco de dados
      const existingMatches = await listMatches();
      const existingApiIds = new Set(existingMatches.map(m => m.api_id).filter(Boolean));

      // 3. Filtrar para encontrar apenas as partidas novas
      const newMatches = apiMatches.filter(apiMatch => !existingApiIds.has(apiMatch.id));

      if (newMatches.length === 0) {
        setResult({ success: true, message: 'Nenhuma partida nova encontrada. Seu banco de dados já está atualizado!' });
        setLoading(false);
        return;
      }

      // 4. Salvar cada nova partida no Firestore
      for (const apiMatch of newMatches) {
        const newMatchData = transformApiData(apiMatch);
        await addMatch(newMatchData);
      }
      
      setResult({ success: true, message: `${newMatches.length} partidas novas foram adicionadas com sucesso!` });

    } catch (error) {
      console.error("Erro na sincronização:", error);
      setResult({ success: false, message: `Erro: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-slate-800">Sincronizar Partidas</h1>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
        <p className="text-slate-600 mb-6">
          Clique no botão abaixo para buscar as partidas do arquivo de dados local (mock) e adicioná-las automaticamente ao banco de dados. O sistema evitará adicionar jogos duplicados.
        </p>
        <div className="flex justify-center">
          <button
            onClick={handleSync}
            disabled={loading}
            className="flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-wait"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-6 h-6" />
                Sincronizando...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Buscar e Salvar Partidas
              </>
            )}
          </button>
        </div>
        
        {result && (
          <div className={`mt-8 p-4 rounded-md flex items-center gap-3 text-white ${result.success ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {result.success ? <CheckCircle /> : <XCircle />}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    </div>
  );
}