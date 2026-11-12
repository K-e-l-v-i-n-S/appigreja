const STORAGE_KEY = "appigreja_prototype_state_v1";
const SESSION_KEY = "appigreja_prototype_session_v1";

// COLE AQUI O LINK DO SEU FIREBASE REALTIME DATABASE QUANDO CRIAR (ex: "https://appigreja-xxxxx-default-rtdb.firebaseio.com")
const CLOUD_DB_URL = "";

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
  { href: "dashboard.html", icon: "D", label: "Dashboard", roles: ["pastor", "bispo", "adm"] },
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

  // Garante que se existir usuário cadastrado, mas nenhum for ADM, o 1º usuário vira ADM automaticamente
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
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
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
      appState = normalizeStateData(cloudData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      const savedUserId = localStorage.getItem(SESSION_KEY);
      if (savedUserId) {
        currentUser = appState.users.find((u) => u.id === savedUserId) || currentUser;
      }
      if (getCurrentPage() !== "index.html") {
        renderAll();
      }
    } else if (appState.users.length > 0) {
      await saveAppState();
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
  if (!currentUser) return [];
  if (currentUser.roleId === "adm" || currentUser.roleId === "bispo") {
    return appState.notifications;
  }
  return appState.notifications.filter(
    (n) => !n.audienceKey || n.audienceKey === "todos" || n.audienceKey === currentUser.roleId
  );
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

function switchAdmTab(mode) {
  const modes = ["content", "notify", "calendar", "users"];
  modes.forEach((m) => {
    const radio = document.querySelector(`#adm-mode-${m}`);
    const label = document.querySelector(`label[for="adm-mode-${m}"]`);
    const panel = document.querySelector(`[data-adm-panel="${m}"]`);
    const isActive = m === mode;
    if (radio) radio.checked = isActive;
    if (label) {
      label.style.background = isActive ? "var(--green)" : "transparent";
      label.style.color = isActive ? "#ffffff" : "var(--muted)";
    }
    if (panel) {
      panel.style.display = isActive ? "grid" : "none";
    }
  });
}

function injectSharedShell() {
  const shell = document.querySelector("#app-shell");
  const main = document.querySelector("#main-content");
  if (!shell || !main || !currentUser) return;

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

  const dbStatus = getCloudEndpoint() ? "Banco em Nuvem Ativo" : "Modo Local";
  const topbarHtml = `
    <header class="topbar">
      <div>
        <p class="eyebrow">${escapeHtml(ROLE_LABELS[currentUser.roleId])} | ${escapeHtml(currentUser.church)} (${escapeHtml(currentUser.pastor)}) — ${dbStatus}</p>
        <h1 id="screen-title">${escapeHtml(pageTitle)}</h1>
      </div>
      <div class="topbar-actions">
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

  // Injeta um painel grande de Gestão de Pessoas e Cargos no final do Dashboard e da Visão Geral
  if (canManageRoles() && (currentPage === "dashboard.html" || currentPage === "visao.html")) {
    const mainScreen = main.querySelector(".screen");
    if (mainScreen && !document.querySelector("#page-users-section")) {
      mainScreen.insertAdjacentHTML(
        "beforeend",
        `
        <section class="panel wide" id="page-users-section" style="margin-top: 18px;">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Controle de Hierarquia e E-mail Único</p>
              <h3>Pessoas Registradas no Sistema (<span id="registered-users-count">0</span>)</h3>
            </div>
          </div>
          <div class="visit-list" id="page-users-list"></div>
        </section>
      `
      );
    }
  }

  if (isAdmin()) {
    const admHtml = `
      <input class="adm-toggle" type="checkbox" id="adm-drawer-toggle" />
      <div class="adm-chat admin-only" aria-label="Painel rápido ADM">
        <label class="adm-fab" for="adm-drawer-toggle">ADM</label>
        <section class="adm-panel">
          <input class="adm-mode" type="radio" name="adm-mode" id="adm-mode-content" />
          <input class="adm-mode" type="radio" name="adm-mode" id="adm-mode-notify" />
          <input class="adm-mode" type="radio" name="adm-mode" id="adm-mode-calendar" />
          <input class="adm-mode" type="radio" name="adm-mode" id="adm-mode-users" checked />
          <header class="adm-header">
            <div>
              <p class="eyebrow">Gestão (${escapeHtml(ROLE_LABELS[currentUser.roleId])})</p>
              <h3>Painel Administrativo</h3>
            </div>
            <label class="adm-minimize" for="adm-drawer-toggle">Minimizar</label>
          </header>
          <div class="adm-tabs" style="grid-template-columns: repeat(4, 1fr);">
            <label for="adm-mode-users" data-tab-btn="users">Cargos</label>
            <label for="adm-mode-content" data-tab-btn="content">Conteúdo</label>
            <label for="adm-mode-notify" data-tab-btn="notify">Aviso</label>
            <label for="adm-mode-calendar" data-tab-btn="calendar">Agenda</label>
          </div>
          <div class="stack-form adm-users-panel" id="adm-users-list" data-adm-panel="users"></div>
          <form class="stack-form adm-content-form" id="library-form" data-adm-panel="content">
            <label>
              Tipo
              <select name="category">
                <option value="devocional">Devocional</option>
                <option value="direcionamento">Direcionamento</option>
                <option value="link">Link de referência</option>
              </select>
            </label>
            <label>
              Título
              <input name="title" type="text" placeholder="Nome do material" required />
            </label>
            <label>
              Descrição
              <textarea name="description" rows="3" placeholder="Resumo do conteúdo"></textarea>
            </label>
            <label>
              Arquivo PDF ou foto
              <input name="file" type="file" accept=".pdf,image/*" />
            </label>
            <label>
              Link de referência
              <input name="link" type="url" placeholder="https://..." />
            </label>
            <button class="primary-button" type="submit">Adicionar na biblioteca</button>
          </form>
          <form class="stack-form adm-notify-form" id="notification-form" data-adm-panel="notify">
            <label>
              Destinatários
              <select name="audience">
                <option value="todos">Todos os usuários</option>
                <option value="obreiro">Somente obreiros</option>
                <option value="lideranca">Somente liderança</option>
                <option value="pastor">Somente pastores</option>
                <option value="adm">Somente ADMs</option>
              </select>
            </label>
            <label>
              Título
              <input name="title" type="text" placeholder="Assunto da notificação" required />
            </label>
            <label>
              Mensagem
              <textarea name="message" rows="4" placeholder="Escreva o aviso que aparecerá para os usuários." required></textarea>
            </label>
            <button class="primary-button" type="submit">Gerar notificação</button>
          </form>
          <form class="stack-form adm-calendar-form" id="calendar-form" data-adm-panel="calendar">
            <label>
              Evento
              <input name="title" type="text" placeholder="Nome do culto ou evento" required />
            </label>
            <div class="form-grid one">
              <label>
                Data
                <input name="date" type="date" value="${formatDateLocal()}" required />
              </label>
              <label>
                Horário
                <input name="time" type="time" value="19:30" />
              </label>
            </div>
            <label>
              Igreja
              <select name="church">
                <option value="Igreja Sede">Igreja Sede</option>
                <option value="Igreja Campineiro">Igreja Campineiro</option>
                <option value="Igreja Mogi Guaçu">Igreja Mogi Guaçu</option>
              </select>
            </label>
            <label>
              Descrição
              <textarea name="description" rows="2" placeholder="Detalhes da programação"></textarea>
            </label>
            <button class="primary-button" type="submit">Salvar no Calendário</button>
          </form>
        </section>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", admHtml);

    document.querySelectorAll("[data-tab-btn]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        switchAdmTab(btn.dataset.tabBtn);
      });
    });

    // Abre a aba Cargos por padrão quando clicar no botão ADM
    switchAdmTab("users");
  }
}

