export function createPageUrl(pageName) {
  const pageMap = {
    Dashboard: "/",
    AllMatches: "/all-matches",
    Favorites: "/favorites",
    AddMatch: "/add-match",
    SourceCode: "/source-code",
  };
  return pageMap[pageName] || "/";
}