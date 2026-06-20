// Homepage logic: load manifest.json, render category tabs + searchable card grid.
// New tools appear automatically — no code change needed, just a manifest entry.
const state = { tools: [], category: '全部', query: '' };

const $ = (sel) => document.querySelector(sel);

async function load() {
  try {
    const res = await fetch('manifest.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    state.tools = (data.tools || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || '') || b.slug.localeCompare(a.slug));
    if (data.site) {
      if (data.site.title) { $('#title').textContent = data.site.title; document.title = data.site.title; }
      if (data.site.subtitle) $('#subtitle').textContent = data.site.subtitle;
    }
    renderMeta();
    renderTabs();
    renderGrid();
  } catch (e) {
    $('#grid').innerHTML = `<div class="empty">工具目录加载失败:${e.message}<br>请确认通过 http(s) 访问(本地用 <code>npm run serve</code>)。</div>`;
  }
}

function renderMeta() {
  const n = state.tools.length;
  const latest = state.tools[0];
  $('#meta').innerHTML = `已收录 <b>${n}</b> 个工具${latest ? ` · 最近更新 <b>${latest.date}</b>` : ''}`;
}

function categories() {
  const counts = new Map();
  for (const t of state.tools) counts.set(t.category || '其它', (counts.get(t.category || '其它') || 0) + 1);
  return [['全部', state.tools.length], ...[...counts.entries()].sort((a, b) => b[1] - a[1])];
}

function renderTabs() {
  const tabs = $('#tabs');
  tabs.innerHTML = '';
  for (const [cat, n] of categories()) {
    const b = document.createElement('button');
    b.className = 'cat-tab' + (cat === state.category ? ' active' : '');
    b.innerHTML = `${cat}<span class="n">${n}</span>`;
    b.onclick = () => { state.category = cat; renderTabs(); renderGrid(); };
    tabs.appendChild(b);
  }
}

function matches(t) {
  if (state.category !== '全部' && (t.category || '其它') !== state.category) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const hay = [t.title, t.subtitle, t.category, ...(t.tags || [])].join(' ').toLowerCase();
  return hay.includes(q);
}

function renderGrid() {
  const grid = $('#grid');
  grid.innerHTML = '';
  const shown = state.tools.filter(matches);
  if (!shown.length) {
    grid.innerHTML = `<div class="empty">没有匹配的工具。</div>`;
    return;
  }
  for (const t of state.tools) {
    const a = document.createElement('a');
    a.className = 'tool-card';
    a.href = t.path;
    a.style.display = matches(t) ? '' : 'none';
    const thumb = t.thumb
      ? `<div class="thumb"><img loading="lazy" src="${t.thumb}" alt="${escapeHtml(t.title)} 预览" onerror="var p=this.parentElement;p.classList.add('placeholder');p.textContent='🛠️';"></div>`
      : `<div class="thumb placeholder">🛠️</div>`;
    a.innerHTML = `
      ${thumb}
      <div class="card-body">
        <div class="card-top">
          <span class="badge">${escapeHtml(t.category || '其它')}</span>
          <span class="date">${escapeHtml(t.date || '')}</span>
        </div>
        <div class="card-title">${escapeHtml(t.title)}</div>
        <div class="card-sub">${escapeHtml(t.subtitle || '')}</div>
        <div class="open-btn">打开 →</div>
      </div>`;
    grid.appendChild(a);
  }
}

function escapeHtml(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

document.addEventListener('DOMContentLoaded', () => {
  $('#search').addEventListener('input', (e) => { state.query = e.target.value; renderGrid(); });
  load();
});
