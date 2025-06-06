function getVisitCount() {
  const visits = localStorage.getItem('urbanBloomVisits');
  return visits ? parseInt(visits) : 0;
}

function setVisitCount(count) {
  localStorage.setItem('urbanBloomVisits', count);
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function updateWeatherSeasonDisplay() {
  const season = getCurrentSeason();

  const weatherBySeason = {
    spring: "🌦️ Light Showers, 15°C",
    summer: "☀️ Sunny, 28°C",
    autumn: "🍂 Windy, 12°C",
    winter: "❄️ Snowy, -3°C",
  };

  const funWeatherBySeason = {
    spring: () => "🌷 UrbanBloom’s calling it Spring — time to bloom, baby!",
    summer: () => "☀️ UrbanBloom’s shining bright — don’t forget your shades!",
    autumn: () => "🍂 UrbanBloom’s rocking Autumn — leaves are falling, so chill too.",
    winter: () => "❄️ UrbanBloom’s snowy vibes — stay cozy, legends!",
  };

  const seasonDisplay = document.getElementById('season-display');
  const weatherDisplay = document.getElementById('weather-display');

  console.log("Season is:", season);
  console.log("Season Element:", seasonDisplay);
  console.log("Weather Element:", weatherDisplay);

  if (seasonDisplay && weatherDisplay) {
    seasonDisplay.textContent = `UrbanBloom's current Season: ${season.charAt(0).toUpperCase() + season.slice(1)}`;
    weatherDisplay.textContent = `UrbanBloom's current Weather: ${funWeatherBySeason[season]()}`;
  } else {
    console.warn("⚠️ Missing display elements!");
  }
}

function updateDateTimeDisplay() {
  const now = new Date();

  // Options for pretty formatting
  const options = {
    weekday: 'long',  // e.g., Monday
    year: 'numeric',  // 2025
    month: 'long',    // June
    day: 'numeric',   // 5
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false     // 24-hour format, switch to true for AM/PM vibes
  };

  const formattedDateTime = now.toLocaleString('en-AU', options);

  const datetimeDisplay = document.getElementById('datetime-display');
  if (datetimeDisplay) {
    datetimeDisplay.textContent = `🕒 UrbanBloom Time: ${formattedDateTime}`;
  } else {
    console.warn("⚠️ No #datetime-display element found!");
  }
}

// Call it once to avoid blank on load
updateDateTimeDisplay();

// Update every second for live vibes
setInterval(updateDateTimeDisplay, 1000);

function updateDateTimeDisplay() {
  const now = new Date();

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const formattedDateTime = now.toLocaleString('en-AU', options);

  const datetimeDisplay = document.getElementById('datetime-display');
  if (datetimeDisplay) {
    datetimeDisplay.textContent = `🕒 UrbanBloom Time: ${formattedDateTime}`;
  }

  // Calculate ms until next second exactly
  const delay = 1000 - now.getMilliseconds();

  // Schedule the next update exactly at the next second boundary
  setTimeout(updateDateTimeDisplay, delay);
}

// Start it off
updateDateTimeDisplay();
function growCity() {
  const cityElements = [
    { emoji: '🏠', name: 'House', color: '#ffebcd' },
    { emoji: '🌳', name: 'Park', color: '#b2f7b2' },
    { emoji: '🏢', name: 'Office', color: '#e0e0ff' },
    { emoji: '🚗', name: 'Car Lot', color: '#ffd1dc' },
    { emoji: '🏥', name: 'Hospital', color: '#ffe6e6' },
    { emoji: '🏫', name: 'School', color: '#fff5cc' },
    { emoji: '🛒', name: 'Shop', color: '#d9f0ff' },
    { emoji: '🏛️', name: 'City Hall', color: '#e6e6e6' },
    { emoji: '⛲', name: 'Fountain', color: '#d0f0ff' },
    { emoji: '🏬', name: 'Mall', color: '#f0e6ff' },
  ];

  function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}
  let visitCount = getVisitCount();
  let buildOrder = [];

  // Load saved order
  const savedOrderRaw = localStorage.getItem('urbanBloomOrder');
  if (savedOrderRaw) {
    try {
      const savedOrder = JSON.parse(savedOrderRaw);
      if (Array.isArray(savedOrder) && savedOrder.length > 0) {
        buildOrder = savedOrder
          .map(name => cityElements.find(el => el.name === name))
          .filter(Boolean);
        // Grow the city by adding 1 new building
        visitCount = Math.max(visitCount, buildOrder.length) + 1;
      }
    } catch {
      buildOrder = [];
      visitCount++;
    }
  } else {
    visitCount++;
  }

  setVisitCount(visitCount);

  // Add the new building to the buildOrder if it isn't already there
  if (buildOrder.length < visitCount) {
    const newBuilding = cityElements[(visitCount - 1) % cityElements.length];
    buildOrder.push(newBuilding);
  }

  // Save updated order
  localStorage.setItem('urbanBloomOrder', JSON.stringify(buildOrder.map(b => b.name)));

  // ... rest of your growCity function building the city from buildOrder

  const city = document.getElementById('city');
  const status = document.getElementById('status');
  city.innerHTML = '';

  const counts = {};
  cityElements.forEach(item => counts[item.name] = 0);

  let dragSrcEl = null;

  function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
    this.classList.add('dragging');
  }

  function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    if (e.stopPropagation) e.stopPropagation();

    if (dragSrcEl !== this) {
      // Swap content and style
      const tempHTML = this.innerHTML;
      const tempBg = this.style.backgroundColor;

      this.innerHTML = dragSrcEl.innerHTML;
      this.style.backgroundColor = dragSrcEl.style.backgroundColor;

      dragSrcEl.innerHTML = tempHTML;
      dragSrcEl.style.backgroundColor = tempBg;

      // Save new order
      const order = Array.from(city.children).map(child =>
        child.querySelector('.label').textContent
      );
      localStorage.setItem('urbanBloomOrder', JSON.stringify(order));
    }
    return false;
  }

  function handleDragEnd(e) {
    const buildings = city.querySelectorAll('.building');
    buildings.forEach(b => {
      b.classList.remove('over');
      b.classList.remove('dragging');
    });
  }

  // Build city according to buildOrder
  buildOrder.forEach(({ emoji, name, color }) => {
    counts[name]++;

    const building = document.createElement('div');
    building.className = 'building';
    building.draggable = true;
    building.style.backgroundColor = color;

    const icon = document.createElement('div');
    icon.className = 'emoji';
    icon.textContent = emoji;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = name;

    building.appendChild(icon);
    building.appendChild(label);

    building.addEventListener('dragstart', handleDragStart);
    building.addEventListener('dragenter', handleDragEnter);
    building.addEventListener('dragover', handleDragOver);
    building.addEventListener('dragleave', handleDragLeave);
    building.addEventListener('drop', handleDrop);
    building.addEventListener('dragend', handleDragEnd);

    city.appendChild(building);
  });

  // Update status
  const countsSummary = Object.entries(counts)
    .map(([name, count]) => `${count} ${name}${count > 1 ? 's' : ''}`)
    .join(', ');

  const newBuilding = cityElements[(visitCount - 1) % cityElements.length];
  status.innerHTML = `
    🌟 Visit #${visitCount}: ${newBuilding.emoji} ${newBuilding.name} added to the city!<br/>
    🏙️ Total buildings: ${visitCount}<br/>
    📊 Breakdown: ${countsSummary}
  `;
}

