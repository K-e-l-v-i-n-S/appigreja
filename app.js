const STORAGE_KEY = "appigreja_prototype_state_v1";
const SESSION_KEY = "appigreja_prototype_session_v1";

// Se usar o Firebase Realtime Database, cole a URL aqui (ex: "https://appigreja-default-rtdb.firebaseio.com")
const CLOUD_DB_URL = "https://appigreja-1f504-default-rtdb.firebaseio.com/";

const CHURCHES = {
  sede: { name: "Igreja Sede", pastor: "Bispo Wagner", pastorId: "bispo-wagner" },
  campineiro: { name: "Igreja Campineiro", pastor: "Pastora Lindamir", pastorId: "pra-lindamir" },
  mogi: { name: "Igreja Mogi Guaçu", pastor: "Pastor Paulo", pastorId: "pr-paulo" },
};

const ROLE_LABELS = {
  obreiro: "Obreiro",
  lideranca: "Liderança",
  pastor: "Pastor",
  bispo: "Bispo",
  adm: "ADM",
};

const PAGE_PERMISSIONS = {
  "dashboard.html": ["pastor", "bispo", "adm"],
  "visitas.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
  "nova-visita.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
  "zaqueus.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
  "calendario.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
  "biblioteca.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
  "visao.html": ["lideranca", "pastor", "bispo", "adm"],
  "notificacoes.html": ["obreiro", "lideranca", "pastor", "bispo", "adm"],
};

const NAV_ITEMS = [
  { href: "dashboard.html", icon: "D", label: "Dashboard & Cargos", roles: ["pastor", "bispo", "adm"] },
  { href: "visitas.html", icon: "V", label: "Visitas realizadas", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
  { href: "nova-visita.html", icon: "+", label: "Nova visita", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
  { href: "zaqueus.html", icon: "Z", label: "Zaqueus", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
  { href: "calendario.html", icon: "C", label: "Calendário Igreja", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
  { href: "biblioteca.html", icon: "B", label: "Biblioteca", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
  { href: "visao.html", icon: "G", label: "Visão Geral", roles: ["lideranca", "pastor", "bispo", "adm"] },
  { href: "notificacoes.html", icon: "N", label: "Notificações", roles: ["obreiro", "lideranca", "pastor", "bispo", "adm"] },
];

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

let appState = loadAppState();
let currentUser = null;

function emptyState() {
  return {
    users: [],
    visits: [],
    zaqueus: [],
    zaqueuMaterials: [],
    libraryItems: [],
    calendarEvents: [],
    notifications: [],
  };
}

function normalizeChurchId(id) {
  if (id === "norte") return "campineiro";
  if (id === "leste") return "mogi";
  return CHURCHES[id] ? id : "sede";
}

function normalizeStateData(raw) {
  const base = emptyState();
  const parsed = raw || {};
  const state = {
    users: Array.isArray(parsed.users) ? parsed.users : base.users,
    visits: Array.isArray(parsed.visits) ? parsed.visits : base.visits,
    zaqueus: Array.isArray(parsed.zaqueus) ? parsed.zaqueus : base.zaqueus,
    zaqueuMaterials: Array.isArray(parsed.zaqueuMaterials) ? parsed.zaqueuMaterials : base.zaqueuMaterials,
    libraryItems: Array.isArray(parsed.libraryItems) ? parsed.libraryItems : base.libraryItems,
    calendarEvents: Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : base.calendarEvents,
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : base.notifications,
  };

  state.users.forEach((u) => {
    u.churchId = normalizeChurchId(u.churchId);
    u.church = CHURCHES[u.churchId].name;
    u.pastor = CHURCHES[u.churchId].pastor;
    u.pastorId = CHURCHES[u.churchId].pastorId;
    if (!ROLE_LABELS[u.roleId]) {
      u.roleId = "obreiro";
    }
    u.role = ROLE_LABELS[u.roleId];
  });

  if (state.users.length > 0 && !state.users.some((u) => u.roleId === "adm")) {
    state.users[0].roleId = "adm";
    state.users[0].role = ROLE_LABELS.adm;
  }

  state.visits.forEach((v) => {
    v.churchId = normalizeChurchId(v.churchId);
    v.church = CHURCHES[v.churchId].name;
    v.pastor = CHURCHES[v.churchId].pastor;
    v.pastorId = CHURCHES[v.churchId].pastorId;
  });

  return state;
}

function getCloudEndpoint() {
  const cleanUrl = String(CLOUD_DB_URL || "").trim().replace(/\/+$/, "");
  return cleanUrl ? `${cleanUrl}/appigreja_state.json` : "";
}

function loadAppState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    const state = normalizeStateData(parsed);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  } catch {
    return emptyState();
  }
}

async function syncFromCloud() {
  const endpoint = getCloudEndpoint();
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return;
    const cloudData = await response.json();

    if (cloudData && typeof cloudData === "object") {
      // O banco na nuvem possui dados: sincroniza o navegador com a nuvem
      appState = normalizeStateData(cloudData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      const savedUserId = localStorage.getItem(SESSION_KEY);
      if (savedUserId) {
        currentUser = appState.users.find((u) => u.id === savedUserId) || null;
        if (!currentUser && getCurrentPage() !== "index.html") {
          logout();
          return;
        }
      }
      if (getCurrentPage() !== "index.html") {
        renderAll();
      }
    } else if (cloudData === null) {
      // O banco na nuvem foi apagado: limpa o cache local para não ressuscitar registros apagados
      appState = emptyState();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
      currentUser = null;
      if (getCurrentPage() !== "index.html") {
        window.location.replace("index.html");
      }
    }
  } catch (err) {
    console.warn("Modo local ativo:", err);
  }
}

async function saveAppState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  const endpoint = getCloudEndpoint();
  if (!endpoint) return;
  try {
    await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appState),
    });
  } catch (err) {
    console.warn("Salvo localmente:", err);
  }
}

async function resetEntireDatabase() {
  if (!confirm("ATENÇÃO: Isso vai apagar TODOS os usuários, visitas, Zaqueus, eventos e notificações deste aparelho e da nuvem. Deseja zerar tudo?")) {
    return;
  }
  appState = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
  const endpoint = getCloudEndpoint();
  if (endpoint) {
    try {
      await fetch(endpoint, { method: "DELETE" });
    } catch (err) {
      console.warn("Erro ao limpar nuvem:", err);
    }
  }
  currentUser = null;
  window.location.replace("index.html");
}

