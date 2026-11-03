// All records below are illustrative. Replace with approved championship data.
// This preview has no live score service. Never present these records as official.
window.CHAMPIONSHIP = {
  sample: true,
  coordinators: [], // Add approved { sport, name, phone, email } contacts here.
  departments: [
    { id: 'CSE', name: 'Computer Science', color: '#48672b', bg: '#e5edce' },
    { id: 'ECE', name: 'Electronics & Communication', color: '#8c5f37', bg: '#f2e6d8' },
    { id: 'ME', name: 'Mechanical Engineering', color: '#5d6487', bg: '#e8e9f2' },
    { id: 'ISE', name: 'Information Science', color: '#4f7d7f', bg: '#dfeeee' },
    { id: 'EEE', name: 'Electrical & Electronics', color: '#876b3b', bg: '#f2edd6' },
    { id: 'CV', name: 'Civil Engineering', color: '#835c70', bg: '#f0e3eb' }
  ],
  sports: [
    { name: 'Football', icon: '⚽', venue: 'Main football ground' },
    { name: 'Basketball', icon: '◉', venue: 'Basketball court' },
    { name: 'Cricket', icon: '🏏', venue: 'Cricket ground' },
    { name: 'Volleyball', icon: '◈', venue: 'Volleyball court' },
    { name: 'Badminton', icon: '⌁', venue: 'Indoor sports hall' },
    { name: 'Table tennis', icon: '◒', venue: 'Indoor sports hall' },
    { name: 'Athletics', icon: '↗', venue: 'Athletics track' },
    { name: 'Chess', icon: '♞', venue: 'Activity room' }
  ],
  standings: [
    { dept: 'CSE', gold: 4, silver: 2, bronze: 3 },
    { dept: 'ECE', gold: 3, silver: 3, bronze: 2 },
    { dept: 'ME', gold: 2, silver: 3, bronze: 3 },
    { dept: 'ISE', gold: 2, silver: 1, bronze: 4 },
    { dept: 'EEE', gold: 1, silver: 2, bronze: 3 },
    { dept: 'CV', gold: 1, silver: 2, bronze: 1 }
  ],
  matches: [
    { id:'fb-01', sport:'Football', category:'Men', stage:'Semi-final 01', date:'2026-11-03', time:'10:00', a:'CSE', b:'ME', status:'live', scoreA:'2', scoreB:'1', progress:'67′ · Second half', venue:'Main football ground', note:'CSE lead by one goal in this sample match.', breakdown:[['First half','1','1'],['Second half','1','0']] },
    { id:'bb-01', sport:'Basketball', category:'Women', stage:'Semi-final 01', date:'2026-11-03', time:'10:30', a:'ECE', b:'ISE', status:'live', scoreA:'42', scoreB:'38', progress:'Q3 · 04:28 remaining', venue:'Basketball court', note:'ECE lead by four points in this sample match.', breakdown:[['Quarter 1','14','12'],['Quarter 2','16','15'],['Quarter 3 · in progress','12','11']] },
    { id:'cr-01', sport:'Cricket', category:'Men', stage:'Group A', date:'2026-11-03', time:'11:30', a:'EEE', b:'CV', status:'upcoming', venue:'Cricket ground', format:'10 overs per side', note:'Scorecard will be available when this fixture begins.' },
    { id:'vb-01', sport:'Volleyball', category:'Men', stage:'Group B', date:'2026-11-03', time:'09:00', a:'CSE', b:'ECE', status:'completed', scoreA:'2', scoreB:'0', progress:'Full time', venue:'Volleyball court', note:'CSE won 2–0 in this sample result.', breakdown:[['Set 1','25','21'],['Set 2','25','19']] },
    { id:'bd-01', sport:'Badminton', category:'Women', stage:'Singles · Quarter-final', date:'2026-11-03', time:'14:00', a:'ME', b:'ISE', status:'upcoming', venue:'Indoor sports hall', format:'Best of 3 games', note:'Player names and court assignment will be confirmed by the coordinator.' },
    { id:'tt-01', sport:'Table tennis', category:'Men', stage:'Singles · Quarter-final', date:'2026-11-03', time:'15:00', a:'EEE', b:'CSE', status:'upcoming', venue:'Indoor sports hall', format:'Best of 5 games', note:'Player names and table assignment will be confirmed by the coordinator.' },
    { id:'fb-02', sport:'Football', category:'Men', stage:'Semi-final 02', date:'2026-11-04', time:'09:30', a:'ECE', b:'ISE', status:'upcoming', venue:'Main football ground', format:'Knockout', note:'The winner advances to the final.' },
    { id:'bb-02', sport:'Basketball', category:'Women', stage:'Semi-final 02', date:'2026-11-04', time:'11:00', a:'CSE', b:'CV', status:'upcoming', venue:'Basketball court', format:'4 quarters', note:'The winner advances to the final.' },
    { id:'ch-01', sport:'Chess', category:'Open', stage:'Round 01', date:'2026-11-04', time:'14:00', a:'ME', b:'EEE', status:'upcoming', venue:'Activity room', format:'Rapid · 15 minutes + 10 seconds', note:'Board and player assignments will be confirmed by the coordinator.' },
    { id:'at-01', sport:'Athletics', category:'Men', stage:'100 m · Heat 01', date:'2026-11-05', time:'08:30', participants:['CSE','ECE','ME','ISE','EEE','CV'], status:'upcoming', venue:'Athletics track', format:'100 metres', note:'Six departments compete. Lane assignments and individual athletes are to be confirmed.' },
    { id:'cr-02', sport:'Cricket', category:'Men', stage:'Group B', date:'2026-11-04', time:'08:00', a:'CSE', b:'ME', status:'upcoming', venue:'Cricket ground', format:'10 overs per side', note:'Scorecard will be available when this fixture begins.' },
    { id:'vb-02', sport:'Volleyball', category:'Women', stage:'Group A', date:'2026-11-05', time:'10:00', a:'ISE', b:'CV', status:'upcoming', venue:'Volleyball court', format:'Best of 3 sets', note:'Please confirm reporting time with your sport coordinator.' }
  ]
};