function startDayNightCycle() {
  const body = document.body;
  let isDay = true;

  setInterval(() => {
    if (isDay) {
      body.classList.remove('daytime');
      body.classList.add('nighttime');
    } else {
      body.classList.remove('nighttime');
      body.classList.add('daytime');
    }
    isDay = !isDay;
  }, 60000); // Switch every 60 seconds
}


const stations = {
  urbanchill: { id: "7XXu_-eoxHo", name: "Urban Chill" },
  naturevibes: { id: "9GaBMZRHM3U", name: "Nature Vibes" },
  sunsetsynth: { id: "ot5UsNymqgQ", name: "Sunset Synth" }
};

let currentStation = "urbanchill";
let player;

// Load the YouTube IFrame API
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',
    width: '0',
    videoId: stations[currentStation].id,
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: stations[currentStation].id,
      controls: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      mute: 1
    },
    events: {
      onReady: (event) => {
        event.target.playVideo();
      }
    }
  });
}

// Toggle play/pause
document.getElementById('toggle-radio').addEventListener('click', () => {
  if (player) {
    if (player.isMuted()) {
      player.unMute();
      player.playVideo();
      document.getElementById('toggle-radio').textContent = 'Pause Radio';
    } else {
      player.pauseVideo();
      player.mute();
      document.getElementById('toggle-radio').textContent = 'Play Radio';
    }

    let noteInterval;

document.getElementById('toggle-radio').addEventListener('click', () => {
  if (player) {
    const btn = document.getElementById('toggle-radio');

    if (player.isMuted()) {
      player.unMute();
      player.playVideo();
      btn.textContent = 'Pause Radio';

      noteInterval = setInterval(emitMusicNote, 800);
    } else {
      player.pauseVideo();
      player.mute();
      btn.textContent = 'Play Radio';

      clearInterval(noteInterval);
    }
  }
});
  }
});

