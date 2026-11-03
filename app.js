const data = window.CHAMPIONSHIP;
const $ = selector => document.querySelector(selector);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const departments = Object.fromEntries(data.departments.map(d => [d.id, d]));
const filters = { sport:'all', date:'all', department:'all', status:'all' };
const team = id => `<span class="team">${esc(id)}</span>`;
const statusText = {live:'LIVE', upcoming:'UPCOMING', completed:'COMPLETED'};
const status = m => `<span class="status ${m.status}">${statusText[m.status]}</span>`;
const time = value => new Date(`2000-01-01T${value}:00`).toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:true}).toUpperCase();
const date = value => new Date(`${value}T12:00:00+05:30`).toLocaleDateString('en-GB',{day:'2-digit',month:'short'});
const fullDate = value => new Date(`${value}T12:00:00+05:30`).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
const score = m => m.status==='upcoming' ? '<span class="score"><small>VS</small></span>' : `<span class="score">${esc(m.scoreA)}<small>–</small>${esc(m.scoreB)}</span>`;

$('#sport-filters').innerHTML = [{name:'All sports'}, ...data.sports].map((s,i)=>`<button data-sport="${i===0?'all':esc(s.name)}" class="${i===0?'selected':''}" aria-pressed="${i===0}">${esc(s.name)}</button>`).join('');
data.departments.forEach(d => $('#dept-filter').add(new Option(`${d.id} · ${d.name}`,d.id)));

function renderFixtures(){
  const priority={live:0,upcoming:1,completed:2};
  const matches=data.matches.filter(m => (filters.sport==='all'||m.sport===filters.sport)&&(filters.date==='all'||m.date===filters.date)&&(filters.department==='all'||m.a===filters.department||m.b===filters.department||m.participants?.includes(filters.department))&&(filters.status==='all'||m.status===filters.status)).sort((a,b)=>priority[a.status]-priority[b.status]||(a.date+a.time).localeCompare(b.date+b.time));
  $('#result-count').textContent=`${matches.length} ${matches.length===1?'match':'matches'}`;
  $('#reset-filters').hidden=Object.values(filters).every(value=>value==='all');
  $('#fixture-list').innerHTML=matches.length?matches.map(m=>`<button class="fixture-row reveal" data-match="${m.id}" aria-label="View ${esc(m.sport)}, ${m.participants?'all departments':`${esc(m.a)} versus ${esc(m.b)}`}, ${date(m.date)}, ${time(m.time)}"><span class="fixture-time">${m.status==='live'?status(m):time(m.time)}<small>${date(m.date)}</small></span><span class="fixture-sport"><strong>${esc(m.sport)} · ${esc(m.category)}</strong><small>${esc(m.stage)}</small></span><span class="fixture-teams">${m.participants?'<span class="team">100 m · All departments</span>':`${team(m.a)}${score(m)}${team(m.b)}`}</span><span class="fixture-venue">⌖ ${esc(m.venue)}${m.status==='completed'?'<br><small>Completed</small>':''}</span><span class="row-arrow" aria-hidden="true">↗</span></button>`).join(''):'<div class="empty"><strong>No fixtures found.</strong>Try another sport, date or department, or reset the filters.</div>';
}
$('#sport-filters').addEventListener('click',event=>{const button=event.target.closest('button[data-sport]');if(!button)return;filters.sport=button.dataset.sport;$('#sport-filters').querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});renderFixtures();});
$('.date-group').addEventListener('click',event=>{const button=event.target.closest('button[data-date]');if(!button)return;filters.date=button.dataset.date;$('.date-group').querySelectorAll('button').forEach(b=>{b.classList.toggle('selected',b===button);b.setAttribute('aria-pressed',b===button);});renderFixtures();});
$('#dept-filter').addEventListener('change',event=>{filters.department=event.target.value;renderFixtures();});
$('#status-filter').addEventListener('change',event=>{filters.status=event.target.value;renderFixtures();});
$('#reset-filters').addEventListener('click',()=>{Object.keys(filters).forEach(key=>filters[key]='all');$('#dept-filter').value='all';$('#status-filter').value='all';document.querySelectorAll('[data-sport],[data-date]').forEach(b=>{const selected=(b.dataset.sport||b.dataset.date)==='all';b.classList.toggle('selected',selected);b.setAttribute('aria-pressed',selected);});renderFixtures();});
renderFixtures();

