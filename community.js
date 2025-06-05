const eventEffects = {
  springFestival: () => addBuildingToOrder('Park'),
  backToSchool: () => addBuildingToOrder('School'),
  rainyReflection: () => {
  alert('☔ The mood is calm and peaceful.');
},
  mysteryDrop: () => {
    addBuildingToOrder('Mall');
    addBuildingToOrder('Shop');
  }
};

// Store completed events with timestamps for cooldown tracking
const completedEvents = JSON.parse(localStorage.getItem('completedEvents') || '{}');

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 1 day in ms

function markEventComplete(eventName) {
  completedEvents[eventName] = Date.now();
  localStorage.setItem('completedEvents', JSON.stringify(completedEvents));
}

function addBuildingToOrder(name) {
  const order = JSON.parse(localStorage.getItem('urbanBloomOrder') || '[]');
  order.push(name);
  localStorage.setItem('urbanBloomOrder', JSON.stringify(order));
  localStorage.setItem('urbanBloomVisits', order.length.toString());
  alert(`🏗️ A new ${name} has been added to your city!`);
}

// Setup event buttons, check cooldown, attach listeners
document.querySelectorAll('.event').forEach(el => {
  const eventName = el.dataset.event;
  const btn = el.querySelector('.event-btn');

  // Check if event is completed and cooldown not passed
  if (completedEvents[eventName]) {
    const elapsed = Date.now() - completedEvents[eventName];
    if (elapsed < COOLDOWN_MS) {
      btn.disabled = true;
      btn.textContent = 'Completed ✅';
    } else {
      // Cooldown passed, reset event
      btn.disabled = false;
      btn.textContent = 'Participate';
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
    } else {
      console.warn(`No effect found for event: ${eventName}`);
    }
  });
});

function addBuildingToOrder(name) {
  const order = JSON.parse(localStorage.getItem('urbanBloomOrder') || '[]');
  order.push(name);
  localStorage.setItem('urbanBloomOrder', JSON.stringify(order));
  alert(`🏗️ A new ${name} has been added! Reload your city to see it.`);
}