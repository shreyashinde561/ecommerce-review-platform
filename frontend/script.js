// script.js

async function fetchData() {
  const reviewsRes = await fetch('http://localhost:3000/reviews');
  const reviews = await reviewsRes.json();
  const statsRes = await fetch('http://localhost:3000/stats');
  const stats = await statsRes.json();
  return { reviews, stats };
}

// Dashboard Stats Cards + Animated Counter
async function renderStats() {
  const { stats } = await fetchData();
  const container = document.getElementById('stats-cards');
  if (!container) return;
  container.innerHTML = '';

  const statList = [
    { label: 'Total Reviews', value: stats.total },
    { label: 'Positive Reviews', value: stats.positive },
    { label: 'Negative Reviews', value: stats.negative },
    { label: 'Platforms', value: stats.platforms.join(', ') }
  ];

  statList.forEach(s => {
    const card = document.createElement('div');
    card.className = 'card fade-in';
    card.innerHTML = `<h3 class="font-bold">${s.label}</h3><p class="text-2xl mt-2">${s.value}</p>`;
    container.appendChild(card);
  });
}

// Render Reviews List
async function renderReviews() {
  const { reviews } = await fetchData();
  const list = document.getElementById('reviews-list');
  if(!list) return;
  list.innerHTML = '';
  reviews.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.platform}: ${r.text}`;
    li.className = r.sentiment==='negative' ? 'negative' : '';
    list.appendChild(li);
  });
}

// Filter Reviews (by text)
function filterReviews() {
  const input = document.getElementById('search-input');
  const filter = input.value.toLowerCase();
  const list = document.getElementById('reviews-list');
  if(!list) return;
  Array.from(list.children).forEach(li => {
    li.style.display = li.textContent.toLowerCase().includes(filter) ? '' : 'none';
  });
}

// Render Key Issues
async function renderIssues() {
  const { reviews } = await fetchData();
  const container = document.getElementById('issues-list');
  if(!container) return;
  const issues = {};
  reviews.forEach(r => r.issues.forEach(i => issues[i] = (issues[i]||0)+1));
  container.innerHTML = '';
  Object.entries(issues).forEach(([key,val]) => {
    const li = document.createElement('li');
    li.textContent = `${key} (${val})`;
    container.appendChild(li);
  });
}

// Render Sentiment Chart using Chart.js
async function renderChart() {
  const { stats } = await fetchData();
  const ctx = document.getElementById('sentimentChart');
  if(!ctx) return;
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: ['Positive','Negative'],
      datasets: [{
        data: [stats.positive, stats.negative],
        backgroundColor: ['#10b981','#dc2626']
      }]
    },
    options: {
      responsive:true,
      plugins: { legend:{position:'bottom'} }
    }
  });
}

// Render AI Insights (dummy data)
function renderInsights() {
  const container = document.getElementById('insights-list');
  if(!container) return;
  const insights = [
    "Most negative reviews are about delivery delays",
    "Customers love product packaging",
    "Top suggestion: improve shipping speed",
    "Offer bundle discounts to increase positive feedback"
  ];
  container.innerHTML = '';
  insights.forEach(i => {
    const card = document.createElement('div');
    card.className='card fade-in';
    card.textContent = i;
    container.appendChild(card);
  });
}

// Call all render functions
document.addEventListener('DOMContentLoaded', () => {
  renderStats();
  renderReviews();
  renderIssues();
  renderChart();
  renderInsights();
});