function injectCriticalFixesCss() {
  if (document.querySelector("#appigreja-fixes-css")) return;
  const style = document.createElement("style");
  style.id = "appigreja-fixes-css";
  style.textContent = `
    body.is-authenticated .app-shell { display: grid !important; }
    body.is-authenticated .screen { display: block !important; }
    body.can-dashboard .dashboard-only { display: block !important; }
    .inline-admin-panel {
      margin-bottom: 20px;
      border: 2px solid #9bc6bb;
      background: #f5fbf8;
    }
    .user-role-row {
      display: grid;
      grid-template-columns: minmax(180px, 1.2fr) minmax(140px, 1fr) minmax(180px, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--line);
      border-radius: var(--radius);
      background: #ffffff;
    }
    .danger-btn {
      color: var(--red) !important;
      border-color: var(--red) !important;
      background: #fff5f5 !important;
      padding: 6px 10px !important;
      min-height: 32px !important;
      font-size: 12px !important;
    }
    .danger-btn:hover {
      background: var(--red) !important;
      color: #ffffff !important;
    }
    @media (max-width: 820px) {
      .user-role-row {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);
}

function injectPwaTags() {
  if (!document.querySelector('link[rel="manifest"]')) {
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = "manifest.json";
    document.head.appendChild(link);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#18342f";
    document.head.appendChild(meta);
  }
}

function getCurrentPage() {
  const path = decodeURIComponent(window.location.pathname.split("/").pop() || "");
  return path && path.endsWith(".html") ? path : "index.html";
}

function getHomePageForUser(user) {
  if (!user) return "index.html";
  return ["pastor", "bispo", "adm"].includes(user.roleId) ? "dashboard.html" : "visitas.html";
}

function normalizeEmail(value) {
  const raw = String(value || "").trim().toLowerCase();
  const parts = raw.split("@");
  if (parts.length !== 2) return raw;
  let [local, domain] = parts;
  local = local.split("+")[0];
  if (domain === "gmail.com" || domain === "googlemail.com") {
    local = local.replaceAll(".", "");
    domain = "gmail.com";
  }
  return `${local}@${domain}`;
}

function isValidEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(String(value || "").trim());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fallbackHash(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return `fallback:${hash}`;
}

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(password);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return fallbackHash(password);
}

function formatDateLocal(date = new Date()) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function formatMonthLocal(date = new Date()) {
  return formatDateLocal(date).slice(0, 7);
}

function formatDate(value) {
  if (!value) return "";
  const [datePart, timePart] = String(value).split("T");
  const [year, month, day] = datePart.split("-");
  const time = timePart ? ` às ${timePart}` : "";
  return `${day}/${month}/${year}${time}`;
}

function addWeeks(dateValue, weeks) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() + weeks * 7);
  return date.toISOString().slice(0, 10);
}

function getInitials(name) {
  return String(name || "U")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function isAdmin() {
  return ["adm", "bispo", "pastor"].includes(currentUser?.roleId);
}

function canManageRoles() {
  return ["adm", "bispo", "pastor"].includes(currentUser?.roleId);
}

function hasGlobalScope() {
  return ["adm", "bispo"].includes(currentUser?.roleId);
}

function canManageZaqueu() {
  return ["lideranca", "pastor", "bispo", "adm"].includes(currentUser?.roleId);
}

function canViewAllVisits() {
  return ["lideranca", "pastor", "bispo", "adm"].includes(currentUser?.roleId);
}

function getVisibleVisits() {
  if (!currentUser) return [];
  if (hasGlobalScope()) return appState.visits;
  if (currentUser.roleId === "pastor" || currentUser.roleId === "lideranca") {
    return appState.visits.filter((visit) => visit.churchId === currentUser.churchId);
  }
  return appState.visits.filter((visit) => visit.visitorId === currentUser.id);
}

function getVisibleZaqueus() {
  if (!currentUser) return [];
  if (hasGlobalScope()) return appState.zaqueus;
  return appState.zaqueus.filter((z) => !z.churchId || z.churchId === currentUser.churchId);
}

function getVisibleNotifications() {
  return appState.notifications || [];
}

function setAuthMessage(message, tone = "info") {
  const target = document.querySelector("#auth-message");
  if (!target) return;
  target.textContent = message;
  target.dataset.tone = tone;
}

function showAuthMode(mode) {
  const isRegister = mode === "register";
  document.querySelector("#login-form")?.classList.toggle("active", !isRegister);
  document.querySelector("#register-form")?.classList.toggle("active", isRegister);
  document.querySelector("#show-login")?.classList.toggle("active", !isRegister);
  document.querySelector("#show-register")?.classList.toggle("active", isRegister);
  setAuthMessage("");
}

function authenticateAs(user) {
  currentUser = user;
  localStorage.setItem(SESSION_KEY, user.id);
  window.location.href = getHomePageForUser(user);
}

function logout() {
  currentUser = null;
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

function injectSharedShell() {
  const shell = document.querySelector("#app-shell") || document.querySelector(".app-shell");
  const main = document.querySelector("#main-content") || document.querySelector(".main");
  if (!shell || !main || !currentUser) return;

  shell.querySelectorAll(".sidebar").forEach((el) => el.remove());
  main.querySelectorAll(".topbar").forEach((el) => el.remove());
  document.querySelectorAll(".adm-chat, #adm-drawer-toggle").forEach((el) => el.remove());

  const currentPage = getCurrentPage();
  const pageTitle = document.querySelector("main h2")?.textContent.trim() || "APPIGREJA";

  const navLinksHtml = NAV_ITEMS
    .filter((item) => item.roles.includes(currentUser.roleId))
    .map((item) => {
      const active = item.href === currentPage ? "active" : "";
      return `
        <a class="nav-item ${active}" href="${item.href}">
          <span class="icon" aria-hidden="true">${item.icon}</span>
          ${escapeHtml(item.label)}
        </a>
      `;
    })
    .join("");

  const sidebarHtml = `
    <aside class="sidebar" aria-label="Navegação principal">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">AI</div>
        <div>
          <strong>APPIGREJA</strong>
          <span>Cuidado e Zaqueus</span>
        </div>
      </div>
      <nav class="nav-list">${navLinksHtml}</nav>
      <div class="profile-card">
        <span class="avatar" id="profile-avatar" aria-hidden="true">${escapeHtml(getInitials(currentUser.name))}</span>
        <div>
          <strong id="profile-name">${escapeHtml(currentUser.name)}</strong>
          <span id="profile-role">${escapeHtml((ROLE_LABELS[currentUser.roleId] || currentUser.role) + " - " + currentUser.church)}</span>
        </div>
        <button class="profile-logout" type="button" id="logout-button">Sair</button>
      </div>
    </aside>
  `;

  const promoteSelfBtn =
    currentUser.roleId !== "adm"
      ? `<button class="secondary-button" type="button" id="promote-self-adm" title="Ativar perfil ADM para testar na faculdade">Virar ADM (Teste)</button>`
      : `<a class="secondary-button" href="dashboard.html#gestao-cargos">Gerenciar Cargos (${appState.users.length})</a>`;

  const topbarHtml = `
    <header class="topbar">
      <div>
        <p class="eyebrow">Perfil: ${escapeHtml(ROLE_LABELS[currentUser.roleId])} | ${escapeHtml(currentUser.church)} (${escapeHtml(currentUser.pastor)})</p>
        <h1 id="screen-title">${escapeHtml(pageTitle)}</h1>
      </div>
      <div class="topbar-actions">
        ${promoteSelfBtn}
        <label class="search">
          <span aria-hidden="true">B</span>
          <input id="global-search" type="search" placeholder="Buscar visitante ou visitado" />
        </label>
        <a class="ghost-button" href="nova-visita.html">Nova visita</a>
      </div>
    </header>
  `;

  shell.insertAdjacentHTML("afterbegin", sidebarHtml);
  main.insertAdjacentHTML("afterbegin", topbarHtml);

  // 1. PAINEL DE PESSOAS REGISTRADAS, CARGOS E BOTÃO DE ZERAR BANCO NO DASHBOARD E VISÃO GERAL
  const dashboardScreen = document.querySelector("#dashboard") || document.querySelector("#visao");
  if (dashboardScreen && canManageRoles() && !document.querySelector("#gestao-cargos")) {
    const heading = dashboardScreen.querySelector(".section-heading");
    const usersPanelHtml = `
      <section class="panel wide inline-admin-panel" id="gestao-cargos">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Administração de Acessos e Hierarquia</p>
            <h3>Pessoas Registradas no Sistema (<span id="registered-users-count">0</span>)</h3>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <span class="status-pill" id="role-save-feedback">Altere o cargo, igreja ou exclua abaixo</span>
            <button class="secondary-button danger-btn" type="button" id="reset-db-btn">Zerar Tudo (Limpar Banco)</button>
          </div>
        </div>

        <div class="visit-list" id="page-users-list" style="margin-top: 12px; margin-bottom: 18px;"></div>

        <details style="border-top: 1px solid var(--line); padding-top: 14px;">
          <summary style="cursor: pointer; font-weight: 800; color: var(--green-dark);">+ Cadastrar Nova Pessoa e Definir Cargo Diretamente</summary>
          <form class="stack-form" id="admin-add-user-form" style="margin-top: 12px;">
            <div class="form-grid">
              <label>
                Nome completo
                <input name="name" type="text" placeholder="Nome do obreiro, líder ou pastor" required />
              </label>
              <label>
                E-mail único
                <input name="login" type="email" placeholder="email@exemplo.com" required />
              </label>
              <label>
                Senha inicial
                <input name="password" type="password" minlength="4" placeholder="Mínimo 4 dígitos" required />
              </label>
              <label>
                Igreja vinculada
                <select name="churchId" required>
                  <option value="sede">Igreja Sede (Bispo Wagner)</option>
                  <option value="campineiro">Igreja Campineiro (Pastora Lindamir)</option>
                  <option value="mogi">Igreja Mogi Guaçu (Pastor Paulo)</option>
                </select>
              </label>
              <label>
                Cargo / Nível de Hierarquia
                <select name="roleId" required>
                  <option value="obreiro">Obreiro</option>
                  <option value="lideranca">Liderança</option>
                  <option value="pastor">Pastor</option>
                  <option value="bispo">Bispo</option>
                  <option value="adm">ADM</option>
                </select>
              </label>
            </div>
            <div class="form-actions">
              <span id="admin-add-user-msg" style="font-weight: 700; color: var(--green);"></span>
              <button class="primary-button" type="submit">Cadastrar Pessoa com Cargo</button>
            </div>
          </form>
        </details>
      </section>
    `;
    if (heading) {
      heading.insertAdjacentHTML("afterend", usersPanelHtml);
    } else {
      dashboardScreen.insertAdjacentHTML("afterbegin", usersPanelHtml);
    }
  }

  // 2. FORMULÁRIO DE NOTIFICAÇÕES DIRETO EM notificacoes.html
  const notifScreen = document.querySelector("#notificacoes");
  if (notifScreen && isAdmin() && !document.querySelector("#inline-notification-form-panel")) {
    const heading = notifScreen.querySelector(".section-heading");
    const notifFormHtml = `
      <section class="panel wide inline-admin-panel" id="inline-notification-form-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Publicar no Mural para Todos</p>
            <h3>Nova Notificação</h3>
          </div>
        </div>
        <form class="stack-form" id="notification-form" style="margin-top: 12px;">
          <div class="form-grid">
            <label>
              Título / Assunto
              <input name="title" type="text" placeholder="Ex: Reunião Geral de Obreiros" required />
            </label>
            <label>
              Destaque de Público (Visível no mural para todos)
              <select name="audience">
                <option value="todos">Todos os usuários</option>
                <option value="obreiro">Obreiros</option>
                <option value="lideranca">Liderança</option>
                <option value="pastor">Pastores e Bispo</option>
                <option value="adm">Administração</option>
              </select>
            </label>
          </div>
          <label>
            Mensagem do Aviso
            <textarea name="message" rows="3" placeholder="Digite o comunicado que aparecerá para todos no aplicativo..." required></textarea>
          </label>
          <div class="form-actions">
            <span id="notif-feedback" style="font-weight: 700; color: var(--green);"></span>
            <button class="primary-button" type="submit">Publicar Notificação</button>
          </div>
        </form>
      </section>
    `;
    if (heading) {
      heading.insertAdjacentHTML("afterend", notifFormHtml);
    } else {
      notifScreen.insertAdjacentHTML("afterbegin", notifFormHtml);
    }
  }

  // 3. FORMULÁRIO DE EVENTOS DIRETO EM calendario.html
  const calScreen = document.querySelector("#calendario");
  if (calScreen && isAdmin() && !document.querySelector("#inline-calendar-form-panel")) {
    const heading = calScreen.querySelector(".section-heading");
    const calFormHtml = `
      <section class="panel wide inline-admin-panel" id="inline-calendar-form-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Programação Oficial (Visível para Todos)</p>
            <h3>Cadastrar Novo Evento no Calendário</h3>
          </div>
        </div>
        <form class="stack-form" id="calendar-form" style="margin-top: 12px;">
          <div class="form-grid">
            <label>
              Nome do Culto ou Evento
              <input name="title" type="text" placeholder="Ex: Santa Ceia / Culto de Ensino" required />
            </label>
            <label>
              Igreja Realizadora
              <select name="church">
                <option value="Todas as Igrejas">Todas as Igrejas</option>
                <option value="Igreja Sede (Bispo Wagner)">Igreja Sede (Bispo Wagner)</option>
                <option value="Igreja Campineiro (Pastora Lindamir)">Igreja Campineiro (Pastora Lindamir)</option>
                <option value="Igreja Mogi Guaçu (Pastor Paulo)">Igreja Mogi Guaçu (Pastor Paulo)</option>
              </select>
            </label>
            <label>
              Data do Evento
              <input name="date" type="date" value="${formatDateLocal()}" required />
            </label>
            <label>
              Horário
              <input name="time" type="time" value="19:30" required />
            </label>
          </div>
          <label>
            Descrição / Observações
            <input name="description" type="text" placeholder="Detalhes da programação para os membros..." />
          </label>
          <div class="form-actions">
            <span id="cal-feedback" style="font-weight: 700; color: var(--green);"></span>
            <button class="primary-button" type="submit">Salvar Evento no Calendário</button>
          </div>
        </form>
      </section>
    `;
    if (heading) {
      heading.insertAdjacentHTML("afterend", calFormHtml);
    } else {
      calScreen.insertAdjacentHTML("afterbegin", calFormHtml);
    }
  }

  // 4. FORMULÁRIO DE BIBLIOTECA DIRETO EM biblioteca.html
  const libScreen = document.querySelector("#biblioteca");
  if (libScreen && isAdmin() && !document.querySelector("#inline-library-form-panel")) {
    const heading = libScreen.querySelector(".section-heading");
    const libFormHtml = `
      <section class="panel wide inline-admin-panel" id="inline-library-form-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Publicar Material para Todos</p>
            <h3>Adicionar Devocional, PDF, Foto ou Link</h3>
          </div>
        </div>
        <form class="stack-form" id="library-form" style="margin-top: 12px;">
          <div class="form-grid">
            <label>
              Categoria
              <select name="category">
                <option value="devocional">Devocional</option>
                <option value="direcionamento">Direcionamento</option>
                <option value="link">Link de referência</option>
              </select>
            </label>
            <label>
              Título do Material
              <input name="title" type="text" placeholder="Nome do estudo ou devocional" required />
            </label>
            <label>
              Arquivo PDF ou Foto (Opcional)
              <input name="file" type="file" accept=".pdf,image/*" />
            </label>
            <label>
              Link Externo (Opcional)
              <input name="link" type="url" placeholder="https://..." />
            </label>
          </div>
          <label>
            Descrição
            <textarea name="description" rows="2" placeholder="Resumo do conteúdo para os obreiros e liderança"></textarea>
          </label>
          <div class="form-actions">
            <span id="lib-feedback" style="font-weight: 700; color: var(--green);"></span>
            <button class="primary-button" type="submit">Publicar na Biblioteca</button>
          </div>
        </form>
      </section>
    `;
    if (heading) {
      heading.insertAdjacentHTML("afterend", libFormHtml);
    } else {
      libScreen.insertAdjacentHTML("afterbegin", libFormHtml);
    }
  }
}

function buildUserRoleCardHtml(u) {
  const isSelf = u.id === currentUser?.id;
  return `
    <div class="user-role-row">
      <div>
        <strong style="font-size: 16px;">${escapeHtml(u.name)} ${isSelf ? "(Sua Conta)" : ""}</strong>
        <small style="display:block; color: var(--muted);">E-mail único: ${escapeHtml(u.login)}</small>
      </div>
      <label style="font-size: 12px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Cargo / Hierarquia
        <select class="user-role-select" data-user-id="${escapeHtml(u.id)}">
          ${Object.entries(ROLE_LABELS)
            .map(([roleKey, label]) => `<option value="${roleKey}" ${u.roleId === roleKey ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>
      <label style="font-size: 12px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Igreja Vinculada
        <select class="user-church-select" data-user-id="${escapeHtml(u.id)}">
          ${Object.entries(CHURCHES)
            .map(([chKey, chObj]) => `<option value="${chKey}" ${u.churchId === chKey ? "selected" : ""}>${chObj.name} (${chObj.pastor})</option>`)
            .join("")}
        </select>
      </label>
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span class="tag">${escapeHtml(ROLE_LABELS[u.roleId] || u.role)}</span>
        <button class="secondary-button danger-btn delete-user-btn" type="button" data-user-id="${escapeHtml(u.id)}">
          Excluir
        </button>
      </div>
    </div>
  `;
}

function wireUserRoleSelects(rootElement) {
  if (!rootElement) return;

  rootElement.querySelectorAll(".user-role-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const targetUser = appState.users.find((u) => u.id === select.dataset.userId);
      if (!targetUser) return;
      targetUser.roleId = select.value;
      targetUser.role = ROLE_LABELS[select.value] || "Obreiro";
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Cargo de ${targetUser.name} salvo como ${targetUser.role}!`;
      if (targetUser.id === currentUser.id) {
        window.location.reload();
      } else {
        renderAll();
      }
    });
  });

  rootElement.querySelectorAll(".user-church-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const targetUser = appState.users.find((u) => u.id === select.dataset.userId);
      if (!targetUser) return;
      const ch = CHURCHES[select.value] || CHURCHES.sede;
      targetUser.churchId = select.value;
      targetUser.church = ch.name;
      targetUser.pastor = ch.pastor;
      targetUser.pastorId = ch.pastorId;
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Igreja de ${targetUser.name} alterada para ${ch.name}!`;
      if (targetUser.id === currentUser.id) {
        window.location.reload();
      } else {
        renderAll();
      }
    });
  });

  rootElement.querySelectorAll(".delete-user-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.dataset.userId;
      const targetUser = appState.users.find((u) => u.id === userId);
      if (!targetUser) return;
      if (!confirm(`Tem certeza que deseja excluir o cadastro de "${targetUser.name}" (${targetUser.login})?`)) {
        return;
      }

      appState.users = appState.users.filter((u) => u.id !== userId);
      await saveAppState();

      if (userId === currentUser?.id) {
        logout();
      } else {
        renderAll();
      }
    });
  });
}

