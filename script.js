// Firebase setup
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get, onValue } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBPv05k1HLn_aL_gzimL3xxDO80-Vg-qBc",
  authDomain: "urbanbloom-1234.firebaseapp.com",
  projectId: "urbanbloom-1234",
  storageBucket: "urbanbloom-1234.firebasestorage.app",
  messagingSenderId: "635582243597",
  appId: "1:635582243597:web:8448352c82cb2323144644",
  measurementId: "G-LEV0YBZFPZ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Use 'database' consistently for the database instance

async function getVisitCount() {
  const snapshot = await get(ref(database, "visits"));
  const visits = snapshot.exists() ? snapshot.val() : 0;
  return parseInt(visits);
}

async function setVisitCount(count) {
  await set(ref(database, "visits"), count);
}

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  // Based on Adelaide, Australia (Southern Hemisphere) seasons
  if (month >= 3 && month <= 5) return 'autumn'; // March, April, May
  if (month >= 6 && month <= 8) return 'winter'; // June, July, August
  if (month >= 9 && month <= 11) return 'spring'; // September, October, November
  return 'summer'; // December, January, February
}

function updateWeatherSeasonDisplay() {
  const season = getCurrentSeason();
  const funWeatherBySeason = {
    spring: () => "🌷 UrbanBloom’s calling it Spring — time to bloom, baby!",
    summer: () => "☀️ UrbanBloom’s shining bright — don’t forget your shades!",
    autumn: () => "🍂 UrbanBloom’s rocking Autumn — leaves are falling, so chill too.",
    winter: () => "❄️ UrbanBloom’s snowy vibes — stay cozy, legends!",
  };

  const seasonDisplay = document.getElementById('season-display');
  const weatherDisplay = document.getElementById('weather-display');

  if (seasonDisplay && weatherDisplay) {
    seasonDisplay.textContent = `UrbanBloom's current Season: ${season.charAt(0).toUpperCase() + season.slice(1)}`;
    weatherDisplay.textContent = `UrbanBloom's current Weather: ${funWeatherBySeason[season]()}`;
  }
}

function updateDateTimeDisplay() {
  const now = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  };
  // Ensure 'en-AU' for Australian locale
  const formatted = now.toLocaleString('en-AU', options);
  const dtEl = document.getElementById('datetime-display');
  if (dtEl) dtEl.textContent = `🕒 UrbanBloom Time: ${formatted}`;
  setTimeout(updateDateTimeDisplay, 1000 - now.getMilliseconds());
}

