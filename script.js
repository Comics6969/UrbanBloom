function getVisitCount() {
  const visits = localStorage.getItem('urbanBloomVisits');
  return visits ? parseInt(visits) : 0;
}

function setVisitCount(count) {
  localStorage.setItem('urbanBloomVisits', count);
}
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

// Kick it all off!
growCity();
startDayNightCycle();

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



// Load YouTube IFrame API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
document.body.appendChild(tag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '0',      // Hide player by setting height and width to 0
    width: '0',
    videoId: '7XXu_-eoxHo', 
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: '7XXu_-eoxHo', 
      controls: 0,
      modestbranding: 1,
      iv_load_policy: 3,
      mute: 1 // Start muted so autoplay works on most browsers
    },
    events: {
      onReady: function(event) {
        event.target.playVideo();
      }
    }
  });
}

// Play/Pause toggle
document.getElementById('toggle-music').addEventListener('click', () => {
  if (player) {
    if (player.isMuted()) {
      player.unMute();
      player.playVideo();
      document.getElementById('toggle-music').textContent = 'Pause Music';
    } else {
      player.pauseVideo();
      player.mute();
      document.getElementById('toggle-music').textContent = 'Play Music';
    }
  }
});
