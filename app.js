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

const standings=data.standings.map(d=>({...d,points:d.gold*5+d.silver*3+d.bronze})).sort((a,b)=>b.points-a.points||b.gold-a.gold||b.silver-a.silver||b.bronze-a.bronze);
$('#leaderboard').innerHTML=standings.map((d,i)=>`<tr><td><span class="rank-dept"><span class="rank-number">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(d.dept)}</strong><small>${esc(departments[d.dept].name)}</small></span></span></td><td>${d.gold}</td><td>${d.silver}</td><td>${d.bronze}</td><td>${d.points}</td></tr>`).join('');

function renderCoordinators(){
  const contacts=data.coordinators||[];
  $('#coordinator-search-wrap').hidden=contacts.length===0;
  $('#coordinator-grid').classList.toggle('has-contacts',contacts.length>0);
  if(!contacts.length){$('#coordinator-grid').innerHTML='<p class="coordinator-empty">Coordinator contacts pending.</p>';return;}
  const query=$('#coordinator-search').value.trim().toLowerCase();
  const matches=contacts.filter(c=>`${c.sport} ${c.name}`.toLowerCase().includes(query));
  $('#coordinator-grid').innerHTML=matches.length?matches.map(c=>`<article class="coordinator-card"><h3>${esc(c.sport)}</h3><p>${esc(c.name)}</p><div class="coordinator-contact">${c.phone?`<a href="tel:${String(c.phone).replace(/[^\d+]/g,'')}">${esc(c.phone)}</a>`:''}${c.email?`<a href="mailto:${encodeURIComponent(c.email)}">Email</a>`:''}</div></article>`).join(''):'<p class="coordinator-empty" role="status">No coordinators found.</p>';
}
$('#coordinator-search').addEventListener('input',renderCoordinators);renderCoordinators();

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
function applyView(){
  const requested=window.location.hash.slice(1);
  const view=['fixtures','standings','coordinators'].includes(requested)?requested:'fixtures';
  document.querySelectorAll('[data-view-section]').forEach(section=>section.hidden=section.id!==view);
  document.querySelectorAll('nav [data-view]').forEach(link=>{if(link.dataset.view===view)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  window.scrollTo({top:0,behavior:'instant'});
}
window.addEventListener('hashchange',applyView);applyView();
