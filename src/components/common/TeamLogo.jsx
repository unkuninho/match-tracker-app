import React from 'react';
import { getTeamLogo } from '../../data/teamLogos';

export default function TeamLogo({ teamName, className }) {
  const originalUrl = getTeamLogo(teamName);

  if (!originalUrl || originalUrl.includes('ui-avatars.com')) {
    return <img src={originalUrl} alt={teamName} className={className} />;
  }

  // Constrói a URL para o nosso proxy interno
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(originalUrl)}`;

  return (
    <img
      src={proxyUrl}
      alt={teamName}
      className={className}
      crossOrigin="anonymous"
    />
  );
}