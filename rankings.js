// Only completed results count. Rank depends on wins alone; no points formula.
window.ChampionshipRankings = (() => {
  function resultOf(match) {
    if (match.status !== 'completed' || !match.a || !match.b || match.a === match.b) return null;
    if (match.result === 'draw') return 'draw';
    if (match.winner === match.a || match.winner === match.b) return match.winner;
    // Cricket scores require an explicit winner, not a run comparison.
    if (match.sport === 'Cricket' || match.scoreA == null || match.scoreB == null || String(match.scoreA).trim() === '' || String(match.scoreB).trim() === '') return null;
    const a = Number(match.scoreA), b = Number(match.scoreB);
    if (!Number.isFinite(a) || !Number.isFinite(b) || a < 0 || b < 0) return null;
    return a === b ? 'draw' : a > b ? match.a : match.b;
  }
  function calculate(departments, matches) {
    const rows = new Map(departments.map(dept => [dept.id, {...dept, played:0, wins:0, draws:0, losses:0, events:new Set(), rank:null}]));
    let completed = 0;
    for (const match of matches) {
      const result = resultOf(match), a = rows.get(match.a), b = rows.get(match.b);
      if (!result || !a || !b) continue;
      completed++;
      for (const row of [a,b]) { row.played++; row.events.add(`${match.category}:${match.sport}`); }
      if (result === 'draw') { a.draws++; b.draws++; }
      else { rows.get(result).wins++; (result === match.a ? b : a).losses++; }
    }
    const sorted = [...rows.values()].sort((a,b) => b.wins-a.wins || Number(b.played>0)-Number(a.played>0) || a.id.localeCompare(b.id));
    let position = 0, previousWins, previousRank;
    for (const row of sorted) {
      if (!row.played) continue;
      position++;
      row.rank = row.wins === previousWins ? previousRank : position;
      previousWins = row.wins; previousRank = row.rank;
    }
    return {rows:sorted, completed};
  }
  return {calculate, resultOf};
})();