function renderUsersRoleManager() {
  const countBadge = document.querySelector("#registered-users-count");
  if (countBadge) countBadge.textContent = String(appState.users.length);

  const pageContainer = document.querySelector("#page-users-list");
  if (!pageContainer) return;

  if (!appState.users.length) {
    pageContainer.innerHTML = emptyCard("Nenhuma pessoa registrada ainda.");
    return;
  }

  pageContainer.innerHTML = appState.users.map(buildUserRoleCardHtml).join("");
  wireUserRoleSelects(pageContainer);
}

function renderVisitUserFields() {
  if (!currentUser) return;
  const fields = {
    "#visit-worker-id": currentUser.id,
    "#visit-church-id": currentUser.churchId,
    "#visit-role-id": currentUser.roleId,
    "#visit-worker-name": currentUser.name,
    "#visit-church-name": `${currentUser.church} (${currentUser.pastor})`,
  };
  Object.entries(fields).forEach(([selector, value]) => {
    const input = document.querySelector(selector);
    if (input) input.value = value || "";
  });
}

function renderWorkerFilter() {
  const select = document.querySelector("#worker-filter");
  if (!select || !currentUser) return;

  let users = [];
  if (hasGlobalScope()) {
    users = [...appState.users];
  } else if (canViewAllVisits()) {
    users = appState.users.filter((u) => u.churchId === currentUser.churchId);
  } else {
    users = [currentUser];
  }
  users.sort((a, b) => a.name.localeCompare(b.name));

  const currentVal = select.value || "todos";
  select.innerHTML = [
    `<option value="todos">${canViewAllVisits() ? "Todos os obreiros" : "Minhas visitas"}</option>`,
    ...users.map((user) => `<option value="${escapeHtml(user.id)}">${escapeHtml(user.name)}</option>`),
  ].join("");
  if ([...select.options].some((o) => o.value === currentVal)) {
    select.value = currentVal;
  }

  const churchFilter = document.querySelector("#church-filter");
  if (churchFilter && !hasGlobalScope() && currentUser.churchId) {
    churchFilter.value = currentUser.churchId;
    churchFilter.disabled = true;
  }
}

