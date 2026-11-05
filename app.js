const data = window.CHAMPIONSHIP;
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const departments = Object.fromEntries(data.departments.map(d => [d.id, d]));
const events=data.eventGroups.flatMap(group=>group.sports.map(sport=>({id:`${group.category.toLowerCase()}-${sport.toLowerCase().replace(/\s+/g,'-')}`,sport,category:group.category})));
const categoryName=value=>({Men:'Boys',Women:'Girls',Boys:'Boys',Girls:'Girls'}[value]||value);
const eventMatches=(match,event)=>match.sport===event.sport&&match.category===event.category;
// Keep legacy example records intact, but show only registered event/category pairs.
const matchesForRoster=data.matches.map(match=>({...match,sport:data.sports.find(s=>s.name.toLowerCase()===match.sport.toLowerCase())?.name||match.sport,category:categoryName(match.category)})).filter(match=>events.some(event=>eventMatches(match,event)));
const filters = { event:'all', date:'all', department:'all', status:'all' };
const team = id => `<span class="team">${esc(id)}</span>`;
const statusText = {live:'LIVE', upcoming:'UPCOMING', completed:'COMPLETED'};
const status = m => `<span class="status ${m.status}">${statusText[m.status]}</span>`;
const time = value => new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}).toUpperCase();
const date = value => new Date(`${value}T12:00:00+05:30`).toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
const fullDate = value => new Date(`${value}T12:00:00+05:30`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const score = m => m.status==='upcoming' ? '<span class="score"><small>VS</small></span>' : `<span class="score">${esc(m.scoreA)}<small>–</small>${esc(m.scoreB)}</span>`;

$('#event-filter').innerHTML='<option value="all">All events</option>'+data.eventGroups.map(group=>`<optgroup label="${esc(group.category)}’ events">${events.filter(event=>event.category===group.category).map(event=>`<option value="${esc(event.id)}">${esc(event.sport)} · ${esc(event.category)}</option>`).join('')}</optgroup>`).join('');
[...new Set(matchesForRoster.map(m=>m.date))].sort().forEach(value=>$('#date-filter').add(new Option(fullDate(value),value)));
data.departments.forEach(d => $('#dept-filter').add(new Option(`${d.id} · ${d.name}`,d.id)));

function renderFixtures(){
  const priority={live:0,upcoming:1,completed:2};
  const selectedEvent=events.find(event=>event.id===filters.event);
  const matches=matchesForRoster.filter(m => (filters.event==='all'||selectedEvent&&eventMatches(m,selectedEvent))&&(filters.date==='all'||m.date===filters.date)&&(filters.department==='all'||m.a===filters.department||m.b===filters.department||m.participants?.includes(filters.department))&&(filters.status==='all'||m.status===filters.status)).sort((a,b)=>priority[a.status]-priority[b.status]||(a.date+a.time).localeCompare(b.date+b.time));
  $('#result-count').textContent=`${matches.length} ${matches.length===1?'match':'matches'}`;
  $('#reset-filters').hidden=Object.values(filters).every(value=>value==='all');
  const extraCount=Number(filters.date!=='all')+Number(filters.department!=='all');
  $('#filter-count').hidden=extraCount===0;$('#filter-count').textContent=String(extraCount);
  document.querySelectorAll('#status-filters button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.status===filters.status)));
  const emptyText=selectedEvent&&!matchesForRoster.some(m=>eventMatches(m,selectedEvent))?'Fixtures pending.':'No matches for these filters.';
  $('#fixture-list').innerHTML=matches.length?matches.map(m=>`<button class="fixture-row reveal" data-match="${m.id}" aria-label="${m.status==='upcoming'?'Match details':'View score'}: ${esc(m.sport)}, ${esc(m.category)}, ${m.participants?'all departments':`${esc(m.a)} versus ${esc(m.b)}`}, ${date(m.date)}, ${time(m.time)}"><span class="match-topline"><strong>${esc(m.sport)} · ${esc(m.category)}</strong>${status(m)}</span><span class="fixture-teams${m.participants?' participants':''}">${m.participants?'<span class="team">All departments</span>':`${team(m.a)}${score(m)}${team(m.b)}`}</span><span class="match-bottomline"><span class="match-facts">${date(m.date)} · ${time(m.time)}<small>${esc(m.venue)}</small></span><span class="match-action">${m.status==='upcoming'?'Details':'View score'} →</span></span></button>`).join(''):`<div class="empty event-empty"><p>${emptyText}</p>${selectedEvent?`<button type="button" class="event-preview" data-event-preview="${esc(selectedEvent.id)}" aria-label="Preview ${esc(selectedEvent.sport)} arena, ${esc(selectedEvent.category)}">View arena →</button>`:''}</div>`;
}
$('#event-filter').addEventListener('change',event=>{filters.event=event.target.value;renderFixtures();});
$('#date-filter').addEventListener('change',event=>{filters.date=event.target.value;renderFixtures();});
$('#dept-filter').addEventListener('change',event=>{filters.department=event.target.value;renderFixtures();});
$('#status-filters').addEventListener('click',event=>{const button=event.target.closest('button[data-status]');if(!button)return;filters.status=button.dataset.status;renderFixtures();});
$('#reset-filters').addEventListener('click',()=>{Object.keys(filters).forEach(key=>filters[key]='all');['#event-filter','#dept-filter','#date-filter'].forEach(selector=>$(selector).value='all');$('#more-filters').open=false;renderFixtures();});
renderFixtures();

const dialog=$('#match-dialog');let lastMatchButton;
function showMatch(id,trigger){
  const m=matchesForRoster.find(item=>item.id===id);if(!m)return;
  lastMatchButton=trigger;
  $('#match-title').textContent=`${m.sport} · ${m.category}`;
  $('.dialog-demo').textContent='Demo data';
  const matchTeam=id=>`<div class="detail-team"><strong>${esc(id)}</strong><small>${esc(departments[id].name)}</small></div>`;
  const detail=$('#match-detail');
  const scoreboard=`<div class="arena-score-top">${status(m)}${m.status==='live'&&m.progress?`<strong>${esc(m.progress)}</strong>`:''}</div><div class="detail-scoreboard">${m.participants?`<div class="athletics-depts">${m.participants.map(esc).join(' · ')}</div>`:`${matchTeam(m.a)}${score(m)}${matchTeam(m.b)}`}</div><div class="arena-score-bottom">${esc(m.stage)} · ${esc(m.venue)}</div>`;
  const summary=`<dl class="detail-facts"><div><dt>Scheduled start</dt><dd>${fullDate(m.date)} · ${time(m.time)} IST</dd></div>${m.format?`<div><dt>Format</dt><dd>${esc(m.format)}</dd></div>`:''}</dl>${m.breakdown?`<div class="detail-extra"><h3>Scorecard</h3><table class="score-breakdown"><thead><tr><th scope="col">Period</th><th scope="col">${esc(m.a)}</th><th scope="col">${esc(m.b)}</th></tr></thead><tbody>${m.breakdown.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}`;
  detail.innerHTML=window.MatchCourt.render(m,scoreboard,esc)+`<div class="match-summary">${summary}</div>`;
  window.MatchCourt.initialise(detail);
  dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
}
function showEvent(id,trigger){
  const event=events.find(item=>item.id===id);if(!event)return;
  lastMatchButton=trigger;
  $('#match-title').textContent=`${event.sport} · ${event.category}`;
  $('.dialog-demo').textContent='Arena preview';
  $('#match-detail').innerHTML=window.MatchCourt.render(event,'<div class="arena-pending">Fixtures pending</div>',esc);
  window.MatchCourt.initialise($('#match-detail'));
  dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
}
document.addEventListener('click',event=>{const match=event.target.closest('[data-match]');if(match){showMatch(match.dataset.match,match);return;}const preview=event.target.closest('[data-event-preview]');if(preview)showEvent(preview.dataset.eventPreview,preview);});
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastMatchButton?.focus({preventScroll:true});});

// Event standings and overall rankings share the completed-result calculator.
$('#points-event').innerHTML = $('#event-filter').innerHTML;
let leaderboardCategory = 'all';
const departmentMark = row => `<span class="department-mark" style="--department-color:${esc(row.color)};--department-bg:${esc(row.bg)}" aria-hidden="true">${esc(row.id)}</span>`;
function renderPoints(){
  const selected = events.find(event => event.id === $('#points-event').value);
  const matches = selected ? matchesForRoster.filter(match => eventMatches(match,selected)) : matchesForRoster;
  const table = window.ChampionshipRankings.calculate(data.departments,matches);
  $('#points-summary').textContent = table.completed ? `${table.completed} completed ${table.completed===1?'match':'matches'}` : 'No completed results yet';
  $('#points-body').innerHTML = table.rows.map(row => `<tr${row.rank===1&&row.wins>0?' class="leading-row"':''}><td class="position-cell">${row.rank??'<span aria-label="Unranked">—</span>'}</td><th scope="row"><span class="table-department">${departmentMark(row)}<span><strong>${esc(row.id)}</strong><small>${esc(row.name)}</small></span></span></th><td>${row.played}</td><td class="wins-cell">${row.wins}</td><td>${row.draws}</td><td>${row.losses}</td></tr>`).join('');
}
function renderLeaderboard(){
  const matches = leaderboardCategory === 'all' ? matchesForRoster : matchesForRoster.filter(match => match.category === leaderboardCategory);
  const board = window.ChampionshipRankings.calculate(data.departments,matches);
  const best = board.rows[0].wins;
  const leaders = board.rows.filter(row => row.wins === best && best > 0);
  $('#leaderboard-feature').innerHTML = leaders.length ? `<div class="leader-feature"><div><span class="leader-eyebrow">${leaders.length>1?'SHARED LEAD':'LEADING DEPARTMENT'}</span><h3>${leaders.map(row=>esc(row.id)).join(' · ')}</h3><p>${leaders.length===1?esc(leaders[0].name):'Equal wins. Equal rank.'}</p></div><div class="leader-total"><strong>${best}</strong><span>${best===1?'win':'wins'}</span></div><div class="leader-lines" aria-hidden="true"></div></div>` : `<div class="leader-pending"><span class="leader-eyebrow">THE RACE IS OPEN</span><h3>No wins recorded yet.</h3><p>Rankings appear after completed results.</p></div>`;
  $('#leaderboard-summary').textContent = `${board.completed} completed ${board.completed===1?'match':'matches'} · ${data.departments.length} departments`;
  $('#leaderboard-list').innerHTML = board.rows.map(row => `<li class="department-leader${row.rank===1&&row.wins>0?' is-leading':''}"><span class="leader-position" aria-label="${row.rank==null?'Unranked':`Rank ${row.rank}`}">${row.rank??'—'}</span>${departmentMark(row)}<div class="leader-department"><strong>${esc(row.id)}</strong><small>${esc(row.name)}</small></div><div class="leader-record"><strong>${row.wins} <span>${row.wins===1?'win':'wins'}</span></strong><small>${row.played?`${row.played} played`:'Yet to play'}</small></div></li>`).join('');
  document.querySelectorAll('[data-category]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.category===leaderboardCategory)));
}
$('#points-event').addEventListener('change',renderPoints);
$('.leaderboard-controls').addEventListener('click',event=>{
  const button=event.target.closest('[data-category]');if(!button)return;
  leaderboardCategory=button.dataset.category;renderLeaderboard();
});
renderPoints();renderLeaderboard();
const liveMatches=matchesForRoster.filter(match=>match.status==='live').length;
const liveShortcut=document.createElement('a');
liveShortcut.className='live-shortcut';liveShortcut.href='#fixtures';
liveShortcut.innerHTML=`<i aria-hidden="true"></i>${liveMatches} live ${liveMatches===1?'match':'matches'}<span aria-hidden="true">↗</span>`;
liveShortcut.addEventListener('click',()=>{filters.status='live';renderFixtures();});
$('.championship-numbers').append(liveShortcut);
function applyView(focus=false){
  const requested=window.location.hash.slice(1);
  const view=['points','leaderboard'].includes(requested)?requested:'fixtures';
  document.querySelectorAll('[data-section]').forEach(section=>{section.hidden=section.dataset.section!==view;});
  $('[data-intro]').hidden=view!=='fixtures';
  document.querySelectorAll('[data-view]').forEach(link=>{if(link.dataset.view===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  if(focus){
    const heading=$(`[data-section="${view}"] h2`);heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
  }
}
window.addEventListener('hashchange',()=>applyView(true));
applyView();