const standings=data.standings.map(d=>({...d,points:d.gold*5+d.silver*3+d.bronze})).sort((a,b)=>b.points-a.points||b.gold-a.gold||b.silver-a.silver||b.bronze-a.bronze);
$('#leaderboard').innerHTML=standings.map((d,i)=>`<tr><td><span class="rank-dept"><span class="rank-number">${String(i+1).padStart(2,'0')}</span><span><strong>${esc(d.dept)}</strong><small>${esc(departments[d.dept].name)}</small></span></span></td><td>${d.gold}</td><td>${d.silver}</td><td>${d.bronze}</td><td>${d.points}</td></tr>`).join('');

function renderCoordinators(){
  const contacts=data.coordinators||[];
  $('#coordinator-search-wrap').hidden=contacts.length===0;
  $('#coordinator-grid').classList.toggle('has-contacts',contacts.length>0);
  if(!contacts.length){$('#coordinator-grid').innerHTML='<p class="coordinator-empty">Contacts pending.</p>';return;}
  const query=$('#coordinator-search').value.trim().toLowerCase();
  const matches=contacts.filter(c=>`${c.sport} ${c.name}`.toLowerCase().includes(query));
  $('#coordinator-grid').innerHTML=matches.length?matches.map(c=>`<article class="coordinator-card"><h3>${esc(c.sport)}</h3><p>${esc(c.name)}</p><div class="coordinator-contact">${c.phone?`<a href="tel:${String(c.phone).replace(/[^\d+]/g,'')}">${esc(c.phone)}</a>`:''}${c.email?`<a href="mailto:${encodeURIComponent(c.email)}">Email</a>`:''}</div></article>`).join(''):'<p class="coordinator-empty" role="status">No coordinators found.</p>';
}
$('#coordinator-search').addEventListener('input',renderCoordinators);renderCoordinators();

const dialog=$('#match-dialog');let lastMatchButton;
function showMatch(id,trigger){
  const m=data.matches.find(item=>item.id===id);if(!m)return;
  lastMatchButton=trigger;
  $('#match-title').textContent=`${m.sport} · ${m.category}`;
  const matchTeam=id=>`<div class="detail-team"><strong>${esc(id)}</strong><small>${esc(departments[id].name)}</small></div>`;
  const detail=$('#match-detail');
  const scoreboard=`<div class="arena-score-top">${status(m)}${m.status==='live'&&m.progress?`<strong>${esc(m.progress)}</strong>`:''}</div><div class="detail-scoreboard">${m.participants?`<div class="athletics-depts">${m.participants.map(esc).join(' · ')}</div>`:`${matchTeam(m.a)}${score(m)}${matchTeam(m.b)}`}</div><div class="arena-score-bottom">${esc(m.stage)} · ${esc(m.venue)}</div>`;
  const summary=`<dl class="detail-facts"><div><dt>Scheduled start</dt><dd>${fullDate(m.date)} · ${time(m.time)} IST</dd></div>${m.format?`<div><dt>Format</dt><dd>${esc(m.format)}</dd></div>`:''}</dl>${m.breakdown?`<div class="detail-extra"><h3>Scorecard</h3><table class="score-breakdown"><thead><tr><th scope="col">Period</th><th scope="col">${esc(m.a)}</th><th scope="col">${esc(m.b)}</th></tr></thead><tbody>${m.breakdown.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:''}`;
  detail.innerHTML=window.MatchCourt.render(m,scoreboard,esc)+`<div class="match-summary">${summary}</div>`;
  window.MatchCourt.initialise(detail);
  dialog.showModal();dialog.scrollTop=0;document.body.style.overflow='hidden';
}
document.addEventListener('click',event=>{const trigger=event.target.closest('[data-match]');if(trigger)showMatch(trigger.dataset.match,trigger);});
$('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastMatchButton?.focus({preventScroll:true});});
$('.menu-button').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('.menu-button').setAttribute('aria-expanded',open);$('.menu-button').setAttribute('aria-label',open?'Close navigation':'Open navigation');$('.menu-button').textContent=open?'✕':'☰';});
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>{$('nav').classList.remove('open');$('.menu-button').setAttribute('aria-expanded','false');$('.menu-button').setAttribute('aria-label','Open navigation');$('.menu-button').textContent='☰';}));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){const hash='#'+entry.target.id;document.querySelectorAll('nav a').forEach(a=>a.classList.toggle('active',a.hash===hash));}});},{rootMargin:'-10% 0px -65% 0px'});['home','fixtures','standings','coordinators'].forEach(id=>observer.observe(document.getElementById(id)));}