function setAutomaticVisitDate() {
  const input = document.querySelector("#visit-date");
  if (input && !input.value) input.value = formatDateLocal();
}

function emptyCard(message) {
  return `<article class="notification-item empty-card"><p>${escapeHtml(message)}</p></article>`;
}

function visitCard(visit) {
  const canDelete = isAdmin() || visit.visitorId === currentUser?.id;
  return `
    <article class="visit-item" data-church="${escapeHtml(visit.churchId)}" data-worker="${escapeHtml(visit.visitorId)}" data-pastor="${escapeHtml(visit.pastorId)}">
      <div>
        <div class="tag-row">
          <span class="tag">${escapeHtml(visit.church)}</span>
          <span class="tag">${escapeHtml(visit.pastor)}</span>
        </div>
        <h3>${escapeHtml(visit.visited)}</h3>
        <p>${escapeHtml(visit.summary)}</p>
        <div class="meta-row">
          <span>${escapeHtml(formatDate(visit.date))}</span>
          <span>Visitante: ${escapeHtml(visit.visitor)}</span>
        </div>
      </div>
      <div class="tag-row">
        <span class="status-pill">${getCloudEndpoint() ? "Sincronizado" : "Salvo"}</span>
        ${
          canDelete
            ? `<button class="secondary-button danger-btn delete-visit-btn" type="button" data-visit-id="${escapeHtml(visit.id)}">Excluir</button>`
            : ""
        }
      </div>
    </article>
  `;
}

function wireVisitDeleteButtons() {
  document.querySelectorAll(".delete-visit-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const visitId = btn.dataset.visitId;
      if (!confirm("Deseja realmente excluir este registro de visita?")) return;
      appState.visits = appState.visits.filter((v) => v.id !== visitId);
      await saveAppState();
      renderAll();
    });
  });
}

