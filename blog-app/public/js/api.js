// Shared helpers: API calls, auth state, navbar.
const API = '/api';

const Auth = {
  get token() { return localStorage.getItem('token'); },
  get user() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },
  save(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  get loggedIn() { return !!this.token; },
};

async function api(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && Auth.token) headers.Authorization = `Bearer ${Auth.token}`;

  let res;
  try {
    res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Is it running?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) Auth.clear();
    throw new Error(data.message || 'Request failed.');
  }
  return data;
}

function showMsg(el, text, type) {
  el.textContent = text;
  el.className = 'msg ' + type;
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

function renderNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const links = Auth.loggedIn
    ? `<span>Hi, ${escapeHtml(Auth.user?.name || 'user')}</span>
       <a href="/create-blog.html">Write a Blog</a>
       <button id="logout">Logout</button>`
    : `<a href="/login.html">Login</a><a href="/register.html">Register</a>`;
  nav.innerHTML = `<a class="brand" href="/">📝 BlogApp</a><div class="links"><a href="/">Home</a>${links}</div>`;
  document.getElementById('logout')?.addEventListener('click', () => {
    Auth.clear();
    window.location.href = '/';
  });
}
document.addEventListener('DOMContentLoaded', renderNav);
