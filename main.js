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
import { createClient } from 'https://esm.sh/@supabase/supabase-js'


const supabaseUrl = 'https://gbfdrefilxtlmdzmuyrz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdiZmRyZWZpbHh0bG1kem11eXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NTYzMjQsImV4cCI6MjA2NTAzMjMyNH0.mZzjaJun0dfP6VgYQyiMVRB2m1OI2x-e1WvsuJZcbRI'
const supabase = createClient(supabaseUrl, supabaseKey)

const container = document.getElementById('articles-container')

async function loadArticles() {
  const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false })

  if (error) {
    container.innerHTML = 'nie udalo sie wczytac artykulow.'
    return
  }

  container.innerHTML = ''
  data.forEach(art => {
    const div = document.createElement('div')
    div.className = 'bg-white p-4 mb-4 rounded shadow'
    div.innerHTML = `
      <h2 class="font-bold text-lg">${art.title}</h2>
      <p class="text-sm text-gray-600">${art.subtitle}</p>
      <p class="text-xs text-gray-500">Autor: ${art.author} | ${new Date(art.created_at).toLocaleDateString()}</p>
      <p class="mt-2">${art.content.replace(/\n/g, '<br>')}</p>
    `
    container.appendChild(div)
  })
}


document.getElementById('article-form').addEventListener('submit', async (e) => {
  e.preventDefault()

  const title = document.getElementById('title').value
  const subtitle = document.getElementById('subtitle').value
  const author = document.getElementById('author').value
  const content = document.getElementById('content').value

  const { error } = await supabase.from('articles').insert([{ title, subtitle, author, content }])

  if (error) {
    alert('Coś poszło nie tak')
  } else {
    e.target.reset()
    loadArticles()
  }
})

loadArticles()