function renderVisits() {
  const urlQuery = new URLSearchParams(window.location.search).get("q") || "";
  const searchInput = document.querySelector("#visit-search");
  if (searchInput && urlQuery && !searchInput.value) {
    searchInput.value = urlQuery;
  }

  const search = (searchInput?.value || document.querySelector("#global-search")?.value || "").toLowerCase();
  const church = document.querySelector("#church-filter")?.value || "todos";
  const worker = document.querySelector("#worker-filter")?.value || "todos";
  const pastor = document.querySelector("#pastor-filter")?.value || "todos";

  const visibleVisits = getVisibleVisits();
  const filtered = visibleVisits.filter((visit) => {
    const names = `${visit.visited} ${visit.visitor}`.toLowerCase();
    const matchesSearch = !search || names.includes(search);
    const matchesChurch = church === "todos" || visit.churchId === church;
    const matchesWorker = worker === "todos" || visit.visitorId === worker;
    const matchesPastor = pastor === "todos" || visit.pastorId === pastor;
    return matchesSearch && matchesChurch && matchesWorker && matchesPastor;
  });

  const results = document.querySelector("#visit-results");
  if (results) {
    const message = canViewAllVisits()
      ? "Nenhuma visita encontrada para este filtro."
      : "Nenhuma visita registrada por você ainda.";
    results.innerHTML = filtered.map(visitCard).join("") || emptyCard(message);
  }

  const dashboard = document.querySelector("#dashboard-visits");
  if (dashboard) {
    dashboard.innerHTML = visibleVisits.length
      ? visibleVisits.slice(0, 5).map(visitCard).join("")
      : emptyCard("O Dashboard começará a mostrar visitas assim que alguém registrar a primeira.");
  }

  wireVisitDeleteButtons();
  renderVisitMetrics();
}

function renderVisitMetrics() {
  const currentMonth = formatDateLocal().slice(0, 7);
  const visibleVisits = getVisibleVisits();
  const monthVisits = visibleVisits.filter((visit) => String(visit.date).slice(0, 7) === currentMonth);
  const myVisits = monthVisits.filter((visit) => visit.visitorId === currentUser?.id);
  const activeChurches = new Set(monthVisits.map((visit) => visit.churchId)).size;

  const metricMonthVisits = document.querySelector("#metric-month-visits");
  const metricMyVisits = document.querySelector("#metric-my-visits");
  const metricMyVisitsLabel = document.querySelector("#metric-my-visits-label");
  const metricActiveChurches = document.querySelector("#metric-active-churches");
  const overviewVisits = document.querySelector("#overview-visits");

  if (metricMonthVisits) metricMonthVisits.textContent = String(monthVisits.length);
  if (metricMyVisits) metricMyVisits.textContent = String(myVisits.length);
  if (metricMyVisitsLabel) metricMyVisitsLabel.textContent = currentUser?.name || "Usuário logado";
  if (metricActiveChurches) metricActiveChurches.textContent = String(activeChurches);
  if (overviewVisits) overviewVisits.textContent = String(monthVisits.length);
}

function renderChurchMonthChart() {
  const container = document.querySelector("#church-month-chart");
  if (!container) return;

  const grouped = MONTHS.map((month, index) => {
    const monthNumber = String(index + 1).padStart(2, "0");
    const visits = getVisibleVisits().filter((visit) => String(visit.date).slice(5, 7) === monthNumber);
    return {
      month,
      sede: visits.filter((visit) => visit.churchId === "sede").length,
      campineiro: visits.filter((visit) => visit.churchId === "campineiro").length,
      mogi: visits.filter((visit) => visit.churchId === "mogi").length,
    };
  });

  const maxValue = Math.max(1, ...grouped.flatMap((item) => [item.sede, item.campineiro, item.mogi]));

  container.innerHTML = grouped
    .map((item) => {
      const height = (value) => (value === 0 ? "0%" : `${Math.max(12, Math.round((value / maxValue) * 92))}%`);
      const zero = (value) => (value === 0 ? " zero" : "");
      return `
        <div class="month-group">
          <div class="bar-set">
            <span class="bar sede${zero(item.sede)}" style="height: ${height(item.sede)}" title="Igreja Sede (Bispo Wagner)"><b>${item.sede}</b></span>
            <span class="bar norte${zero(item.campineiro)}" style="height: ${height(item.campineiro)}" title="Igreja Campineiro (Pastora Lindamir)"><b>${item.campineiro}</b></span>
            <span class="bar leste${zero(item.mogi)}" style="height: ${height(item.mogi)}" title="Igreja Mogi Guaçu (Pastor Paulo)"><b>${item.mogi}</b></span>
          </div>
          <strong>${item.month}</strong>
        </div>
      `;
    })
    .join("");
}

function renderZaqueus() {
  const container = document.querySelector("#zaqueu-list");
  if (!container) return;

  const visibleZaqueus = getVisibleZaqueus();
  if (!visibleZaqueus.length) {
    container.innerHTML = emptyCard("Nenhum Zaqueu aberto ainda. Use Novo Zaqueu para começar.");
    renderOverview();
    return;
  }

  container.innerHTML = visibleZaqueus
    .map(
      (zaqueu) => `
        <article class="zaqueu-card">
          <div class="tag-row">
            <span class="tag">${escapeHtml(zaqueu.church || "Igreja Sede")}</span>
            <span class="status-pill">Semana ${escapeHtml(zaqueu.week)} de 5</span>
          </div>
          <h3>${escapeHtml(zaqueu.address)}</h3>
          <p>Início: ${escapeHtml(formatDate(zaqueu.start))} | Término automático: ${escapeHtml(formatDate(zaqueu.end))}</p>
          <p>${escapeHtml(zaqueu.weekday)} às ${escapeHtml(zaqueu.time)} | Anfitriões: ${escapeHtml(zaqueu.hosts)} | Líderes: ${escapeHtml(zaqueu.leaders)}</p>
          <div class="week-boxes">
            <label class="week-box">
              <span>Visitas antes do culto</span>
              <input class="zaqueu-input" data-id="${escapeHtml(zaqueu.id)}" data-field="weekVisits" type="number" min="0" value="${escapeHtml(zaqueu.weekVisits)}" />
            </label>
            <label class="week-box">
              <span>Visitantes por culto</span>
              <input class="zaqueu-input" data-id="${escapeHtml(zaqueu.id)}" data-field="weekVisitors" type="number" min="0" value="${escapeHtml(zaqueu.weekVisitors)}" />
            </label>
            <label class="week-box">
              <span>Frequentando semanalmente</span>
              <input class="zaqueu-input" data-id="${escapeHtml(zaqueu.id)}" data-field="weeklyPeople" type="number" min="0" value="${escapeHtml(zaqueu.weeklyPeople)}" />
            </label>
          </div>
          <div class="zaqueu-actions">
            <button class="secondary-button update-week" type="button" data-id="${escapeHtml(zaqueu.id)}">Avançar para próxima semana</button>
            ${
              canManageZaqueu()
                ? `<button class="secondary-button danger-btn delete-zaqueu-btn" type="button" data-id="${escapeHtml(zaqueu.id)}">Excluir Zaqueu</button>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".zaqueu-input").forEach((input) => {
    input.addEventListener("change", async () => {
      const item = appState.zaqueus.find((zaqueu) => zaqueu.id === input.dataset.id);
      if (item) {
        item[input.dataset.field] = Number(input.value || 0);
        item.history = item.history || {};
        item.history[item.week] = {
          weekVisits: Number(item.weekVisits || 0),
          weekVisitors: Number(item.weekVisitors || 0),
          weeklyPeople: Number(item.weeklyPeople || 0),
        };
      }
      await saveAppState();
      renderOverview();
    });
  });

  document.querySelectorAll(".update-week").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = appState.zaqueus.find((zaqueu) => zaqueu.id === button.dataset.id);
      if (!item) return;
      item.history = item.history || {};
      item.history[item.week] = {
        weekVisits: Number(item.weekVisits || 0),
        weekVisitors: Number(item.weekVisitors || 0),
        weeklyPeople: Number(item.weeklyPeople || 0),
      };
      if (item.week < 5) {
        item.week = Number(item.week || 1) + 1;
        const nextSaved = item.history[item.week] || {};
        item.weekVisits = nextSaved.weekVisits ?? 0;
        item.weekVisitors = nextSaved.weekVisitors ?? 0;
        item.weeklyPeople = nextSaved.weeklyPeople ?? item.weeklyPeople ?? 0;
      }
      await saveAppState();
      renderZaqueus();
      renderOverview();
    });
  });

  document.querySelectorAll(".delete-zaqueu-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const zaqueuId = button.dataset.id;
      if (!confirm("Deseja realmente excluir este Zaqueu?")) return;
      appState.zaqueus = appState.zaqueus.filter((z) => z.id !== zaqueuId);
      await saveAppState();
      renderZaqueus();
      renderOverview();
    });
  });
}

