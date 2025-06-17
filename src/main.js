import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`

setupCounter(document.querySelector('#counter'))
const apiUrl = 'https://gbfdrefilxtlmdzmuyrz.supabase.co/rest/v1/articles';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmRyZWZpbHh0bG1kem11eXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTYzMjQsImV4cCI6MjA2NTAzMjMyNH0.mZzjaJun0dfP6VgYQyiMVRB2m1OI2x-e1WvsuJZcbRI';

const fetchArticles = async () => {

  try {
    const response = await fetch(`${apiUrl}?select=*`, {
      headers: {
        apiKey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`HTTP Error: ${response.status}`, body);
      throw new Error('Fetch failed');
    }

    const data = await response.json();
    console.log('Artykuły:', data);
    renderArticles(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
};


const renderArticles = (articles) => {
  const container = document.getElementById('articles');
  container.innerHTML = '';
  articles.forEach(article => {
    const div = document.createElement('div');
    div.classList.add('border', 'p-4', 'bg-white', 'rounded');
    div.innerHTML = `
      <h2 class="text-xl font-semibold">${article.title}</h2>
      <h3 class="italic text-sm">${article.subtitle}</h3>
      <p class="text-sm text-gray-600">Autor: ${article.author} | Data: ${new Date(article.created_at).toLocaleString()}</p>
      <p class="mt-2">${article.content}</p>
    `;
    container.appendChild(div);
  });
};

const createNewArticle = async (article) => {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        apiKey: apiKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(article)
    });

    if (response.status !== 201) {
      throw new Error(`Status: ${response.status}`);
    }

    const newArticle = await response.json();
    fetchArticles();
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

document.getElementById('articleForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const article = {
    title: formData.get('title'),
    subtitle: formData.get('subtitle'),
    author: formData.get('author'),
    content: formData.get('content'),
  };
  await createNewArticle(article);
  e.target.reset();
});

fetchArticles();