async function growCity() {
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

  let visitCount = await getVisitCount();
  let buildOrder = [];

  const snap = await get(ref(database, "buildOrder")); // Use 'database'
  const savedOrderNames = snap.exists() ? snap.val() : [];

  // Reconstruct buildOrder from saved names, filtering out any unknown names
  if (Array.isArray(savedOrderNames) && savedOrderNames.length > 0) {
    buildOrder = savedOrderNames.map(name => cityElements.find(el => el.name === name)).filter(Boolean);
    // Ensure visitCount is at least one more than the current number of buildings to add a new one
    visitCount = Math.max(visitCount, buildOrder.length) + 1;
  } else {
    // If no saved order or invalid, start fresh
    visitCount++;
  }

  await setVisitCount(visitCount);

  // Add the new building to the buildOrder if it isn't already there
  // This logic ensures a new building is added for each visit if buildOrder is shorter than visitCount
  if (buildOrder.length < visitCount) {
    const newBuilding = cityElements[(visitCount - 1) % cityElements.length];
    buildOrder.push(newBuilding);
  }

  // Save updated order (names only) back to Firebase
  const orderNamesToSave = buildOrder.map(b => b.name);
  await set(ref(database, "buildOrder"), orderNamesToSave);

  const city = document.getElementById('city');
  const status = document.getElementById('status');
  city.innerHTML = ''; // Clear existing city elements

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

  async function handleDrop(e) { // Made async to use await for Firebase
    if (e.stopPropagation) e.stopPropagation();

    if (dragSrcEl !== this) {
      // Swap content and style
      const tempHTML = this.innerHTML;
      const tempBg = this.style.backgroundColor;

      this.innerHTML = dragSrcEl.innerHTML;
      this.style.backgroundColor = dragSrcEl.style.backgroundColor;

      dragSrcEl.innerHTML = tempHTML;
      dragSrcEl.style.backgroundColor = tempBg;

      // Save new order to Firebase
      const order = Array.from(city.children).map(child =>
        child.querySelector('.label').textContent
      );
      await set(ref(database, "buildOrder"), order); // Use 'database' and await
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

  // The last added building for the status message
  const lastAddedBuilding = buildOrder[buildOrder.length - 1];

  status.innerHTML = `
    🌟 Visit #${visitCount}: ${lastAddedBuilding ? lastAddedBuilding.emoji + ' ' + lastAddedBuilding.name : 'A building'} added to the city!<br/>
    🏙️ Total buildings: ${buildOrder.length}<br/>
    📊 Breakdown: ${countsSummary}
  `;
}

function startDayNightCycle() {
  const body = document.body;
  let isDay = true; // Assume starting in day mode

  // Set initial state (daytime class)
  body.classList.add('daytime');

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

// YouTube Player and Radio Controls
const stations = {
  urbanchill: { id: "7XXu_-eoxHo", name: "Urban Chill" },
  naturevibes: { id: "9GaBMZRHM3U", name: "Nature Vibes" },
  sunsetsynth: { id: "ot5UsNymqgQ", name: "Sunset Synth" }
};

let currentStation = "urbanchill";
let player;
let noteInterval; // Declare noteInterval globally or accessible

// Load the YouTube IFrame API script
const tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api"; // Correct YouTube API URL
document.body.appendChild(tag);

// This function is called by the YouTube IFrame API when it's ready
window.onYouTubeIframeAPIReady = function() {
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
      mute: 1 // Start muted
    },
    events: {
      onReady: (event) => {
        // Play video, but keep muted initially. User will unmute via button.
        event.target.playVideo();
      }
    }
  });
};

document.getElementById('toggle-radio').addEventListener('click', () => {
  if (player) {
    const btn = document.getElementById('toggle-radio');

    if (player.isMuted()) {
      player.unMute();
      player.playVideo();
      btn.textContent = 'Pause Radio';
      noteInterval = setInterval(emitMusicNote, 800); // Start emitting notes
    } else {
      player.pauseVideo();
      player.mute();
      btn.textContent = 'Play Radio';
      clearInterval(noteInterval); // Stop emitting notes
    }
  }
});

// Switch station
document.getElementById('station-selector').addEventListener('change', (e) => {
  const selected = e.target.value;
  currentStation = selected;
  const station = stations[selected];
  if (player && station) {
    player.loadVideoById(station.id);
    // If playing, ensure it continues playing after changing station
    if (!player.isMuted()) {
      player.playVideo();
    }
  }
});

document.getElementById('community-events-btn').addEventListener('click', () => {
  window.location.href = 'community.html';
});

// Music Notes Visual Effect
function emitMusicNote() {
  const note = document.createElement('div');
  note.className = 'music-note';
  note.textContent = ['🎵', '🎶'][Math.floor(Math.random() * 2)];

  const radio = document.getElementById('radio-controls');
  const rect = radio.getBoundingClientRect();

  // Position notes to float up from above the radio controls
  // Add some randomness to horizontal position
  const randomXOffset = (Math.random() - 0.5) * 50; // -25 to +25 pixels
  note.style.left = `${rect.left + rect.width / 2 + randomXOffset}px`;
  note.style.top = `${rect.top - 10}px`; // Start slightly above the radio

  document.body.appendChild(note);

  // Remove note after animation (adjust to match CSS animation duration)
  setTimeout(() => {
    note.remove();
  }, 2000); // Assuming CSS animation is 2s
}