function renderOverview() {
  const visibleZaqueus = getVisibleZaqueus();
  const visitTotal = visibleZaqueus.reduce((sum, item) => sum + Number(item.weekVisits || 0), 0);
  const visitorTotal = visibleZaqueus.reduce((sum, item) => sum + Number(item.weekVisitors || 0), 0);
  const weeklyPeople = visibleZaqueus.reduce((sum, item) => sum + Number(item.weeklyPeople || 0), 0);

  const updates = {
    "#metric-zaqueu-visits": visitTotal,
    "#overview-zaqueu-visits": visitTotal,
    "#overview-cult-visitors": visitorTotal,
    "#overview-weekly-people": weeklyPeople,
  };

  Object.entries(updates).forEach(([selector, value]) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = String(value);
  });

  renderZaqueuWeekChart(visibleZaqueus);
  renderOverviewRank();
}

function renderZaqueuWeekChart(visibleZaqueus) {
  const chart = document.querySelector("#zaqueu-week-chart") || document.querySelector(".chart");
  if (!chart) return;

  const totalsByWeek = [1, 2, 3, 4, 5].map((weekNum) => {
    return visibleZaqueus.reduce((sum, z) => {
      if (Number(z.week) === weekNum) {
        return sum + Number(z.weeklyPeople || 0) + Number(z.weekVisitors || 0);
      }
      const hist = z.history?.[weekNum];
      return sum + (hist ? Number(hist.weeklyPeople || 0) + Number(hist.weekVisitors || 0) : 0);
    }, 0);
  });

  const maxVal = Math.max(1, ...totalsByWeek);
  chart.innerHTML = totalsByWeek
    .map((val) => {
      const pct = val === 0 ? 0 : Math.max(14, Math.round((val / maxVal) * 95));
      return `<span style="height: ${pct}%"><b>${val}</b></span>`;
    })
    .join("");
}

function renderOverviewRank() {
  const container = document.querySelector("#overview-rank");
  if (!container) return;
  const visibleVisits = getVisibleVisits();

  const byChurch = Object.entries(CHURCHES).map(([key, church]) => {
    const count = visibleVisits.filter((visit) => visit.churchId === key || visit.church === church.name).length;
    return `<div><strong>${escapeHtml(church.name)} (${escapeHtml(church.pastor)})</strong><span>${count} visitas</span></div>`;
  });
  const bishops = appState.users.filter((u) => u.roleId === "bispo").length;
  const pastors = appState.users.filter((u) => u.roleId === "pastor").length;
  const leaders = appState.users.filter((u) => u.roleId === "lideranca").length;
  const workers = appState.users.filter((u) => u.roleId === "obreiro").length;

  container.innerHTML = [
    ...byChurch,
    `<div><strong>Bispos cadastrados</strong><span>${bishops}</span></div>`,
    `<div><strong>Pastores cadastrados</strong><span>${pastors}</span></div>`,
    `<div><strong>Liderança cadastrada</strong><span>${leaders}</span></div>`,
    `<div><strong>Obreiros cadastrados</strong><span>${workers}</span></div>`,
  ].join("");
}

function renderMaterials(filter = "todos") {
  const container = document.querySelector("#zaqueu-materials");
  if (!container) return;
  const items = appState.zaqueuMaterials.filter((item) => filter === "todos" || item.type === filter);
  if (!items.length) {
    container.innerHTML = emptyCard("Nenhum material do Zaqueu adicionado ainda.");
    return;
  }
  container.innerHTML = items
    .map(
      (item, idx) => `
        <article class="content-card" data-type="${escapeHtml(item.type)}">
          <div class="content-art" aria-hidden="true">${item.type === "pdf" ? "PDF" : "FOTO"}</div>
          <div>
            <span class="tag">${item.type === "pdf" ? "PDF" : "Foto"}</span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <p>${escapeHtml(item.description)}</p>
          <div class="content-actions">
            ${
              item.dataUrl
                ? `<a class="secondary-button" href="${item.dataUrl}" download="${escapeHtml(item.title)}" target="_blank">Abrir / Baixar</a>`
                : `<button class="secondary-button" type="button" disabled>Arquivo salvo</button>`
            }
            ${
              isAdmin()
                ? `<button class="secondary-button danger-btn delete-material-btn" type="button" data-idx="${idx}">Excluir</button>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  container.querySelectorAll(".delete-material-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const idx = Number(btn.dataset.idx);
      if (!confirm("Excluir este material do Zaqueu?")) return;
      appState.zaqueuMaterials.splice(idx, 1);
      await saveAppState();
      renderMaterials(document.querySelector("#zaqueu-material-filter")?.value || "todos");
    });
  });
}

