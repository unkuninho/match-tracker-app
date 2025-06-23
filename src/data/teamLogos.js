// src/data/teamLogos.js

// Este objeto mapeia o nome do time (a chave) para a URL do seu escudo.
// Foram adicionadas múltiplas chaves para o mesmo time para cobrir nomes curtos e longos.
const teamLogos = {
  // Times Brasileiros
  "Atlético-MG": "https://s.sde.globo.com/media/organizations/2018/03/10/atletico-mg.svg",
  "Bahia": "https://s.sde.globo.com/media/organizations/2018/03/11/bahia.svg",
  "Botafogo": "https://s.sde.globo.com/media/organizations/2019/02/04/botafogo-svg.svg",
  "Bragantino": "https://s.sde.globo.com/media/organizations/2021/06/28/bragantino.svg",
  "Corinthians": "https://s.sde.globo.com/media/organizations/2024/10/09/Corinthians_2024_Q4ahot4.svg",
  "Cruzeiro": "https://s.sde.globo.com/media/organizations/2021/02/13/cruzeiro_2021.svg",
  "Flamengo": "https://s.sde.globo.com/media/organizations/2018/04/10/Flamengo-2018.svg",
  "Fluminense": "https://s.sde.globo.com/media/organizations/2018/03/11/fluminense.svg",
  "Fortaleza": "https://s.sde.globo.com/media/organizations/2021/09/19/Fortaleza_2021_1.svg",
  "Grêmio": "https://s.sde.globo.com/media/organizations/2018/03/12/gremio.svg",
  "Internacional": "https://s.sde.globo.com/media/organizations/2018/03/11/internacional.svg",
  "Juventude": "https://s.sde.globo.com/media/organizations/2021/04/29/Juventude-2021-01.svg",
  "Mirassol": "https://s.sde.globo.com/media/organizations/2024/08/20/mirassol-novo-svg-71690.svg",
  "Palmeiras": "https://s.sde.globo.com/media/organizations/2019/07/06/Palmeiras.svg",
  "Santos": "https://s.sde.globo.com/media/organizations/2018/03/12/santos.svg",
  "São Paulo": "https://s.sde.globo.com/media/organizations/2018/03/11/sao-paulo.svg",
   "Sport": "https://s.sde.globo.com/media/organizations/2018/03/11/sport.svg",
  "Vasco": "https://s.sde.globo.com/media/organizations/2021/09/04/vasco_SVG.svg",
  "Vitória": "https://s.sde.globo.com/media/organizations/2024/04/09/escudo-vitoria-svg-69281.svg",
  
  // Times do Mundial de Clubes 2025
  "PSG": "https://s.sde.globo.com/media/teams/2018/03/12/paris-saint-germain.svg",
  "Paris Saint-Germain": "https://s.sde.globo.com/media/teams/2018/03/12/paris-saint-germain.svg",
  "Atlético Madrid": "https://s.sde.globo.com/media/organizations/2025/03/12/Atl%C3%A9tico_de_Madrid.svg",
  "Atlético de Madrid": "https://s.sde.globo.com/media/organizations/2025/03/12/Atl%C3%A9tico_de_Madrid.svg",
  "Porto": "https://s.sde.globo.com/media/teams/2018/03/12/porto.svg",
  "Al Ahly": "https://s.sde.globo.com/media/organizations/2023/12/13/al-ahly-svg-65689.svg",
  "Inter Miami": "https://s.sde.globo.com/media/organizations/2023/07/25/inter-miami-svg-62393.svg",
  "Seattle Sounders": "https://s.sde.globo.com/media/teams/2024/12/05/seatle-sounders-73844.svg",
  "Bayern": "https://s.sde.globo.com/media/organizations/2018/03/11/bayern-de-munique.svg",
  "Bayern de Munique": "https://s.sde.globo.com/media/organizations/2018/03/11/bayern-de-munique.svg",
  "Benfica": "https://s.sde.globo.com/media/teams/2018/03/11/benfica.svg",
  "Boca Juniors": "https://s.sde.globo.com/media/organizations/2019/02/19/boca-juniors-svg-13083.svg",
  "Auckland City": "https://s.sde.globo.com/media/organizations/2025/06/09/Full_Flat.svg",
  "Chelsea": "https://s.sde.globo.com/media/teams/2018/03/11/chelsea.svg",
  "Espérance": "https://s.sde.globo.com/media/organizations/2025/05/20/Esp%C3%A9rance.svg",
  "LAFC": "https://s.sde.globo.com/media/organizations/2023/08/15/los-angeles-fc-svg-63033.svg",
  "Los Angeles FC": "https://s.sde.globo.com/media/organizations/2023/08/15/los-angeles-fc-svg-63033.svg",
  "Borussia": "https://s.sde.globo.com/media/teams/2018/03/11/borussia-dortmund.svg",
  "Borussia Dortmund": "https://s.sde.globo.com/media/teams/2018/03/11/borussia-dortmund.svg",
  "Ulsan Hyundai": "https://s.sde.globo.com/media/organizations/2024/12/05/svg.svg",
  "Ulsan": "https://s.sde.globo.com/media/organizations/2024/12/05/svg.svg",
  "Sundowns": "https://s.sde.globo.com/media/organizations/2025/05/20/Mamelodi_Sundowns.svg",
  "Mamelodi Sundowns": "https://s.sde.globo.com/media/organizations/2025/05/20/Mamelodi_Sundowns.svg",
  "Urawa Reds": "https://s.sde.globo.com/media/organizations/2023/12/19/urawa-svg-65917.svg",
  "Monterrey": "https://s.sde.globo.com/media/organizations/2025/05/20/Monterrey.svg",
  "Inter": "https://s.sde.globo.com/media/organizations/2021/03/31/Inter_de_Mil%C3%A3o_2021.svg",
  "Internazionale": "https://s.sde.globo.com/media/organizations/2021/03/31/Inter_de_Mil%C3%A3o_2021.svg",
  "River Plate": "https://s.sde.globo.com/media/organizations/2024/10/14/River_Escudo_novo.svg",
  "Juventus": "https://s.sde.globo.com/media/organizations/2025/06/09/Juventus.svg",
  "City": "https://s.sde.globo.com/media/organizations/2018/03/11/manchester-city.svg",
  "Manchester City": "https://s.sde.globo.com/media/organizations/2018/03/11/manchester-city.svg",
  "Wydad AC": "https://s.sde.globo.com/media/organizations/2025/05/20/Wydad.svg",
  "Wydad Casablanca": "https://s.sde.globo.com/media/organizations/2025/05/20/Wydad.svg",
  "Al Ain": "https://s.sde.globo.com/media/organizations/2024/10/20/Al_Ain_FC_S6ZOvGV.svg",
  "Al-Hilal": "https://s.sde.globo.com/media/organizations/2023/02/07/al_hilal_defesa.svg",
  "Pachuca": "https://s.sde.globo.com/media/organizations/2024/12/11/pachuca-logo.svg",
  "RB Salzburg": "https://s.sde.globo.com/media/organizations/2023/09/20/RB_Salzburg_copy.svg",
  "Real Madrid": "https://s.sde.globo.com/media/teams/2018/03/12/real-madrid.svg",
};

const competitionLogos = {
  "Mundial de Clubes 2025": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/2025_FIFA_Club_World_Cup.svg/800px-2025_FIFA_Club_World_Cup.svg.png",
  "Brasileirão Série A": "https://www.thesportsdb.com/images/media/league/badge/ny47lx1701964009.png",
  // Adicione outros campeonatos aqui
};

export function getTeamLogo(teamName) {
  if (teamLogos[teamName]) {
    return teamLogos[teamName];
  }
  const initials = teamName ? teamName.substring(0, 3).toUpperCase() : 'N/A';
  return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128&bold=true`;
}

/**
 * Retorna a URL do logo de uma competição.
 * @param {string} competitionName - O nome da competição.
 * @returns {string|null} - A URL do logo ou null se não for encontrado.
 */
export function getCompetitionLogo(competitionName) {
  return competitionLogos[competitionName] || null;
}