// Holiday functions
function displayHolidays() {
  const holidayList = document.getElementById('holiday-list');
  const currentMonth = new Date().getMonth(); // 0-indexed

   const holidays = [
    // Ensure the months match the current month from getCurrentSeason logic for Southern Hemisphere display
    { date: 'January 1', month: 0, name: "🎉 Bloom Year's Day", desc: "Start fresh with fireworks and confetti!" },
    { date: 'February 14', month: 1, name: "💖🌳 LoveTree Day", desc: "Plant trees for your loved ones!" },
    { date: 'March 20', month: 2, name: "🍂 Autumn Equinox", desc: "A perfect balance of light and dark for introspection." }, // Added for Southern Hemisphere autumn
    { date: 'April 22', month: 3, name: "🌍 EcoFest", desc: "Celebrate sustainability together!" },
    { date: 'June 3', month: 5, name: "🌸 UrbanBloom Birthday", desc: "Celebrating the day UrbanBloom sprang to life at 19:11!" },
    { date: 'June 6', month: 5, name: "🍩 National Donut Day", desc: "Celebrate with sweet rings of joy all around UrbanBloom!"},
    { date: 'June 20', month: 5, name: "❄️ Winter Solstice", desc: "Longest night, perfect for stargazing and cozy gatherings." }, // Added for Southern Hemisphere winter
    { date: 'July 20', month: 6, name: "☀️ Sunny Bash", desc: "Fun, music, and sunshine!" }, // Still fits here, but perhaps rename for winter celebration?
    { date: 'September 22', month: 8, name: "🌷 Spring Equinox", desc: "Embrace renewal as nature awakens with vibrant colors." }, // Added for Southern Hemisphere spring
    { date: 'October 31', month: 9, name: "🎃 Halloween", desc: "Glowing costumes and spooky vibes!" },
    { date: 'December 21', month: 11, name: "☀️ Summer Solstice", desc: "Longest day, time for beach parties and outdoor fun!" }, // Added for Southern Hemisphere summer
    { date: 'December 24', month: 11, name: "❄️ Christmas", desc: "Lanterns, peace, and snow." },
    { date: 'January 27', month: 0, name: "✨ Digital Spark Festival", desc: "Celebrate the city going online — and secret sparks of genius!" },
  ];


  // Filter holidays for current month
  const thisMonthHolidays = holidays.filter(h => h.month === currentMonth);

  if (holidayList) { // Check if holidayList exists
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
}

function setHolidayTheme() {
  const now = new Date();
  // Ensure consistency: use same locale for date formatting if needed, or stick to month/date numbers
  const today = `${now.getMonth() + 1}/${now.getDate()}`; // e.g., "6/6"
  const body = document.body;

  const holidayThemes = {
    "1/1": "newyear",
    "2/14": "lovetree",
    "3/20": "autumn-equinox", // New: for Southern Hemisphere
    "4/22": "ecofest",
    "6/3": "birthday",
    "6/6": "donut",
    "6/20": "winter-solstice", // New: for Southern Hemisphere
    "7/20": "sunnybash",
    "9/22": "spring-equinox", // New: for Southern Hemisphere
    "10/31": "halloween",
    "12/21": "summer-solstice", // New: for Southern Hemisphere
    "12/24": "christmas",
    "1/27": "digitalspark"
  };

  // Remove any previous holiday themes
  Object.values(holidayThemes).forEach(theme => {
    body.classList.remove(`theme-${theme}`);
  });

  const themeKey = holidayThemes[today];
  if (themeKey) {
    body.classList.add(`theme-${themeKey}`);
    console.log(`🎉 Holiday theme applied: ${themeKey}`);
  }
}

// Initial setup and Firebase listeners on DOM ready
document.addEventListener("DOMContentLoaded", async () => {
  await growCity(); // Initial city load and display
  updateWeatherSeasonDisplay(); // Display season/weather
  updateDateTimeDisplay(); // Start the clock
  startDayNightCycle(); // Start day/night cycle animation
  displayHolidays(); // Display holidays for the current month
  setHolidayTheme(); // Apply holiday specific themes if any

  // Firebase listeners for real-time updates to the city
  // These will trigger growCity() when data changes in Firebase
  onValue(ref(database, "buildOrder"), () => growCity());
  onValue(ref(database, "visits"), () => growCity());
});

// The `window.onload` is generally less preferred than `DOMContentLoaded`
// as `DOMContentLoaded` fires when the DOM is ready, while `onload` waits for all assets (images, etc.)
// For this application, DOMContentLoaded is sufficient and usually faster.
// Removed the redundant window.onload from your original code.