// Switch station
document.getElementById('station-selector').addEventListener('change', (e) => {
  const selected = e.target.value;
  currentStation = selected;
  const station = stations[selected];
  if (player && station) {
    player.loadVideoById(station.id);
  }
});
document.getElementById('community-events-btn').addEventListener('click', () => {
  window.location.href = 'community.html'; // or whatever your page is called
});

window.addEventListener('storage', (e) => {
  if (e.key === 'urbanBloomOrder' || e.key === 'urbanBloomVisits') {
   growCity();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  growCity();
  updateWeatherSeasonDisplay();
  startDayNightCycle();
});

document.addEventListener("DOMContentLoaded", () => {
  growCity(); // your main city build logic
  updateWeatherSeasonDisplay(); // make weather show up
});
let noteY = 0; // offset to stack notes

//music notes
function emitMusicNote() {
  const note = document.createElement('div');
  note.className = 'music-note';
  note.textContent = ['🎵', '🎶'][Math.floor(Math.random() * 2)];

  const radio = document.getElementById('radio-controls');
  const rect = radio.getBoundingClientRect();

  // Fixed X: center above the radio
  note.style.left = `${rect.left + rect.width / 2}px`;

  // Vary Y slightly for a natural rise from the same place
  note.style.top = `${rect.top - 10}px`;

  document.body.appendChild(note);

  setTimeout(() => {
    note.remove();
  }, 2000);
}

// Kick it all off!
growCity();
updateWeatherSeasonDisplay();
startDayNightCycle();
displayHolidays();

window.onload = function () {
  growCity(); // or however you're initializing things
  updateWeatherSeasonDisplay(); // MUST be called here
  setHolidayTheme();
  applyTranslations();
};

function displayHolidays() {
  const holidayList = document.getElementById('holiday-list');
  const currentMonth = new Date().getMonth(); // 0-indexed

   const holidays = [
  { date: 'January 1', month: 0, name: "🎉 Bloom Year's Day", desc: "Start fresh with fireworks and confetti!" },
  { date: 'February 14', month: 1, name: "💖🌳 LoveTree Day", desc: "Plant trees for your loved ones!" },
  { date: 'April 22', month: 3, name: "🌍 EcoFest", desc: "Celebrate sustainability together!" },
  { date: 'July 20', month: 6, name: "☀️ Sunny Bash", desc: "Fun, music, and sunshine!" },
  { date: 'October 31', month: 9, name: "🎃 Halloween", desc: "Glowing costumes and spooky vibes!" },
  { date: 'December 24', month: 11, name: "❄️ Christmas", desc: "Lanterns, peace, and snow." },
  { date: 'June 3', month: 5, name: "🌸 UrbanBloom Birthday", desc: "Celebrating the day UrbanBloom sprang to life at 19:11!" },
  { date: 'January 27', month: 0, name: "✨ Digital Spark Festival", desc: "Celebrate the city going online — and secret sparks of genius!" },
  { date: 'June 6', month: 5, name: "🍩 National Donut Day", desc: "Celebrate with sweet rings of joy all around UrbanBloom!"}
];

  // Filter holidays for current month
  const thisMonthHolidays = holidays.filter(h => h.month === currentMonth);

  holidayList.innerHTML = '';

  if (thisMonthHolidays.length === 0) {
    holidayList.innerHTML = '<li>No special events this month... maybe invent one? 😜</li>';
  } else {
    thisMonthHolidays.forEach(h => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${h.name}</strong> (${h.date}) – ${h.desc}`;
      holidayList.appendChild(li);
    });
  }
}
function setHolidayTheme() {
  const now = new Date();
  const today = `${now.getMonth() + 1}/${now.getDate()}`; // e.g., "6/6"
  const body = document.body;

  const holidayThemes = {
    "1/1": "newyear",
    "2/14": "lovetree",
    "4/22": "ecofest",
    "6/3": "birthday",
    "6/6": "donut",       
    "7/20": "sunnybash",
    "10/31": "halloween",
    "12/24": "christmas",
    "1/27": "digitalspark"
  };

  const themeKey = holidayThemes[today];
  if (themeKey) {
    body.classList.add(`theme-${themeKey}`);
    console.log(`🎉 Holiday theme applied: ${themeKey}`);
  }
}