function renderLibrary(category = "todos") {
  const container = document.querySelector("#library-grid");
  if (!container) return;
  const items = appState.libraryItems.filter((item) => category === "todos" || item.category === category);
  if (!items.length) {
    container.innerHTML = emptyCard("A biblioteca ainda está vazia. Use o formulário acima para publicar materiais.");
    return;
  }
  container.innerHTML = items
    .map(
      (item) => `
        <article class="content-card">
          <div class="content-art" aria-hidden="true">${escapeHtml(item.kind)}</div>
          <div>
            <span class="tag">${escapeHtml(item.category)}</span>
            <h3>${escapeHtml(item.title)}</h3>
          </div>
          <p>${escapeHtml(item.description || "Conteúdo liberado pela administração.")}</p>
          ${item.link ? `<small>Link: ${escapeHtml(item.link)}</small>` : `<small>${escapeHtml(item.fileName || "Publicação interna")}</small>`}
          <div class="content-actions">
            ${
              item.link
                ? `<a class="secondary-button" href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer">Abrir link</a>`
                : item.dataUrl
                  ? `<a class="secondary-button" href="${item.dataUrl}" download="${escapeHtml(item.fileName || item.title)}" target="_blank">Baixar arquivo</a>`
                  : `<span class="tag">Disponível</span>`
            }
            ${
              isAdmin()
                ? `<button class="secondary-button danger-btn delete-lib-btn" type="button" data-id="${escapeHtml(item.id)}">Excluir</button>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");

  container.querySelectorAll(".delete-lib-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Excluir este item da biblioteca?")) return;
      appState.libraryItems = appState.libraryItems.filter((i) => i.id !== id);
      await saveAppState();
      renderLibrary(category);
    });
  });
}

function renderNotifications() {
  const container = document.querySelector("#notification-list");
  if (!container) return;
  const visible = getVisibleNotifications();
  if (!visible.length) {
    container.innerHTML = emptyCard("Nenhuma notificação publicada ainda.");
    return;
  }
  container.innerHTML = visible
    .map(
      (notification) => `
        <article class="notification-item">
          <div class="tag-row" style="justify-content: space-between;">
            <div class="tag-row">
              <span class="tag">Público: ${escapeHtml(notification.audience || "Todos os usuários")}</span>
              <span class="status-pill">${escapeHtml(notification.date)}</span>
            </div>
            ${
              isAdmin()
                ? `<button class="secondary-button danger-btn delete-notif-btn" type="button" data-id="${escapeHtml(notification.id)}">Excluir</button>`
                : ""
            }
          </div>
          <h3>${escapeHtml(notification.title)}</h3>
          <p>${escapeHtml(notification.message)}</p>
        </article>
      `
    )
    .join("");

  container.querySelectorAll(".delete-notif-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Excluir esta notificação?")) return;
      appState.notifications = appState.notifications.filter((n) => n.id !== id);
      await saveAppState();
      renderNotifications();
    });
  });
}

function renderCalendar() {
  const monthInput = document.querySelector("#calendar-month");
  const board = document.querySelector("#calendar-board");
  const list = document.querySelector("#calendar-event-list");
  if (!monthInput || !board || !list) return;

  if (!monthInput.value) monthInput.value = formatMonthLocal();

  const [year, month] = monthInput.value.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = firstDay.getDay();

  const allEvents = [...(appState.calendarEvents || [])].sort((a, b) =>
    String(a.date || "").localeCompare(String(b.date || ""))
  );
  const monthEvents = allEvents.filter((event) => String(event.date || "").slice(0, 7) === monthInput.value);

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const cells = weekdays.map((day) => `<div class="calendar-weekday">${day}</div>`);

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(`<div class="calendar-day empty" aria-hidden="true"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthInput.value}-${String(day).padStart(2, "0")}`;
    const dayEvents = monthEvents.filter((event) => event.date === date);
    cells.push(`
      <div class="calendar-day">
        <strong>${day}</strong>
        ${dayEvents
          .map((event) => `<span class="calendar-dot" title="${escapeHtml(event.title)}">${escapeHtml(event.title || "Evento")}</span>`)
          .join("")}
      </div>
    `);
  }

  board.innerHTML = cells.join("");

  const eventsToDisplay = monthEvents.length ? monthEvents : allEvents;
  list.innerHTML = eventsToDisplay.length
    ? eventsToDisplay
        .map(
          (event) => `
            <article class="calendar-event">
              <div class="tag-row" style="justify-content: space-between;">
                <div class="tag-row">
                  <span class="tag">${escapeHtml(formatDate(event.date))}</span>
                  <span class="tag">${escapeHtml(event.church || "Igreja Sede")}</span>
                </div>
                ${
                  isAdmin()
                    ? `<button class="secondary-button danger-btn delete-cal-btn" type="button" data-id="${escapeHtml(event.id)}">Excluir</button>`
                    : ""
                }
              </div>
              <strong>${escapeHtml(event.title || "Evento")}</strong>
              <p>${escapeHtml(event.description || "Programação oficial da igreja.")}</p>
              ${event.time ? `<small>Horário: ${escapeHtml(event.time)}</small>` : ""}
            </article>
          `
        )
        .join("")
    : emptyCard("Nenhum evento cadastrado ainda. Use o formulário acima para adicionar eventos.");

  list.querySelectorAll(".delete-cal-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!confirm("Excluir este evento do calendário?")) return;
      appState.calendarEvents = appState.calendarEvents.filter((ev) => ev.id !== id);
      await saveAppState();
      renderCalendar();
    });
  });
}

function updateZaqueuEndDate() {
  const startInput = document.querySelector("#zaqueu-start");
  const endInput = document.querySelector("#zaqueu-end");
  if (!startInput || !endInput) return;
  if (!startInput.value) startInput.value = formatDateLocal();
  endInput.value = addWeeks(startInput.value, 5);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || !file.size || file.size > 1500000) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function renderAll() {
  renderUsersRoleManager();
  renderWorkerFilter();
  renderVisitUserFields();
  setAutomaticVisitDate();
  updateZaqueuEndDate();
  renderVisits();
  renderChurchMonthChart();
  renderZaqueus();
  renderOverview();
  renderMaterials(document.querySelector("#zaqueu-material-filter")?.value || "todos");
  renderLibrary(document.querySelector("[data-library-category].active")?.dataset.libraryCategory || "todos");
  renderCalendar();
  renderNotifications();
}

function wireAuth() {
  document.querySelector("#show-login")?.addEventListener("click", () => showAuthMode("login"));
  document.querySelector("#show-register")?.addEventListener("click", () => showAuthMode("register"));

  document.querySelector("#register-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const rawEmail = String(form.get("login") || "").trim();

    if (!isValidEmail(rawEmail)) {
      setAuthMessage("Informe um endereço de e-mail válido (ex: nome@dominio.com).", "error");
      return;
    }

    await syncFromCloud();

    const loginKey = normalizeEmail(rawEmail);
    if (appState.users.some((user) => normalizeEmail(user.loginKey || user.login) === loginKey)) {
      setAuthMessage("Trava de segurança: este e-mail já possui um cadastro ativo no sistema.", "error");
      return;
    }

    const churchId = normalizeChurchId(form.get("churchId"));
    const church = CHURCHES[churchId] || CHURCHES.sede;
    const hasAnyAdmin = appState.users.some((u) => u.roleId === "adm");
    const roleId = form.get("roleId") || (hasAnyAdmin ? "obreiro" : "adm");

    const user = {
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(String(form.get("password"))),
      roleId,
      role: ROLE_LABELS[roleId] || "Obreiro",
      churchId,
      church: church.name,
      pastor: church.pastor,
      pastorId: church.pastorId,
      createdAt: new Date().toISOString(),
    };

    appState.users.push(user);
    await saveAppState();
    formElement.reset();
    authenticateAs(user);
  });

  document.querySelector("#login-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    await syncFromCloud();

    const loginKey = normalizeEmail(form.get("login"));
    const user = appState.users.find((item) => normalizeEmail(item.loginKey || item.login) === loginKey);
    if (!user) {
      setAuthMessage("E-mail não encontrado no sistema.", "error");
      return;
    }
    const passwordHash = await hashPassword(String(form.get("password")));
    if (passwordHash !== user.passwordHash) {
      setAuthMessage("Senha inválida para este e-mail.", "error");
      return;
    }
    formElement.reset();
    authenticateAs(user);
  });
}

function wireEvents() {
  document.querySelector("#logout-button")?.addEventListener("click", logout);
  document.querySelector("#reset-db-btn")?.addEventListener("click", resetEntireDatabase);

  document.querySelector("#promote-self-adm")?.addEventListener("click", async () => {
    if (!currentUser) return;
    currentUser.roleId = "adm";
    currentUser.role = ROLE_LABELS.adm;
    await saveAppState();
    window.location.href = "dashboard.html";
  });

  document.querySelector("#admin-add-user-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const rawEmail = String(form.get("login") || "").trim();
    const msgEl = document.querySelector("#admin-add-user-msg");

    if (!isValidEmail(rawEmail)) {
      if (msgEl) msgEl.textContent = "E-mail inválido.";
      return;
    }

    const loginKey = normalizeEmail(rawEmail);
    if (appState.users.some((u) => normalizeEmail(u.loginKey || u.login) === loginKey)) {
      if (msgEl) msgEl.textContent = "Este e-mail já está cadastrado!";
      return;
    }

    const churchId = normalizeChurchId(form.get("churchId"));
    const church = CHURCHES[churchId] || CHURCHES.sede;
    const roleId = form.get("roleId") || "obreiro";

    appState.users.push({
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(String(form.get("password"))),
      roleId,
      role: ROLE_LABELS[roleId] || "Obreiro",
      churchId,
      church: church.name,
      pastor: church.pastor,
      pastorId: church.pastorId,
      createdAt: new Date().toISOString(),
    });

    await saveAppState();
    formElement.reset();
    if (msgEl) msgEl.textContent = "Pessoa cadastrada e cargo atribuído com sucesso!";
    renderAll();
  });

  const globalSearch = document.querySelector("#global-search");
  globalSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && getCurrentPage() !== "visitas.html") {
      window.location.href = `visitas.html?q=${encodeURIComponent(globalSearch.value.trim())}`;
    }
  });

  ["#visit-search", "#global-search", "#church-filter", "#worker-filter", "#pastor-filter"].forEach((selector) => {
    document.querySelector(selector)?.addEventListener("input", renderVisits);
    document.querySelector(selector)?.addEventListener("change", renderVisits);
  });

  document.querySelector("#visit-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const form = new FormData(event.currentTarget);
    appState.visits.unshift({
      id: `vis_${Date.now()}`,
      visited: form.get("visited"),
      visitor: currentUser.name,
      visitorId: currentUser.id,
      church: currentUser.church,
      churchId: currentUser.churchId,
      pastor: currentUser.pastor,
      pastorId: currentUser.pastorId,
      date: form.get("date") || formatDateLocal(),
      summary: form.get("summary"),
      createdAt: new Date().toISOString(),
    });
    await saveAppState();
    window.location.href = getHomePageForUser(currentUser);
  });

  document.querySelector("#zaqueu-start")?.addEventListener("input", updateZaqueuEndDate);
  document.querySelector("#zaqueu-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!canManageZaqueu()) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const start = form.get("start");
    const initialPeople = Number(form.get("initialPeople") || 0);
    appState.zaqueus.unshift({
      id: `zaq_${Date.now()}`,
      churchId: currentUser.churchId,
      church: currentUser.church,
      address: form.get("address"),
      start,
      end: addWeeks(start, 5),
      hosts: form.get("hosts"),
      leaders: form.get("leaders"),
      initialPeople,
      weekday: form.get("weekday"),
      time: form.get("time"),
      week: 1,
      weekVisits: 0,
      weekVisitors: 0,
      weeklyPeople: initialPeople,
      history: { 1: { weekVisits: 0, weekVisitors: 0, weeklyPeople: initialPeople } },
      createdAt: new Date().toISOString(),
    });
    await saveAppState();
    formElement.reset();
    updateZaqueuEndDate();
    renderAll();
  });

  document.querySelector("#zaqueu-material-filter")?.addEventListener("change", (event) => {
    renderMaterials(event.target.value);
  });

  document.querySelector("#calendar-month")?.addEventListener("change", renderCalendar);

  document.querySelector("#zaqueu-files")?.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    for (const file of files) {
      const dataUrl = await readFileAsDataUrl(file);
      appState.zaqueuMaterials.unshift({
        title: file.name,
        type: file.type.includes("pdf") || file.name.toLowerCase().endsWith(".pdf") ? "pdf" : "foto",
        description: `Enviado por ${currentUser?.name || "usuário"}`,
        dataUrl,
        createdAt: new Date().toISOString(),
      });
    }
    await saveAppState();
    renderMaterials(document.querySelector("#zaqueu-material-filter")?.value || "todos");
  });

  document.querySelectorAll("[data-library-category]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-library-category]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderLibrary(button.dataset.libraryCategory);
    });
  });

  document.querySelector("#focus-library-form")?.addEventListener("click", () => {
    document.querySelector("#library-form input[name='title']")?.focus();
  });

  document.querySelector("#focus-notification-form")?.addEventListener("click", () => {
    document.querySelector("#notification-form input[name='title']")?.focus();
  });

  document.querySelector("#focus-calendar-form")?.addEventListener("click", () => {
    document.querySelector("#calendar-form input[name='title']")?.focus();
  });

  document.querySelector("#library-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = form.get("file");
    const link = form.get("link");
    const dataUrl = file && file.size ? await readFileAsDataUrl(file) : "";

    appState.libraryItems.unshift({
      id: `lib_${Date.now()}`,
      title: form.get("title"),
      category: form.get("category"),
      description: form.get("description"),
      kind: link ? "LINK" : file?.name?.toLowerCase().endsWith(".pdf") ? "PDF" : file?.name ? "FOTO" : "ADM",
      link,
      fileName: file?.name || "",
      dataUrl,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    });
    await saveAppState();
    formElement.reset();
    const fb = document.querySelector("#lib-feedback");
    if (fb) fb.textContent = "Material publicado com sucesso!";
    renderLibrary();
  });

  document.querySelector("#notification-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const audienceKey = form.get("audience") || "todos";
    const audienceLabel = formElement.querySelector(`[value="${audienceKey}"]`)?.textContent || "Todos os usuários";
    appState.notifications.unshift({
      id: `not_${Date.now()}`,
      title: form.get("title"),
      audienceKey,
      audience: audienceLabel,
      message: form.get("message"),
      date: formatDate(formatDateLocal()),
      createdBy: currentUser.id,
      createdAt: new Date().toISOString(),
    });
    await saveAppState();
    formElement.reset();
    const fb = document.querySelector("#notif-feedback");
    if (fb) fb.textContent = "Notificação publicada para todos!";
    renderNotifications();
  });

  document.querySelector("#calendar-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const eventDate = String(form.get("date") || formatDateLocal());
    appState.calendarEvents.push({
      id: `cal_${Date.now()}`,
      title: form.get("title"),
      date: eventDate,
      time: form.get("time"),
      church: form.get("church"),
      description: form.get("description"),
      createdBy: currentUser.id,
    });
    await saveAppState();
    formElement.reset();
    const monthInput = document.querySelector("#calendar-month");
    if (monthInput && eventDate) {
      monthInput.value = eventDate.slice(0, 7);
    }
    const fb = document.querySelector("#cal-feedback");
    if (fb) fb.textContent = "Evento salvo no calendário!";
    renderCalendar();
  });
}

async function initApp() {
  injectCriticalFixesCss();
  injectPwaTags();
  const currentPage = getCurrentPage();
  const savedUserId = localStorage.getItem(SESSION_KEY);
  currentUser = appState.users.find((user) => user.id === savedUserId) || null;

  if (currentPage === "index.html") {
    wireAuth();
    showAuthMode("login");
    await syncFromCloud();
    currentUser = appState.users.find((user) => user.id === savedUserId) || null;
    if (currentUser) {
      window.location.replace(getHomePageForUser(currentUser));
    }
    return;
  }

  if (!currentUser) {
    await syncFromCloud();
    currentUser = appState.users.find((user) => user.id === savedUserId) || null;
    if (!currentUser) {
      window.location.replace("index.html");
      return;
    }
  }

  const allowedRoles = PAGE_PERMISSIONS[currentPage];
  if (allowedRoles && !allowedRoles.includes(currentUser.roleId)) {
    window.location.replace(getHomePageForUser(currentUser));
    return;
  }

  document.body.classList.add("is-authenticated", "can-dashboard");
  document.body.classList.toggle("is-admin", isAdmin());
  document.body.classList.toggle("can-manage-zaqueu", canManageZaqueu());

  injectSharedShell();
  wireEvents();
  renderAll();

  await syncFromCloud();
}

initApp();
