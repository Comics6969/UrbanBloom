function getVisitCount() {
  const visits = localStorage.getItem('urbanBloomVisits');
  return visits ? parseInt(visits) : 0;
}

function setVisitCount(count) {
  localStorage.setItem('urbanBloomVisits', count);
}

function growCity() {
  const visitCount = getVisitCount() + 1;
  setVisitCount(visitCount);

  const city = document.getElementById('city');
  const status = document.getElementById('status');

  city.innerHTML = '';

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

  // Initialize counts
  const counts = {};
  cityElements.forEach(item => counts[item.name] = 0);

  for (let i = 0; i < visitCount; i++) {
    const { emoji, name, color } = cityElements[i % cityElements.length];
    counts[name]++;

    const building = document.createElement('div');
    building.className = 'building';

    const icon = document.createElement('div');
    icon.className = 'emoji';
    icon.textContent = emoji;

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = name;

    building.style.backgroundColor = color;

    building.appendChild(icon);
    building.appendChild(label);
    city.appendChild(building);
  }

  // Build the counts summary string
  const countsSummary = Object.entries(counts)
    .map(([name, count]) => `${count} ${name}${count > 1 ? 's' : ''}`)
    .join(', ');

  // Set status HTML content
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

// Call it after the city is grown
growCity();
startDayNightCycle();