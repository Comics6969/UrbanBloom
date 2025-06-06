document.addEventListener('DOMContentLoaded', function () {
  const calendarEl = document.getElementById('calendar');

  const holidays = [
    { title: "🎉 Bloom Year's Day", date: '2025-01-01', desc: "Start fresh with fireworks and confetti!" },
    { title: "💖🌳 LoveTree Day", date: '2025-02-14', desc: "Plant trees for your loved ones!" },
    { title: "🌍 EcoFest", date: '2025-04-22', desc: "Celebrate sustainability together!" },
    { title: "🌸 UrbanBloom Birthday", date: '2025-06-03', desc: "Celebrating the day UrbanBloom sprang to life at 19:11!" },
    { title: "🍩 National Donut Day", date: '2025-06-06', desc: "Celebrate with sweet rings of joy all around UrbanBloom!" },
    { title: "☀️ Sunny Bash", date: '2025-07-20', desc: "Fun, music, and sunshine!" },
    { title: "🎃 Halloween", date: '2025-10-31', desc: "Glowing costumes and spooky vibes!" },
    { title: "❄️ Christmas", date: '2025-12-24', desc: "Lanterns, peace, and snow." },
    { title: "✨ Digital Spark Festival", date: '2025-01-27', desc: "Celebrate the city going online — and secret sparks of genius!" }
  ];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    themeSystem: 'standard',
    events: holidays.map(h => ({
      title: h.title,
      date: h.date,
      extendedProps: {
        description: h.desc
      }
    })),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listMonth'
    },
   eventClick: function(info) {
  const infoBox = document.getElementById("holiday-info");

  document.getElementById("holiday-title").textContent = info.event.title;
  document.getElementById("holiday-description").textContent = info.event.extendedProps.description;

  infoBox.style.display = "block"; // ← ensure it’s visible
  infoBox.classList.add("show");
}
  });

  

  calendar.render();
  document.getElementById("holiday-info").classList.add("show");
  document.getElementById("close-holiday-info").addEventListener("click", function () {
  const infoBox = document.getElementById("holiday-info");
  infoBox.classList.remove("show");
  infoBox.style.display = "none"; // ← hide it completely
});
});