function buildUserRoleCardHtml(u) {
  const isSelf = u.id === currentUser?.id;
  return `
    <div class="visit-item" style="grid-template-columns: 1fr; gap: 10px; background: #f8faf9;">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
        <div>
          <strong>${escapeHtml(u.name)} ${isSelf ? "(Você)" : ""}</strong>
          <small style="display:block; color: var(--muted);">E-mail: ${escapeHtml(u.login)}</small>
        </div>
        <span class="tag">${escapeHtml(ROLE_LABELS[u.roleId] || u.role)} - ${escapeHtml(u.church)}</span>
      </div>
      <div class="form-grid one" style="gap: 8px;">
        <label style="font-size: 12px; color: var(--muted); font-weight: 700;">
          Nível de Hierarquia
          <select class="user-role-select" data-user-id="${escapeHtml(u.id)}">
            ${Object.entries(ROLE_LABELS)
              .map(([roleKey, label]) => `<option value="${roleKey}" ${u.roleId === roleKey ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
        </label>
        <label style="font-size: 12px; color: var(--muted); font-weight: 700;">
          Igreja Vinculada
          <select class="user-church-select" data-user-id="${escapeHtml(u.id)}">
            ${Object.entries(CHURCHES)
              .map(([chKey, chObj]) => `<option value="${chKey}" ${u.churchId === chKey ? "selected" : ""}>${chObj.name} (${chObj.pastor})</option>`)
              .join("")}
          </select>
        </label>
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
      if (targetUser.id === currentUser.id) {
        window.location.reload();
      } else {
        renderAll();
      }
    });
  });
}

