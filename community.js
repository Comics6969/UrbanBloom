const eventEffects = {
  springFestival: () => addBuildingToOrder('Park'),
  cleanUp: () => alert('✨ The city sparkles with cleanliness!'),
  backToSchool: () => addBuildingToOrder('School'),
  rainyReflection: () => alert('☔ The mood is calm and peaceful.'),
  mysteryDrop: () => {
    addBuildingToOrder('Mall');
    addBuildingToOrder('Shop');
}
};


const completedEvents = JSON.parse(localStorage.getItem('completedEvents') || '[]');

function markEventComplete(eventName) {
  if (!completedEvents.includes(eventName)) {
    completedEvents.push(eventName);
    localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
  }
}

function addBuildingToOrder(name) {
  const order = JSON.parse(localStorage.getItem('urbanBloomOrder') || '[]');
  order.push(name);
  localStorage.setItem('urbanBloomOrder', JSON.stringify(order));
  localStorage.setItem('urbanBloomVisits', order.length.toString());
  alert(`🏗️ A new ${name} has been added to your city!`);
}

document.querySelectorAll('.event').forEach(el => {
  const eventName = el.dataset.event;
  const btn = el.querySelector('.event-btn');

 function markEventComplete(eventName) {
  completedEvents[eventName] = Date.now();
  localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
}
  btn.addEventListener('click', () => {
    if (eventEffects[eventName]) {
      eventEffects[eventName]();
      markEventComplete(eventName);
      btn.disabled = true;
      btn.textContent = 'Completed ✅';
    }
  });
});
function startRain() {
  let rainContainer = document.querySelector('.rain-container');
  if (!rainContainer) {
    rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    document.body.appendChild(rainContainer);
  }

  for (let i = 0; i < 100; i++) {
    const drop = document.createElement('div');
    drop.className = 'raindrop';
    drop.style.left = Math.random() * 100 + 'vw';
    drop.style.animationDuration = (Math.random() * 0.5 + 0.75) + 's';
    drop.style.animationDelay = (Math.random() * 2) + 's';
    rainContainer.appendChild(drop);
  }

  setTimeout(() => {
    rainContainer.remove();
  }, 15000); // stops rain after 15 seconds
}

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 1 day in ms

document.querySelectorAll('.event').forEach(el => {
  const eventName = el.dataset.event;
  const btn = el.querySelector('.event-btn');

  if (completedEvents[eventName]) {
    const elapsed = Date.now() - completedEvents[eventName];
    if (elapsed < COOLDOWN_MS) {
      btn.disabled = true;
      btn.textContent = 'Completed ✅';
    } else {
      // cooldown passed, allow repeat
      btn.disabled = false;
      btn.textContent = 'Participate';
      // Optionally remove old timestamp:
      delete completedEvents[eventName];
      localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
    }
  }

  btn.addEventListener('click', () => {
    if (eventEffects[eventName]) {
      eventEffects[eventName]();
      markEventComplete(eventName);
      btn.disabled = true;
      btn.textContent = 'Completed ✅';
    }
  });
});