function renderUsersRoleManager() {
  if (!canManageRoles()) return;

  const countBadge = document.querySelector("#registered-users-count");
  if (countBadge) countBadge.textContent = String(appState.users.length);

  const cardsHtml = appState.users.length
    ? appState.users.map(buildUserRoleCardHtml).join("")
    : emptyCard("Nenhuma pessoa registrada ainda.");

  const drawerContainer = document.querySelector("#adm-users-list");
  if (drawerContainer) {
    drawerContainer.innerHTML = cardsHtml;
    wireUserRoleSelects(drawerContainer);
  }

  const pageContainer = document.querySelector("#page-users-list");
  if (pageContainer) {
    pageContainer.innerHTML = cardsHtml;
    wireUserRoleSelects(pageContainer);
  }
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
      </div>
    </article>
  `;
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
  const chart = document.querySelector("#zaqueu-week-chart");
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
  if (!visibleVisits.length) {
    container.innerHTML = emptyCard("Sem registros para separar por igreja e cargo ainda.");
    return;
  }

  const byChurch = Object.entries(CHURCHES).map(([key, church]) => {
    const count = visibleVisits.filter((visit) => visit.churchId === key || visit.church === church.name).length;
    return `<div><strong>${escapeHtml(church.name)} (${escapeHtml(church.pastor)})</strong><span>${count} visitas</span></div>`;
  });
  const bishops = visibleVisits.filter((visit) => appState.users.find((user) => user.id === visit.visitorId)?.roleId === "bispo").length;
  const pastors = visibleVisits.filter((visit) => appState.users.find((user) => user.id === visit.visitorId)?.roleId === "pastor").length;
  const leaders = visibleVisits.filter((visit) => appState.users.find((user) => user.id === visit.visitorId)?.roleId === "lideranca").length;
  const workers = visibleVisits.filter((visit) => appState.users.find((user) => user.id === visit.visitorId)?.roleId === "obreiro").length;

  container.innerHTML = [
    ...byChurch,
    `<div><strong>Bispos</strong><span>${bishops} registros</span></div>`,
    `<div><strong>Pastores</strong><span>${pastors} registros</span></div>`,
    `<div><strong>Liderança</strong><span>${leaders} registros</span></div>`,
    `<div><strong>Obreiros</strong><span>${workers} registros</span></div>`,
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
      (item) => `
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
                : `<button class="secondary-button" type="button" disabled>Arquivo local</button>`
            }
          </div>
        </article>
      `
    )
    .join("");
}

function renderLibrary(category = "todos") {
  const container = document.querySelector("#library-grid");
  if (!container) return;
  const items = appState.libraryItems.filter((item) => category === "todos" || item.category === category);
  if (!items.length) {
    container.innerHTML = emptyCard("A biblioteca ainda está vazia. Um ADM pode adicionar devocionais, direcionamentos, fotos, PDFs ou links.");
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
                  : `<span class="tag">Informativo</span>`
            }
          </div>
        </article>
      `
    )
    .join("");
}

function renderNotifications() {
  const container = document.querySelector("#notification-list");
  if (!container) return;
  const visible = getVisibleNotifications();
  if (!visible.length) {
    container.innerHTML = emptyCard("Nenhuma notificação para o seu perfil no momento.");
    return;
  }
  container.innerHTML = visible
    .map(
      (notification) => `
        <article class="notification-item">
          <div class="tag-row">
            <span class="tag">${escapeHtml(notification.audience)}</span>
            <span class="status-pill">${escapeHtml(notification.date)}</span>
          </div>
          <h3>${escapeHtml(notification.title)}</h3>
          <p>${escapeHtml(notification.message)}</p>
        </article>
      `
    )
    .join("");
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
  const events = appState.calendarEvents
    .filter((event) => String(event.date || "").slice(0, 7) === monthInput.value)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));

  const weekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const cells = weekdays.map((day) => `<div class="calendar-weekday">${day}</div>`);

  for (let index = 0; index < firstWeekday; index += 1) {
    cells.push(`<div class="calendar-day empty" aria-hidden="true"></div>`);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${monthInput.value}-${String(day).padStart(2, "0")}`;
    const dayEvents = events.filter((event) => event.date === date);
    cells.push(`
      <div class="calendar-day">
        <strong>${day}</strong>
        ${dayEvents
          .map((event) => `<span class="calendar-dot">${escapeHtml(event.title || "Evento")}</span>`)
          .join("")}
      </div>
    `);
  }

  board.innerHTML = cells.join("");
  list.innerHTML = events.length
    ? events
        .map(
          (event) => `
            <article class="calendar-event">
              <div class="tag-row">
                <span class="tag">${escapeHtml(formatDate(event.date))}</span>
                <span class="tag">${escapeHtml(event.church || "Igreja Sede")}</span>
              </div>
              <strong>${escapeHtml(event.title || "Evento")}</strong>
              <p>${escapeHtml(event.description || "Programação da igreja.")}</p>
              ${event.time ? `<small>Horário: ${escapeHtml(event.time)}</small>` : ""}
            </article>
          `
        )
        .join("")
    : emptyCard("Nenhum evento cadastrado para este mês.");
}

function updateZaqueuEndDate() {
  const startInput = document.querySelector("#zaqueu-start");
  const endInput = document.querySelector("#zaqueu-end");
  if (!startInput || !endInput) return;
  if (!startInput.value) startInput.value = formatDateLocal();
  endInput.value = addWeeks(startInput.value, 5);
}

function openAdmDrawer(mode = "content") {
  if (!isAdmin()) return;
  const drawer = document.querySelector("#adm-drawer-toggle");
  if (drawer) drawer.checked = true;
  switchAdmTab(mode);
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
    const roleId = hasAnyAdmin ? "obreiro" : "adm";

    const user = {
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(String(form.get("password"))),
      roleId,
      role: ROLE_LABELS[roleId],
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
    openAdmDrawer("content");
    window.setTimeout(() => document.querySelector("#library-form input[name='title']")?.focus(), 80);
  });

  document.querySelector("#focus-notification-form")?.addEventListener("click", () => {
    openAdmDrawer("notify");
    window.setTimeout(() => document.querySelector("#notification-form input[name='title']")?.focus(), 80);
  });

  document.querySelector("#focus-calendar-form")?.addEventListener("click", () => {
    openAdmDrawer("calendar");
    window.setTimeout(() => document.querySelector("#calendar-form input[name='title']")?.focus(), 80);
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
    renderNotifications();
  });

  document.querySelector("#calendar-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!isAdmin()) return;
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    appState.calendarEvents.push({
      id: `cal_${Date.now()}`,
      title: form.get("title"),
      date: form.get("date"),
      time: form.get("time"),
      church: form.get("church"),
      description: form.get("description"),
      createdBy: currentUser.id,
    });
    await saveAppState();
    formElement.reset();
    renderCalendar();
  });
}

async function initApp() {
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

  document.body.classList.add("is-authenticated");
  document.body.classList.toggle("is-admin", isAdmin());
  document.body.classList.toggle("can-manage-zaqueu", canManageZaqueu());

  injectSharedShell();
  wireEvents();
  renderAll();

  await syncFromCloud();
}

initApp();
