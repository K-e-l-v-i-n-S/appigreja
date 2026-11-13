const STORAGE_KEY = "appigreja_prototype_state_v1";
const SESSION_KEY = "appigreja_prototype_session_v1";
const CLOUD_INIT_KEY = "appigreja_cloud_initialized_v1";

// LINK DO SEU FIREBASE REALTIME DATABASE JÁ CONFIGURADO:
const CLOUD_DB_URL = "https://appigreja-1f504-default-rtdb.firebaseio.com";

// Identificador único desta aba/aparelho para nunca reproduzir a própria voz no aparelho que transmite
const DEVICE_INSTANCE_ID = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const CHURCHES = {
  sede: { name: "Igreja Sede", pastor: "Bispo Wagner", pastorId: "bispo-wagner" },
  campineiro: { name: "Igreja Campineiro", pastor: "Pastora Lindamir", pastorId: "pra-lindamir" },
  mogi: { name: "Igreja Mogi Guaçu", pastor: "Pastor Paulo", pastorId: "pr-paulo" },
};

const ROLE_LABELS = {
  obreiro: "Obreiro",
  lideranca: "Liderança",
  secretaria: "Secretaria",
  pastor: "Pastor",
  bispo: "Bispo",
  adm: "ADM",
};

// SUBCARGOS E FUNÇÕES MINISTERIAIS
const SUBROLE_LABELS = {
  nenhum: "Sem subcargo específico",
  pastor_adm: "PASTOR ADM",
  pastor_aux: "PASTOR AUX",
  secretaria: "SECRETARIA",
  lider_obreiro: "LÍDER OBREIRO",
  lider_louvor_sede: "LÍDER LOUVOR SEDE",
  lider_louvor_campineiro: "LÍDER LOUVOR CAMPINEIRO",
  lider_louvor_mogi: "LÍDER LOUVOR MOGI GUAÇU",
  lider_zaqueu: "LÍDER ZAQUEU",
  lider_evangelismo_sede: "LÍDER EVANGELISMO SEDE",
  lider_evangelismo_campineiro: "LÍDER EVANGELISMO CAMPINEIRO",
  lider_evangelismo_mogi: "LÍDER EVANGELISMO MOGI GUAÇU",
  lider_danca_sede: "LÍDER DANÇA SEDE",
  lider_danca_campineiro: "LÍDER DANÇA CAMPINEIRO",
  lider_danca_mogi: "LÍDER DANÇA MOGI GUAÇU",
};

const ALL_ROLES = ["obreiro", "lideranca", "secretaria", "pastor", "bispo", "adm"];

const PAGE_PERMISSIONS = {
  "dashboard.html": ["secretaria", "pastor", "bispo", "adm"],
  "visitas.html": ALL_ROLES,
  "nova-visita.html": ALL_ROLES,
  "zaqueus.html": ALL_ROLES,
  "calendario.html": ALL_ROLES,
  "biblioteca.html": ALL_ROLES,
  "visao.html": ["lideranca", "secretaria", "pastor", "bispo", "adm"],
  "notificacoes.html": ALL_ROLES,
  "perfil.html": ALL_ROLES,
  "radio.html": ALL_ROLES,
};

const NAV_ITEMS = [
  { href: "dashboard.html", icon: "D", label: "Dashboard & Cargos", roles: ["secretaria", "pastor", "bispo", "adm"] },
  { href: "perfil.html", icon: "P", label: "Meu Perfil", roles: ALL_ROLES },
  { href: "radio.html", icon: "R", label: "Rádio Ao Vivo", roles: ALL_ROLES },
  { href: "visitas.html", icon: "V", label: "Visitas realizadas", roles: ALL_ROLES },
  { href: "nova-visita.html", icon: "+", label: "Nova visita", roles: ALL_ROLES },
  { href: "zaqueus.html", icon: "Z", label: "Zaqueus", roles: ALL_ROLES },
  { href: "calendario.html", icon: "C", label: "Calendário Igreja", roles: ALL_ROLES },
  { href: "biblioteca.html", icon: "B", label: "Biblioteca", roles: ALL_ROLES },
  { href: "visao.html", icon: "G", label: "Visão Geral", roles: ["lideranca", "secretaria", "pastor", "bispo", "adm"] },
  { href: "notificacoes.html", icon: "N", label: "Notificações", roles: ALL_ROLES },
];

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

let appState = loadAppState();
let currentUser = null;

// Variáveis de controle da Rádio Ao Vivo (Anti-Eco)
let micStream = null;
let micRecorderInterval = null;
let isBroadcastingMic = false;
let isListeningRadio = false;
let radioListenerInterval = null;
let currentPlayingAudio = null;
let lastPlayedChunkId = 0;

function emptyState() {
  return {
    churchLogo: "",
    users: [],
    visits: [],
    zaqueus: [],
    zaqueuMaterials: [],
    libraryItems: [],
    calendarEvents: [],
    notifications: [],
    radioLive: {
      active: false,
      title: "",
      speakerName: "",
      speakerChurch: "",
      streamUrl: "",
      updatedAt: 0,
    },
    radioMessages: [],
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
    churchLogo: parsed.churchLogo || "",
    users: Array.isArray(parsed.users) ? parsed.users : base.users,
    visits: Array.isArray(parsed.visits) ? parsed.visits : base.visits,
    zaqueus: Array.isArray(parsed.zaqueus) ? parsed.zaqueus : base.zaqueus,
    zaqueuMaterials: Array.isArray(parsed.zaqueuMaterials) ? parsed.zaqueuMaterials : base.zaqueuMaterials,
    libraryItems: Array.isArray(parsed.libraryItems) ? parsed.libraryItems : base.libraryItems,
    calendarEvents: Array.isArray(parsed.calendarEvents) ? parsed.calendarEvents : base.calendarEvents,
    notifications: Array.isArray(parsed.notifications) ? parsed.notifications : base.notifications,
    radioLive: parsed.radioLive && typeof parsed.radioLive === "object" ? { ...base.radioLive, ...parsed.radioLive } : base.radioLive,
    radioMessages: Array.isArray(parsed.radioMessages) ? parsed.radioMessages : base.radioMessages,
  };

  state.users.forEach((u, index) => {
    u.churchId = normalizeChurchId(u.churchId);
    u.church = CHURCHES[u.churchId].name;
    u.pastor = CHURCHES[u.churchId].pastor;
    u.pastorId = CHURCHES[u.churchId].pastorId;
    if (!ROLE_LABELS[u.roleId]) u.roleId = "obreiro";
    u.role = ROLE_LABELS[u.roleId];
    if (!u.subRoleId || !SUBROLE_LABELS[u.subRoleId]) u.subRoleId = "nenhum";
    u.subRole = SUBROLE_LABELS[u.subRoleId];
    u.canBroadcast = Boolean(u.canBroadcast || u.roleId === "adm" || u.subRoleId === "pastor_adm");
    u.photoUrl = u.photoUrl || "";
    u.memberCard = u.memberCard || `IGR-${String(index + 1).padStart(4, "0")}`;
    u.cpf = u.cpf || "";
    u.birthDate = u.birthDate || "";
    u.phone = u.phone || "";
    u.baptismDate = u.baptismDate || "";
    u.address = u.address || "";
  });

  if (state.users.length > 0 && !state.users.some((u) => u.roleId === "adm")) {
    state.users[0].roleId = "adm";
    state.users[0].role = ROLE_LABELS.adm;
    state.users[0].canBroadcast = true;
  }

  state.visits.forEach((v) => {
    v.churchId = normalizeChurchId(v.churchId);
    v.church = CHURCHES[v.churchId].name;
    v.pastor = CHURCHES[v.churchId].pastor;
    v.pastorId = CHURCHES[v.churchId].pastorId;
  });

  return state;
}

function getCloudEndpoint(node = "appigreja_state") {
  const cleanUrl = String(CLOUD_DB_URL || "").trim().replace(/\/+$/, "");
  return cleanUrl ? `${cleanUrl}/${node}.json` : "";
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
  const endpoint = getCloudEndpoint("appigreja_state");
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, { cache: "no-store" });
    if (!response.ok) return;
    const cloudData = await response.json();

    if (cloudData && typeof cloudData === "object") {
      appState = normalizeStateData(cloudData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      localStorage.setItem(CLOUD_INIT_KEY, "true");
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
      const wasInitialized = localStorage.getItem(CLOUD_INIT_KEY) === "true";
      if (!wasInitialized && appState.users.length > 0) {
        await saveAppState();
      } else if (wasInitialized) {
        appState = emptyState();
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(SESSION_KEY);
        currentUser = null;
        if (getCurrentPage() !== "index.html") {
          window.location.replace("index.html");
        }
      }
    }
  } catch (err) {
    console.warn("Modo local ativo:", err);
  }
}

async function saveAppState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  const endpoint = getCloudEndpoint("appigreja_state");
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appState),
    });
    if (response.ok) {
      localStorage.setItem(CLOUD_INIT_KEY, "true");
    } else {
      console.error("Erro ao gravar no Firebase:", response.status);
    }
  } catch (err) {
    console.warn("Salvo localmente:", err);
  }
}

async function resetEntireDatabase() {
  if (!confirm("ATENÇÃO: Isso vai apagar TODOS os usuários, visitas, Zaqueus, eventos e notificações deste aparelho e do Firebase. Deseja zerar tudo?")) {
    return;
  }
  appState = emptyState();
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(SESSION_KEY);
  const endpoint = getCloudEndpoint("appigreja_state");
  if (endpoint) {
    try {
      await Promise.all([
        fetch(getCloudEndpoint("appigreja_state"), { method: "DELETE" }),
        fetch(getCloudEndpoint("appigreja_radio_chat"), { method: "DELETE" }),
        fetch(getCloudEndpoint("appigreja_radio_chunk"), { method: "DELETE" }),
      ]);
    } catch (err) {
      console.warn("Erro ao limpar nuvem:", err);
    }
  }
  currentUser = null;
  window.location.replace("index.html");
}

function compressImageFile(file, maxSize = 240) {
  return new Promise((resolve) => {
    if (!file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = () => resolve("");
      img.src = String(e.target.result || "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function getLogoHtml() {
  const customLogo = appState.churchLogo;
  if (customLogo) {
    return `<img src="${customLogo}" alt="Logo da Igreja" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius);" />`;
  }
  return `<img src="logo.png" alt="Logo" style="width:100%; height:100%; object-fit:cover; border-radius:var(--radius);" onerror="this.outerHTML='AI'" />`;
}

function applyChurchLogoEverywhere() {
  document.querySelectorAll(".brand-mark").forEach((el) => {
    el.innerHTML = getLogoHtml();
  });
  if (appState.churchLogo) {
    let iconLink = document.querySelector('link[rel="icon"]');
    if (!iconLink) {
      iconLink = document.createElement("link");
      iconLink.rel = "icon";
      document.head.appendChild(iconLink);
    }
    iconLink.href = appState.churchLogo;
  }
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
      grid-template-columns: minmax(190px, 1.3fr) minmax(130px, 0.9fr) minmax(170px, 1.1fr) minmax(160px, 1fr) auto;
      gap: 10px;
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
    .live-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 16px;
      margin-bottom: 18px;
      border-radius: var(--radius);
      background: linear-gradient(90deg, #b33a30, #d9534f);
      color: #ffffff;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(179, 58, 48, 0.25);
    }
    .member-badge-card {
      padding: 18px;
      border-radius: 12px;
      background: linear-gradient(145deg, #18342f, #2f6f5e);
      color: #ffffff;
      display: grid;
      gap: 14px;
      box-shadow: var(--shadow);
    }
    .radio-popup-widget {
      position: fixed;
      right: 18px;
      bottom: 18px;
      z-index: 9999;
      font-family: inherit;
    }
    .radio-mini-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      border-radius: 999px;
      background: #18342f;
      color: #ffffff;
      border: 2px solid #2f6f5e;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
      cursor: pointer;
    }
    .radio-mini-bar.is-live {
      border-color: #ef4444;
      background: linear-gradient(135deg, #7f1d1d, #18342f);
    }
    .radio-mini-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #9ca3af;
      flex: 0 0 12px;
    }
    .radio-mini-bar.is-live .radio-mini-dot {
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
    }
    .radio-popup-modal {
      display: none;
      width: min(430px, calc(100vw - 24px));
      max-height: min(720px, calc(100vh - 36px));
      overflow-y: auto;
      padding: 16px;
      border-radius: 14px;
      background: var(--surface);
      color: var(--ink);
      border: 2px solid #2f6f5e;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32);
      gap: 14px;
    }
    .radio-popup-widget.is-open .radio-mini-bar {
      display: none;
    }
    .radio-popup-widget.is-open .radio-popup-modal {
      display: grid;
    }
    .password-wrap {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .password-wrap input {
      width: 100%;
      padding-right: 44px !important;
    }
    .password-toggle-btn {
      position: absolute;
      right: 6px;
      top: 50%;
      transform: translateY(-50%);
      min-height: 30px !important;
      width: 34px !important;
      padding: 0 !important;
      border: 0 !important;
      border-radius: 6px;
      background: transparent !important;
      color: var(--muted);
      font-size: 17px;
      display: grid;
      place-items: center;
      cursor: pointer;
      user-select: none;
    }
    .password-toggle-btn:hover {
      background: rgba(47, 111, 94, 0.1) !important;
      color: var(--green-dark);
    }
    .forgot-link-btn {
      border: 0;
      background: transparent;
      color: var(--teal);
      font-size: 13px;
      font-weight: 800;
      padding: 4px 0;
      text-align: right;
      cursor: pointer;
      justify-self: end;
    }
    .forgot-link-btn:hover {
      text-decoration: underline;
    }
    .recovery-result-box {
      padding: 14px;
      border: 2px solid #9bc6bb;
      border-radius: var(--radius);
      background: #f5fbf8;
      display: grid;
      gap: 12px;
    }
    @media (max-width: 980px) {
      .user-role-row {
        grid-template-columns: 1fr;
      }
      .radio-popup-widget {
        right: 10px;
        bottom: 10px;
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
  if (!document.querySelector('link[rel="apple-touch-icon"]')) {
    const appleIcon = document.createElement("link");
    appleIcon.rel = "apple-touch-icon";
    appleIcon.href = appState.churchLogo || "logo.png";
    document.head.appendChild(appleIcon);
  }
  if (!document.querySelector('meta[name="theme-color"]')) {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#18342f";
    document.head.appendChild(meta);
  }
}

let activeVirtualPage = "";

function getCurrentPage() {
  if (activeVirtualPage) return activeVirtualPage;
  const path = decodeURIComponent(window.location.pathname.split("/").pop() || "");
  return path && path.endsWith(".html") ? path : "index.html";
}

function getHomePageForUser(user) {
  if (!user) return "index.html";
  return ["secretaria", "pastor", "bispo", "adm"].includes(user.roleId) ? "dashboard.html" : "visitas.html";
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

async function sha256Hex(value) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }
  return "";
}

async function hashPassword(password) {
  const clean = String(password || "");
  const sha = await sha256Hex(clean);
  return sha || fallbackHash(clean);
}

// Verifica a senha aceitando tanto SHA-256 quanto fallbackHash e corrigindo letra maiúscula automática do celular
async function verifyUserPassword(rawPassword, user) {
  if (!user) return false;
  const candidates = [String(rawPassword || "")];
  const trimmed = candidates[0].trim();
  if (trimmed && !candidates.includes(trimmed)) candidates.push(trimmed);
  if (trimmed.length > 1) {
    const lowerFirst = trimmed[0].toLowerCase() + trimmed.slice(1);
    if (!candidates.includes(lowerFirst)) candidates.push(lowerFirst);
  }

  for (const candidate of candidates) {
    const sha = await sha256Hex(candidate);
    const fb = fallbackHash(candidate);
    if (user.passwordHash === sha || user.passwordHash === fb || user.passwordHash === candidate) {
      return true;
    }
  }
  return false;
}

function onlyDigits(value) {
  return String(value || "").replace(/\D+/g, "");
}

// Adiciona o "olhinho" (Mostrar / Ocultar senha) em todos os campos de senha
function enhancePasswordInputs(root = document) {
  root.querySelectorAll('input[type="password"]').forEach((input) => {
    if (input.dataset.eyeEnhanced === "true") return;
    input.dataset.eyeEnhanced = "true";

    const wrapper = document.createElement("div");
    wrapper.className = "password-wrap";
    input.parentNode.insertBefore(wrapper, input);
    wrapper.appendChild(input);

    const eyeBtn = document.createElement("button");
    eyeBtn.type = "button";
    eyeBtn.className = "password-toggle-btn";
    eyeBtn.setAttribute("aria-label", "Mostrar ou ocultar senha");
    eyeBtn.title = "Mostrar / Ocultar senha";
    eyeBtn.textContent = "👁️";

    eyeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = input.type === "password";
      input.type = isHidden ? "text" : "password";
      eyeBtn.textContent = isHidden ? "🙈" : "👁️";
      input.focus();
    });

    wrapper.appendChild(eyeBtn);
  });
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
  if (!year || !month || !day) return String(value);
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

function getAvatarHtml(user, size = 38) {
  if (user?.photoUrl) {
    return `<img src="${user.photoUrl}" alt="${escapeHtml(user.name)}" style="width:${size}px; height:${size}px; border-radius:50%; object-fit:cover; flex:0 0 ${size}px;" />`;
  }
  return `<span class="avatar" style="width:${size}px; height:${size}px; flex-basis:${size}px;">${escapeHtml(getInitials(user?.name))}</span>`;
}

// Regras de Permissão e Privacidade
function isAdmin() {
  return ["adm", "bispo", "pastor", "secretaria"].includes(currentUser?.roleId);
}

function canViewSecretariaData() {
  if (!currentUser) return false;
  return (
    currentUser.roleId === "adm" ||
    currentUser.roleId === "secretaria" ||
    currentUser.subRoleId === "secretaria" ||
    currentUser.subRoleId === "pastor_adm"
  );
}

function canManageRoles() {
  return ["adm", "bispo", "pastor", "secretaria"].includes(currentUser?.roleId);
}

function canBroadcastRadio() {
  if (!currentUser) return false;
  return Boolean(
    currentUser.roleId === "adm" ||
      currentUser.subRoleId === "pastor_adm" ||
      currentUser.canBroadcast
  );
}

function hasGlobalScope() {
  return ["adm", "bispo", "secretaria"].includes(currentUser?.roleId) || currentUser?.subRoleId === "pastor_adm";
}

function canManageZaqueu() {
  return ["lideranca", "pastor", "bispo", "adm"].includes(currentUser?.roleId) || currentUser?.subRoleId === "lider_zaqueu";
}

function canViewAllVisits() {
  return ["lideranca", "secretaria", "pastor", "bispo", "adm"].includes(currentUser?.roleId);
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
  const isLogin = mode === "login";
  const isRegister = mode === "register";
  const isRecover = mode === "recover";
  document.querySelector("#login-form")?.classList.toggle("active", isLogin);
  document.querySelector("#register-form")?.classList.toggle("active", isRegister);
  document.querySelector("#recover-form")?.classList.toggle("active", isRecover);
  document.querySelector("#show-login")?.classList.toggle("active", isLogin);
  document.querySelector("#show-register")?.classList.toggle("active", isRegister);
  document.querySelector("#show-recover")?.classList.toggle("active", isRecover);
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


// ============================================================================
// TEMPLATES DAS PÁGINAS INTERNAS (Troca de aba instantânea sem desligar a Rádio)
// ============================================================================

const SCREEN_TEMPLATES = {
  "dashboard.html": `
    <section class="screen" id="dashboard" aria-labelledby="dashboard-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Resumo do mês</p>
          <h2 id="dashboard-title">Dashboard</h2>
        </div>
        <div class="filter-row">
          <a class="primary-button" href="nova-visita.html">Nova visita</a>
        </div>
      </div>
      <div class="metric-grid compact">
        <article class="metric-card">
          <span>Visitas no mês</span>
          <strong id="metric-month-visits">0</strong>
          <small>Registros visíveis no seu escopo</small>
        </article>
        <article class="metric-card">
          <span>Minhas visitas</span>
          <strong id="metric-my-visits">0</strong>
          <small id="metric-my-visits-label">Usuário logado</small>
        </article>
        <article class="metric-card">
          <span>Igrejas com visitas</span>
          <strong id="metric-active-churches">0</strong>
          <small>Separação por ID interno</small>
        </article>
        <article class="metric-card">
          <span>Visitas antes do Zaqueu</span>
          <strong id="metric-zaqueu-visits">0</strong>
          <small>Soma semanal dos núcleos ativos</small>
        </article>
      </div>
      <section class="panel wide dashboard-chart-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Comparativo</p>
            <h3>Visitas por igreja e mês</h3>
          </div>
          <div class="chart-legend" aria-label="Legenda do gráfico">
            <span><b class="legend-dot sede"></b>Igreja Sede</span>
            <span><b class="legend-dot norte"></b>Igreja Campineiro</span>
            <span><b class="legend-dot leste"></b>Igreja Mogi Guaçu</span>
          </div>
        </div>
        <div class="comparison-chart-wrap">
          <div class="comparison-chart" id="church-month-chart" aria-label="Comparativo mensal de visitas por igreja"></div>
        </div>
      </section>
      <section class="panel wide">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Lista de visitas</p>
            <h3>Registros mais recentes</h3>
          </div>
          <a class="text-button" href="visitas.html">Ver todas</a>
        </div>
        <div class="visit-list" id="dashboard-visits"></div>
      </section>
    </section>
  `,

  "perfil.html": `
    <section class="screen" id="perfil" aria-labelledby="perfil-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Dados Pessoais e Credencial</p>
          <h2 id="perfil-title">Meu Perfil</h2>
        </div>
        <span class="saving-state" id="profile-save-status">Protegido (Acesso restrito à Secretaria/ADM)</span>
      </div>
      <div class="zaqueu-layout">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Ficha de Membro</p>
              <h3>Meus Dados Cadastrais</h3>
            </div>
          </div>
          <form class="stack-form" id="profile-form" style="margin-top: 14px;">
            <label class="upload-box" style="cursor: pointer; text-align: center;">
              <span>📷 Toque aqui para escolher ou tirar sua Foto de Perfil</span>
              <input id="profile-photo-input" type="file" accept="image/*" style="display: none;" />
            </label>
            <div class="form-grid">
              <label>
                Nome completo
                <input id="prof-name" name="name" type="text" required />
              </label>
              <label>
                Nº da Carteira de Membro
                <input id="prof-member-card" name="memberCard" type="text" placeholder="Ex: SEDE-2026-001" />
              </label>
              <label>
                CPF (Apenas ADM e Secretaria visualizam)
                <input id="prof-cpf" name="cpf" type="text" placeholder="000.000.000-00" maxlength="14" />
              </label>
              <label>
                Data de Aniversário / Nascimento
                <input id="prof-birth" name="birthDate" type="date" />
              </label>
              <label>
                Telefone / WhatsApp
                <input id="prof-phone" name="phone" type="tel" placeholder="(19) 99999-9999" />
              </label>
              <label>
                Data de Batismo / Membresia
                <input id="prof-baptism" name="baptismDate" type="date" />
              </label>
            </div>
            <label>
              Endereço Completo (Rua, Nº, Bairro, Cidade - UF, CEP)
              <textarea id="prof-address" name="address" rows="3" placeholder="Digite seu endereço residencial completo"></textarea>
            </label>
            <div class="form-actions">
              <span id="profile-feedback" style="font-weight: 800; color: var(--green);"></span>
              <button class="primary-button" type="submit">Salvar Meu Perfil</button>
            </div>
          </form>
        </section>
        <section class="panel" id="digital-member-card">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Credencial Digital</p>
              <h3>Carteira de Membro</h3>
            </div>
          </div>
          <div id="member-card-preview" style="margin-top: 14px;"></div>
        </section>
      </div>
      <section class="panel wide" id="secretaria-members-panel" style="margin-top: 22px; display: none;">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Acesso Confidencial — Exclusivo ADM e Secretaria</p>
            <h3>Fichas Cadastrais de Todos os Membros (<span id="secretaria-count">0</span>)</h3>
          </div>
          <label class="search">
            <span aria-hidden="true">B</span>
            <input id="secretaria-search" type="search" placeholder="Buscar por nome, CPF ou carteira..." />
          </label>
        </div>
        <div class="visit-list" id="secretaria-members-list" style="margin-top: 14px;"></div>
      </section>
    </section>
  `,

  "visitas.html": `
    <section class="screen" id="visitas" aria-labelledby="visitas-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Histórico de campo</p>
          <h2 id="visitas-title">Visitas realizadas</h2>
        </div>
        <a class="primary-button" href="nova-visita.html">Nova visita</a>
      </div>
      <div class="toolbar">
        <label class="search inline">
          <span aria-hidden="true">B</span>
          <input id="visit-search" type="search" placeholder="Nome do visitante ou visitado" />
        </label>
        <select id="church-filter" aria-label="Filtrar por igreja">
          <option value="todos">Todas as igrejas</option>
          <option value="sede">Igreja Sede</option>
          <option value="campineiro">Igreja Campineiro</option>
          <option value="mogi">Igreja Mogi Guaçu</option>
        </select>
        <select id="worker-filter" aria-label="Filtrar por obreiro">
          <option value="todos">Todos os obreiros</option>
        </select>
        <select id="pastor-filter" aria-label="Filtrar por liderança pastoral">
          <option value="todos">Todos os pastores/bispo</option>
          <option value="bispo-wagner">Bispo Wagner</option>
          <option value="pra-lindamir">Pastora Lindamir</option>
          <option value="pr-paulo">Pastor Paulo</option>
        </select>
      </div>
      <div class="visit-list" id="visit-results"></div>
    </section>
  `,

  "nova-visita.html": `
    <section class="screen" id="nova-visita" aria-labelledby="nova-visita-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Registro rápido</p>
          <h2 id="nova-visita-title">Nova visita</h2>
        </div>
        <span class="saving-state" id="saving-state">Data selecionável</span>
      </div>
      <form class="visit-form" id="visit-form">
        <input id="visit-worker-id" type="hidden" name="workerId" />
        <input id="visit-church-id" type="hidden" name="churchId" />
        <input id="visit-role-id" type="hidden" name="roleId" />
        <div class="form-grid">
          <label>
            Data da visita
            <input id="visit-date" name="date" type="date" required />
          </label>
          <label>
            Visitante logado
            <input id="visit-worker-name" name="worker" type="text" readonly />
          </label>
          <label>
            Igreja vinculada
            <input id="visit-church-name" name="church" type="text" readonly />
          </label>
          <label>
            Pessoa/família visitada
            <input name="visited" type="text" placeholder="Nome da pessoa ou família visitada" required />
          </label>
        </div>
        <label>
          Resumo da visita
          <textarea name="summary" rows="7" placeholder="Escreva o essencial: quem foi visitado, como foi recebido, o que ficou combinado e qualquer observação pastoral importante." required></textarea>
        </label>
        <div class="form-actions">
          <button class="secondary-button" type="reset">Limpar</button>
          <button class="primary-button" type="submit">Salvar visita</button>
        </div>
      </form>
    </section>
  `,

  "zaqueus.html": `
    <section class="screen" id="zaqueus" aria-labelledby="zaqueus-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Núcleos abertos</p>
          <h2 id="zaqueus-title">Zaqueus</h2>
        </div>
        <a class="primary-button zaqueu-leader-only" href="#novo-zaqueu">Criar Novo Zaqueu</a>
      </div>
      <div class="zaqueu-layout">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Controle semanal</p>
              <h3>Zaqueus em andamento</h3>
            </div>
          </div>
          <div class="zaqueu-list" id="zaqueu-list"></div>
        </section>
        <section class="panel zaqueu-leader-only" id="novo-zaqueu">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Abertura (Liderança+)</p>
              <h3>Novo Zaqueu</h3>
            </div>
          </div>
          <form class="stack-form" id="zaqueu-form">
            <label>
              Endereço completo
              <textarea name="address" rows="3" placeholder="Rua, número, bairro, cidade" required></textarea>
            </label>
            <div class="form-grid one">
              <label>
                Data de início
                <input id="zaqueu-start" name="start" type="date" required />
              </label>
              <label>
                Data de término
                <input id="zaqueu-end" name="end" type="date" readonly />
              </label>
            </div>
            <label>
              Anfitriões
              <input name="hosts" type="text" placeholder="Nomes dos anfitriões" required />
            </label>
            <label>
              Responsáveis
              <input name="leaders" type="text" placeholder="Obreiros ou liderança responsável" required />
            </label>
            <label>
              Pessoas iniciando sem responsáveis/anfitriões
              <input name="initialPeople" type="number" min="0" value="0" />
            </label>
            <div class="form-grid one">
              <label>
                Dia da semana
                <select name="weekday">
                  <option>Domingo</option>
                  <option>Segunda-feira</option>
                  <option>Terça-feira</option>
                  <option>Quarta-feira</option>
                  <option>Quinta-feira</option>
                  <option>Sexta-feira</option>
                  <option>Sábado</option>
                </select>
              </label>
              <label>
                Horário
                <input name="time" type="time" value="19:30" />
              </label>
            </div>
            <button class="primary-button" type="submit">Criar Novo Zaqueu</button>
          </form>
        </section>
      </div>
      <section class="panel wide material-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Material do Zaqueu</p>
            <h3>Fotos e PDFs</h3>
          </div>
          <select id="zaqueu-material-filter" aria-label="Filtrar material do Zaqueu">
            <option value="todos">Todos</option>
            <option value="pdf">PDFs</option>
            <option value="foto">Fotos</option>
          </select>
        </div>
        <label class="upload-box">
          <span>Subir arquivos do Zaqueu (até 1.5MB)</span>
          <input id="zaqueu-files" type="file" multiple accept=".pdf,image/*" />
        </label>
        <div class="content-card-grid" id="zaqueu-materials"></div>
      </section>
    </section>
  `,

  "calendario.html": `
    <section class="screen" id="calendario" aria-labelledby="calendario-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Agenda mensal</p>
          <h2 id="calendario-title">Calendário Igreja</h2>
        </div>
        <div class="filter-row">
          <label class="month-filter">
            Mês
            <input id="calendar-month" type="month" />
          </label>
        </div>
      </div>
      <div class="calendar-layout">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Secretaria sede</p>
              <h3>Programação do mês</h3>
            </div>
            <span class="saving-state">Sincronizado</span>
          </div>
          <div class="calendar-board" id="calendar-board"></div>
        </section>
        <section class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Eventos</p>
              <h3>Lista do mês</h3>
            </div>
          </div>
          <div class="calendar-event-list" id="calendar-event-list"></div>
        </section>
      </div>
    </section>
  `,

  "biblioteca.html": `
    <section class="screen" id="biblioteca" aria-labelledby="biblioteca-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Conteúdos para baixar</p>
          <h2 id="biblioteca-title">Biblioteca</h2>
        </div>
      </div>
      <section class="panel wide library-panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Disponíveis</p>
            <h3>Devocionais e direcionamentos</h3>
          </div>
          <div class="segmented" role="group" aria-label="Categorias da biblioteca">
            <button class="active" type="button" data-library-category="todos">Todos</button>
            <button type="button" data-library-category="devocional">Devocionais</button>
            <button type="button" data-library-category="direcionamento">Direcionamentos</button>
            <button type="button" data-library-category="link">Links</button>
          </div>
        </div>
        <div class="content-card-grid" id="library-grid"></div>
      </section>
    </section>
  `,

  "visao.html": `
    <section class="screen" id="visao" aria-labelledby="visao-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Liderança</p>
          <h2 id="visao-title">Visão Geral</h2>
        </div>
      </div>
      <div class="metric-grid compact">
        <article class="metric-card">
          <span>Visitas realizadas</span>
          <strong id="overview-visits">0</strong>
          <small>Registros do mês no seu escopo</small>
        </article>
        <article class="metric-card">
          <span>Visitas antes dos cultos</span>
          <strong id="overview-zaqueu-visits">0</strong>
          <small>Somente semana atual</small>
        </article>
        <article class="metric-card">
          <span>Visitantes nos cultos</span>
          <strong id="overview-cult-visitors">0</strong>
          <small>Somados por semana</small>
        </article>
        <article class="metric-card">
          <span>Frequentando semanalmente</span>
          <strong id="overview-weekly-people">0</strong>
          <small>Pessoas recorrentes nos Zaqueus</small>
        </article>
      </div>
      <div class="leader-grid">
        <section class="panel wide">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Zaqueu</p>
              <h3>Frequência acumulada por semana</h3>
            </div>
          </div>
          <div class="chart" id="zaqueu-week-chart" aria-label="Gráfico semanal de Zaqueus"></div>
          <div class="chart-labels">
            <span>Sem 1</span>
            <span>Sem 2</span>
            <span>Sem 3</span>
            <span>Sem 4</span>
            <span>Sem 5</span>
          </div>
        </section>
        <section class="panel">
          <div class="panel-header">
            <div>
              <p class="eyebrow">Separação por ID</p>
              <h3>Igrejas e cargos</h3>
            </div>
          </div>
          <div class="rank-list" id="overview-rank"></div>
        </section>
      </div>
    </section>
  `,

  "notificacoes.html": `
    <section class="screen" id="notificacoes" aria-labelledby="notificacoes-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Avisos Internos</p>
          <h2 id="notificacoes-title">Notificações</h2>
        </div>
      </div>
      <section class="panel wide">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Mural</p>
            <h3>Notificações publicadas</h3>
          </div>
        </div>
        <div class="notification-list" id="notification-list"></div>
      </section>
    </section>
  `,
};

function toggleRadioPopup(openState) {
  const widget = document.querySelector("#radio-popup-widget");
  if (!widget) return;
  const shouldOpen = typeof openState === "boolean" ? openState : !widget.classList.contains("is-open");
  widget.classList.toggle("is-open", shouldOpen);
  sessionStorage.setItem("appigreja_radio_popup_open", shouldOpen ? "true" : "false");
  if (shouldOpen) {
    renderRadioPage();
  }
}

function injectRadioPopupWidget() {
  if (!currentUser || document.querySelector("#radio-popup-widget")) return;

  const widgetHtml = `
    <aside class="radio-popup-widget" id="radio-popup-widget" aria-label="Popup da Rádio Ao Vivo">
      <!-- Barra Flutuante Minimizável (Continua tocando ao trocar de aba) -->
      <div class="radio-mini-bar" id="radio-mini-bar">
        <span class="radio-mini-dot" id="popup-mini-dot"></span>
        <div id="radio-mini-open-area" style="display:grid; min-width:0;">
          <strong id="popup-mini-title" style="font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width:190px;">📻 Rádio Ao Vivo</strong>
          <small id="popup-mini-sub" style="font-size:11px; opacity:0.85;">Toque para abrir o player</small>
        </div>
        <button type="button" id="popup-mini-listen-btn" class="primary-button" style="background:#f3b743; color:#18342f; min-height:30px; padding:4px 10px; font-size:12px; font-weight:900;">
          🔊 Ouvir
        </button>
        <button type="button" id="popup-mini-expand-btn" class="secondary-button" style="min-height:30px; padding:4px 8px; font-size:12px;">
          ▲ Abrir
        </button>
      </div>

      <!-- Janela Popup Completa da Rádio Ao Vivo -->
      <section class="radio-popup-modal" id="radio-popup-modal">
        <header style="display:flex; align-items:center; justify-content:space-between; gap:8px; border-bottom:1px solid var(--line); padding-bottom:10px;">
          <div>
            <span class="status-pill" id="popup-radio-status-badge">Offline</span>
            <h3 style="margin:4px 0 0; font-size:17px;">📻 Rádio Ao Vivo (Popup)</h3>
          </div>
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" id="popup-detach-window-btn" class="secondary-button" style="min-height:30px; padding:4px 8px; font-size:11px;" title="Destacar em janela independente">
              🗗 Janela
            </button>
            <button type="button" id="popup-minimize-btn" class="secondary-button" style="min-height:30px; padding:4px 10px; font-size:12px; font-weight:800;">
              ㅡ Minimizar
            </button>
          </div>
        </header>

        <!-- Caixa do Player (Ouvintes) -->
        <div style="padding:14px; border-radius:10px; background:linear-gradient(135deg, #18342f, #2f6f5e); color:#ffffff; display:grid; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="popup-radio-live-indicator" style="width:14px; height:14px; border-radius:50%; background:#9ca3af; flex:0 0 14px;"></div>
            <div style="min-width:0;">
              <strong id="popup-radio-speaker-name" style="font-size:15px; display:block;">Ninguém ao vivo no momento</strong>
              <span id="popup-radio-speaker-church" style="font-size:12px; opacity:0.85; display:block;">Você pode trocar de aba livremente que a rádio não desliga.</span>
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button class="primary-button" type="button" id="popup-listen-radio-btn" style="background:#f3b743; color:#18342f; font-weight:900; width:100%;">
              🔊 Conectar Áudio para Ouvir
            </button>
            <small id="popup-listener-audio-status" style="font-size:12px; opacity:0.92;">Toque acima para ouvir enquanto navega pelo app.</small>
          </div>

          <audio id="popup-external-audio-player" controls style="width:100%; display:none;"></audio>
        </div>

        <!-- Estúdio de Transmissão (Visível para ADM ou quem tem permissão de Rádio) -->
        <div id="popup-radio-broadcaster-studio" style="padding:12px; border:2px solid #9bc6bb; border-radius:10px; background:#f5fbf8; display:none;">
          <p class="eyebrow" style="margin-bottom:6px;">🎙️ Estúdio do Locutor (Somente Entrada / Sem Eco)</p>
          <div class="stack-form" style="gap:10px;">
            <label style="font-size:12px;">
              Título da Transmissão
              <input id="popup-broadcast-title" type="text" value="Palavra Pastoral e Oração Ao Vivo" style="min-height:34px; padding:6px 8px;" />
            </label>
            <label style="font-size:12px;">
              Link de Stream Externo (Opcional)
              <input id="popup-broadcast-stream-url" type="url" placeholder="https://... (deixe vazio p/ usar Microfone)" style="min-height:34px; padding:6px 8px;" />
            </label>
            <div style="display:flex; gap:8px; flex-wrap:wrap;">
              <button class="primary-button" type="button" id="popup-start-mic-btn" style="flex:1; min-height:36px; font-size:13px;">
                🎙️ Entrar Ao Vivo
              </button>
              <button class="secondary-button danger-btn" type="button" id="popup-stop-broadcast-btn" style="display:none; flex:1; min-height:36px;">
                ⏹️ Encerrar
              </button>
            </div>
            <small id="popup-broadcaster-feedback" style="color:var(--green-dark); font-weight:700; font-size:12px;"></small>
          </div>
        </div>

        <!-- Chat Ao Vivo e Pedidos de Oração dentro do Popup -->
        <div style="display:grid; gap:8px; border-top:1px solid var(--line); padding-top:10px;">
          <strong style="font-size:13px;">💬 Chat Ao Vivo & Pedidos de Oração</strong>
          <form id="popup-radio-chat-form" style="display:flex; gap:6px;">
            <input name="text" type="text" placeholder="Digite um Amém ou pedido..." required style="flex:1; min-height:36px; padding:6px 10px;" />
            <button class="primary-button" type="submit" style="min-height:36px; padding:6px 12px;">Enviar</button>
          </form>
          <div id="popup-radio-chat-list" style="display:grid; gap:6px; max-height:190px; overflow-y:auto;"></div>
        </div>
      </section>
    </aside>
  `;

  document.body.insertAdjacentHTML("beforeend", widgetHtml);

  // Eventos do Popup da Rádio
  document.querySelector("#radio-mini-open-area")?.addEventListener("click", () => toggleRadioPopup(true));
  document.querySelector("#popup-mini-expand-btn")?.addEventListener("click", () => toggleRadioPopup(true));
  document.querySelector("#popup-minimize-btn")?.addEventListener("click", () => toggleRadioPopup(false));

  document.querySelector("#popup-mini-listen-btn")?.addEventListener("click", (e) => {
    e.stopPropagation();
    startListeningRadioLoop();
  });

  document.querySelector("#popup-listen-radio-btn")?.addEventListener("click", startListeningRadioLoop);
  document.querySelector("#popup-start-mic-btn")?.addEventListener("click", startMicrophoneBroadcast);
  document.querySelector("#popup-stop-broadcast-btn")?.addEventListener("click", stopBroadcast);

  document.querySelector("#popup-detach-window-btn")?.addEventListener("click", () => {
    window.open("radio.html?popup=1", "AppIgrejaRadioPopup", "width=450,height=720,menubar=no,toolbar=no,location=no,status=no");
  });

  document.querySelector("#popup-radio-chat-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const text = String(form.get("text") || "").trim();
    if (!text) return;
    formEl.reset();
    await sendRadioChatMessage(text);
  });

  if (sessionStorage.getItem("appigreja_radio_popup_open") === "true" || getCurrentPage() === "radio.html") {
    toggleRadioPopup(true);
  }
}

// Navegação Instantânea entre Abas (Sem recarregar a página e sem cortar o áudio/microfone da Rádio)
function navigateToPageSeamless(rawHref, pushHistory = true) {
  if (!rawHref) return;
  const [filePart, hashOrQuery] = rawHref.split("#");
  const [cleanPage, queryString] = filePart.split("?");
  const targetPage = cleanPage || getCurrentPage();

  if (targetPage === "index.html") {
    logout();
    return;
  }

  // Se clicar em Rádio Ao Vivo no menu lateral ou no banner, abre o Popup Flutuante da Rádio sem sair da aba atual!
  if (targetPage === "radio.html") {
    toggleRadioPopup(true);
    return;
  }

  const allowedRoles = PAGE_PERMISSIONS[targetPage];
  if (allowedRoles && !allowedRoles.includes(currentUser?.roleId)) {
    return;
  }

  const template = SCREEN_TEMPLATES[targetPage];
  const main = document.querySelector("#main-content") || document.querySelector(".main");
  if (!template || !main) {
    window.location.href = rawHref;
    return;
  }

  activeVirtualPage = targetPage;

  if (pushHistory && window.location.protocol.startsWith("http")) {
    const newUrl = queryString ? `${targetPage}?${queryString}` : hashOrQuery ? `${targetPage}#${hashOrQuery}` : targetPage;
    window.history.pushState({ page: targetPage }, "", newUrl);
  }

  main.innerHTML = template;
  injectSharedShell();
  wirePageContentEvents();
  renderAll();

  if (hashOrQuery) {
    const targetEl = document.getElementById(hashOrQuery);
    if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function injectSharedShell() {
  const shell = document.querySelector("#app-shell") || document.querySelector(".app-shell");
  const main = document.querySelector("#main-content") || document.querySelector(".main");
  if (!shell || !main || !currentUser) return;

  shell.querySelectorAll(".sidebar").forEach((el) => el.remove());
  main.querySelectorAll(".topbar, .live-banner").forEach((el) => el.remove());
  document.querySelectorAll(".adm-chat, #adm-drawer-toggle").forEach((el) => el.remove());

  const currentPage = getCurrentPage();
  const pageTitle = document.querySelector("main h2")?.textContent.trim() || "APPIGREJA";

  const navLinksHtml = NAV_ITEMS
    .filter((item) => item.roles.includes(currentUser.roleId))
    .map((item) => {
      const active = item.href === currentPage ? "active" : "";
      const liveDot = item.href === "radio.html" && appState.radioLive?.active ? " 🔴" : "";
      return `
        <a class="nav-item ${active}" href="${item.href}">
          <span class="icon" aria-hidden="true">${item.icon}</span>
          ${escapeHtml(item.label)}${liveDot}
        </a>
      `;
    })
    .join("");

  const subRoleDisplay =
    currentUser.subRoleId && currentUser.subRoleId !== "nenhum"
      ? ` • ${SUBROLE_LABELS[currentUser.subRoleId]}`
      : "";

  const sidebarHtml = `
    <aside class="sidebar" aria-label="Navegação principal">
      <div class="brand">
        <div class="brand-mark" aria-hidden="true">${getLogoHtml()}</div>
        <div>
          <strong>APPIGREJA</strong>
          <span>Cuidado e Zaqueus</span>
        </div>
      </div>
      <nav class="nav-list">${navLinksHtml}</nav>
      <div class="profile-card">
        <a href="perfil.html" title="Editar Meu Perfil" style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
          ${getAvatarHtml(currentUser, 38)}
          <div style="min-width:0;">
            <strong id="profile-name">${escapeHtml(currentUser.name)}</strong>
            <span id="profile-role">${escapeHtml((ROLE_LABELS[currentUser.roleId] || currentUser.role) + subRoleDisplay)}</span>
          </div>
        </a>
        <button class="profile-logout" type="button" id="logout-button">Sair</button>
      </div>
    </aside>
  `;

  const promoteSelfBtn =
    currentUser.roleId !== "adm"
      ? `<button class="secondary-button" type="button" id="promote-self-adm" title="Ativar perfil ADM para testar na faculdade">Virar ADM (Teste)</button>`
      : `<a class="secondary-button" href="perfil.html#secretaria-members-panel">Fichas da Secretaria (${appState.users.length})</a>`;

  const liveBannerHtml =
    appState.radioLive?.active && currentPage !== "radio.html"
      ? `
        <div class="live-banner">
          <span>🔴 RÁDIO AO VIVO AGORA: ${escapeHtml(appState.radioLive.title || "Transmissão em andamento")} (${escapeHtml(appState.radioLive.speakerName)})</span>
          <a class="secondary-button" href="radio.html" style="padding: 4px 12px; min-height: 30px;">Ouvir Agora</a>
        </div>
      `
      : "";

  const topbarHtml = `
    ${liveBannerHtml}
    <header class="topbar">
      <div>
        <p class="eyebrow">${escapeHtml(ROLE_LABELS[currentUser.roleId])}${escapeHtml(subRoleDisplay)} | ${escapeHtml(currentUser.church)} (${escapeHtml(currentUser.pastor)})</p>
        <h1 id="screen-title">${escapeHtml(pageTitle)}</h1>
      </div>
      <div class="topbar-actions">
        ${promoteSelfBtn}
        <a class="secondary-button" href="perfil.html">Meu Perfil</a>
        <a class="ghost-button" href="nova-visita.html">Nova visita</a>
      </div>
    </header>
  `;

  shell.insertAdjacentHTML("afterbegin", sidebarHtml);
  main.insertAdjacentHTML("afterbegin", topbarHtml);

  // 1. PAINEL DE PESSOAS REGISTRADAS, SUBCARGOS, LOGO E RÁDIO NO DASHBOARD E VISÃO GERAL
  const dashboardScreen = document.querySelector("#dashboard") || document.querySelector("#visao");
  if (dashboardScreen && canManageRoles() && !document.querySelector("#gestao-cargos")) {
    const heading = dashboardScreen.querySelector(".section-heading");
    const usersPanelHtml = `
      <section class="panel wide inline-admin-panel" id="gestao-cargos">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Administração Geral, Subcargos, Rádio e Logo</p>
            <h3>Pessoas Registradas no Sistema (<span id="registered-users-count">0</span>)</h3>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
            <label class="secondary-button" style="cursor: pointer; padding: 6px 12px; min-height: 32px; font-size: 12px;">
              🖼️ Trocar Logo do App
              <input type="file" id="upload-church-logo-input" accept="image/*" style="display: none;" />
            </label>
            <a class="secondary-button" href="perfil.html#secretaria-members-panel" style="padding: 6px 12px; min-height: 32px; font-size: 12px;">
              🪪 Ver Fichas / Carteiras (Secretaria)
            </a>
            <button class="secondary-button danger-btn" type="button" id="reset-db-btn">Zerar Tudo</button>
          </div>
        </div>
        <p style="margin: 6px 0 12px; font-size: 13px; color: var(--muted);" id="role-save-feedback">
          Defina abaixo o Cargo Principal, o Subcargo/Função Ministerial, a Igreja e quem pode transmitir na Rádio Ao Vivo:
        </p>

        <div class="visit-list" id="page-users-list" style="margin-top: 12px; margin-bottom: 18px;"></div>

        <details style="border-top: 1px solid var(--line); padding-top: 14px;">
          <summary style="cursor: pointer; font-weight: 800; color: var(--green-dark);">+ Cadastrar Nova Pessoa com Cargo e Subcargo</summary>
          <form class="stack-form" id="admin-add-user-form" style="margin-top: 12px;">
            <div class="form-grid">
              <label>
                Nome completo
                <input name="name" type="text" placeholder="Nome completo" required />
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
                Nível de Acesso Principal
                <select name="roleId" required>
                  ${Object.entries(ROLE_LABELS)
                    .map(([k, v]) => `<option value="${k}">${v}</option>`)
                    .join("")}
                </select>
              </label>
              <label>
                Subcargo / Função Ministerial
                <select name="subRoleId">
                  ${Object.entries(SUBROLE_LABELS)
                    .map(([k, v]) => `<option value="${k}">${v}</option>`)
                    .join("")}
                </select>
              </label>
            </div>
            <div class="form-actions">
              <span id="admin-add-user-msg" style="font-weight: 700; color: var(--green);"></span>
              <button class="primary-button" type="submit">Cadastrar Pessoa</button>
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
                <option value="adm">Administração e Secretaria</option>
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
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
        ${getAvatarHtml(u, 42)}
        <div style="min-width: 0;">
          <strong style="font-size: 15px; display: block;">${escapeHtml(u.name)} ${isSelf ? "(Você)" : ""}</strong>
          <small style="display:block; color: var(--muted);">E-mail: ${escapeHtml(u.login)}</small>
          <small style="display:block; color: var(--teal); font-weight: 700;">Carteira: ${escapeHtml(u.memberCard || "Não informada")}</small>
        </div>
      </div>

      <label style="font-size: 11px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Cargo Principal
        <select class="user-role-select" data-user-id="${escapeHtml(u.id)}">
          ${Object.entries(ROLE_LABELS)
            .map(([roleKey, label]) => `<option value="${roleKey}" ${u.roleId === roleKey ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>

      <label style="font-size: 11px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Subcargo / Função
        <select class="user-subrole-select" data-user-id="${escapeHtml(u.id)}">
          ${Object.entries(SUBROLE_LABELS)
            .map(([subKey, label]) => `<option value="${subKey}" ${(u.subRoleId || "nenhum") === subKey ? "selected" : ""}>${label}</option>`)
            .join("")}
        </select>
      </label>

      <label style="font-size: 11px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Igreja Vinculada
        <select class="user-church-select" data-user-id="${escapeHtml(u.id)}">
          ${Object.entries(CHURCHES)
            .map(([chKey, chObj]) => `<option value="${chKey}" ${u.churchId === chKey ? "selected" : ""}>${chObj.name}</option>`)
            .join("")}
        </select>
      </label>

      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <label style="display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 800; color: var(--green-dark); cursor: pointer;">
          <input type="checkbox" class="user-radio-check" data-user-id="${escapeHtml(u.id)}" style="min-height: 18px; width: 18px;" ${u.canBroadcast ? "checked" : ""} />
          🎙️ Rádio
        </label>
        <button class="secondary-button reset-user-pass-btn" type="button" data-user-id="${escapeHtml(u.id)}" style="padding: 6px 10px; min-height: 32px; font-size: 12px;" title="Redefinir senha ou enviar por WhatsApp">
          🔑 Senha
        </button>
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
      if (targetUser.roleId === "adm") targetUser.canBroadcast = true;
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

  rootElement.querySelectorAll(".user-subrole-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const targetUser = appState.users.find((u) => u.id === select.dataset.userId);
      if (!targetUser) return;
      targetUser.subRoleId = select.value;
      targetUser.subRole = SUBROLE_LABELS[select.value] || "Sem subcargo específico";
      if (targetUser.subRoleId === "pastor_adm") targetUser.canBroadcast = true;
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Subcargo de ${targetUser.name} salvo como ${targetUser.subRole}!`;
      renderAll();
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
      renderAll();
    });
  });

  rootElement.querySelectorAll(".user-radio-check").forEach((checkbox) => {
    checkbox.addEventListener("change", async () => {
      const targetUser = appState.users.find((u) => u.id === checkbox.dataset.userId);
      if (!targetUser) return;
      targetUser.canBroadcast = checkbox.checked;
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) {
        feedback.textContent = checkbox.checked
          ? `🎙️ ${targetUser.name} agora pode entrar Ao Vivo na Rádio!`
          : `Permissão de Rádio Ao Vivo removida de ${targetUser.name}.`;
      }
    });
  });

  rootElement.querySelectorAll(".reset-user-pass-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const userId = btn.dataset.userId;
      const targetUser = appState.users.find((u) => u.id === userId);
      if (!targetUser) return;
      const newPass = prompt(
        `Digite a NOVA SENHA para "${targetUser.name}" (${targetUser.login}):`,
        "1234"
      );
      if (!newPass || newPass.trim().length < 4) {
        if (newPass !== null) alert("A senha precisa ter pelo menos 4 caracteres.");
        return;
      }
      const cleanPass = newPass.trim();
      targetUser.passwordHash = await hashPassword(cleanPass);
      await saveAppState();

      const phoneDigits = onlyDigits(targetUser.phone);
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) {
        feedback.textContent = `🔑 Senha de ${targetUser.name} alterada para "${cleanPass}"!`;
      }
      if (phoneDigits && confirm(`Senha alterada para "${cleanPass}"! Deseja abrir o WhatsApp de ${targetUser.name} para enviar a nova senha agora?`)) {
        const waNum = phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`;
        const msg = `Olá *${targetUser.name}*! Seu acesso no *APPIGREJA* foi atualizado:

📧 *E-mail:* ${targetUser.login}
🔑 *Nova Senha:* ${cleanPass}`;
        window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(msg)}`, "_blank");
      } else {
        alert(`Senha de ${targetUser.name} alterada com sucesso para: ${cleanPass}`);
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

// Renderização da Página Meu Perfil + Carteira Digital + Fichas da Secretaria/ADM
function renderProfilePage() {
  if (!currentUser) return;
  const form = document.querySelector("#profile-form");
  if (form) {
    const fields = {
      "#prof-name": currentUser.name,
      "#prof-member-card": currentUser.memberCard,
      "#prof-cpf": currentUser.cpf,
      "#prof-birth": currentUser.birthDate,
      "#prof-phone": currentUser.phone,
      "#prof-baptism": currentUser.baptismDate,
      "#prof-address": currentUser.address,
    };
    Object.entries(fields).forEach(([sel, val]) => {
      const input = document.querySelector(sel);
      if (input && document.activeElement !== input) input.value = val || "";
    });
  }

  const cardPreview = document.querySelector("#member-card-preview");
  if (cardPreview) {
    const subRoleText =
      currentUser.subRoleId && currentUser.subRoleId !== "nenhum"
        ? SUBROLE_LABELS[currentUser.subRoleId]
        : ROLE_LABELS[currentUser.roleId] || currentUser.role;

    cardPreview.innerHTML = `
      <div class="member-badge-card">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid rgba(255,255,255,0.18); padding-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="brand-mark" style="width: 38px; height: 38px; flex-basis: 38px;">${getLogoHtml()}</div>
            <div>
              <strong style="display: block; font-size: 14px;">${escapeHtml(currentUser.church)}</strong>
              <small style="opacity: 0.8;">${escapeHtml(currentUser.pastor)}</small>
            </div>
          </div>
          <span class="tag" style="background: #f3b743; color: #18342f;">${escapeHtml(currentUser.memberCard || "IGR-0001")}</span>
        </div>

        <div style="display: flex; align-items: center; gap: 14px;">
          ${getAvatarHtml(currentUser, 68)}
          <div>
            <strong style="font-size: 18px; display: block;">${escapeHtml(currentUser.name)}</strong>
            <span style="display: inline-block; margin-top: 4px; padding: 3px 8px; border-radius: 6px; background: rgba(255,255,255,0.15); font-size: 12px; font-weight: 800;">
              ${escapeHtml(ROLE_LABELS[currentUser.roleId])} • ${escapeHtml(subRoleText)}
            </span>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; background: rgba(0,0,0,0.18); padding: 10px; border-radius: 8px;">
          <div><span style="opacity:0.75;">Aniversário:</span><br/><strong>${escapeHtml(formatDate(currentUser.birthDate) || "Não informado")}</strong></div>
          <div><span style="opacity:0.75;">Batismo/Membro:</span><br/><strong>${escapeHtml(formatDate(currentUser.baptismDate) || "Não informado")}</strong></div>
          <div><span style="opacity:0.75;">CPF (Restrito):</span><br/><strong>${escapeHtml(currentUser.cpf || "Não informado")}</strong></div>
          <div><span style="opacity:0.75;">WhatsApp:</span><br/><strong>${escapeHtml(currentUser.phone || "Não informado")}</strong></div>
        </div>
      </div>
    `;
  }

  const secPanel = document.querySelector("#secretaria-members-panel");
  const secList = document.querySelector("#secretaria-members-list");
  const secCount = document.querySelector("#secretaria-count");
  if (!secPanel || !secList) return;

  if (!canViewSecretariaData()) {
    secPanel.style.display = "none";
    return;
  }

  secPanel.style.display = "block";
  if (secCount) secCount.textContent = String(appState.users.length);

  const query = (document.querySelector("#secretaria-search")?.value || "").toLowerCase();
  const filtered = appState.users.filter((u) => {
    const text = `${u.name} ${u.login} ${u.cpf || ""} ${u.memberCard || ""} ${u.church}`.toLowerCase();
    return !query || text.includes(query);
  });

  secList.innerHTML = filtered.length
    ? filtered
        .map(
          (u) => `
        <article class="visit-item" style="grid-template-columns: minmax(0, 1fr);">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              ${getAvatarHtml(u, 52)}
              <div>
                <div class="tag-row">
                  <span class="tag">${escapeHtml(u.memberCard || "Sem Nº")}</span>
                  <span class="tag">${escapeHtml(ROLE_LABELS[u.roleId])}</span>
                  <span class="status-pill">${escapeHtml(SUBROLE_LABELS[u.subRoleId || "nenhum"])}</span>
                  <span class="tag">${escapeHtml(u.church)}</span>
                </div>
                <h3 style="margin-top: 4px;">${escapeHtml(u.name)}</h3>
                <small style="color: var(--muted);">E-mail: ${escapeHtml(u.login)} | WhatsApp: ${escapeHtml(u.phone || "Não informado")}</small>
              </div>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 10px; padding: 10px; background: #f4f6f3; border-radius: 6px; font-size: 13px;">
            <div><strong>CPF:</strong> ${escapeHtml(u.cpf || "Não preenchido")}</div>
            <div><strong>Aniversário:</strong> ${escapeHtml(formatDate(u.birthDate) || "Não preenchido")}</div>
            <div><strong>Batismo:</strong> ${escapeHtml(formatDate(u.baptismDate) || "Não preenchido")}</div>
            <div style="grid-column: 1 / -1;"><strong>Endereço Residencial:</strong> ${escapeHtml(u.address || "Não preenchido")}</div>
          </div>
        </article>
      `
        )
        .join("")
    : emptyCard("Nenhum membro encontrado para esta busca.");
}

// Renderização da Rádio Ao Vivo (Sincroniza tanto a página quanto o Popup Flutuante)
function renderRadioPage() {
  const live = appState.radioLive || { active: false };
  const canBroadcast = canBroadcastRadio();

  // Atualiza barra minimizada do Popup
  const miniBar = document.querySelector("#radio-mini-bar");
  const miniTitle = document.querySelector("#popup-mini-title");
  const miniSub = document.querySelector("#popup-mini-sub");
  const miniListenBtn = document.querySelector("#popup-mini-listen-btn");

  if (miniBar) {
    miniBar.classList.toggle("is-live", Boolean(live.active || isBroadcastingMic));
  }
  if (miniTitle) {
    miniTitle.textContent = isBroadcastingMic
      ? "🎙️ Você está Ao Vivo!"
      : live.active
        ? `🔴 ${live.title || "Rádio Ao Vivo"}`
        : "📻 Rádio Ao Vivo";
  }
  if (miniSub) {
    miniSub.textContent = isBroadcastingMic
      ? "Microfone transmitindo em 2º plano"
      : live.active
        ? `No ar: ${live.speakerName}`
        : isListeningRadio
          ? "Sintonizado (aguardando locutor)"
          : "Toque para abrir o popup";
  }
  if (miniListenBtn) {
    if (isBroadcastingMic) {
      miniListenBtn.textContent = "🔇 Locutor";
      miniListenBtn.disabled = true;
    } else {
      miniListenBtn.disabled = false;
      miniListenBtn.textContent = isListeningRadio ? "🔇 Mudo" : "🔊 Ouvir";
    }
  }

  // Atualiza estúdios (Página e Popup)
  ["#radio-broadcaster-studio", "#popup-radio-broadcaster-studio"].forEach((sel) => {
    const studio = document.querySelector(sel);
    if (studio) studio.style.display = canBroadcast ? "block" : "none";
  });

  // Atualiza badges de status
  ["#radio-status-badge", "#popup-radio-status-badge"].forEach((sel) => {
    const badge = document.querySelector(sel);
    if (!badge) return;
    badge.textContent = live.active ? "🔴 AO VIVO AGORA" : "Offline no momento";
    badge.style.background = live.active ? "#fde8e8" : "#e8f0fb";
    badge.style.color = live.active ? "#b33a30" : "var(--blue)";
  });

  // Atualiza indicadores luminosos
  ["#radio-live-indicator", "#popup-radio-live-indicator"].forEach((sel) => {
    const indicator = document.querySelector(sel);
    if (!indicator) return;
    indicator.style.background = live.active ? "#ef4444" : "#9ca3af";
    indicator.style.boxShadow = live.active ? "0 0 12px #ef4444" : "none";
  });

  const titleEl = document.querySelector("#radio-current-title");
  if (titleEl) {
    titleEl.textContent = live.active ? live.title || "Transmissão Ao Vivo" : "Aguardando início da transmissão";
  }

  ["#radio-speaker-name", "#popup-radio-speaker-name"].forEach((sel) => {
    const speakerEl = document.querySelector(sel);
    if (speakerEl) {
      speakerEl.textContent = live.active ? `🎙️ No ar: ${live.speakerName}` : "Ninguém ao vivo no momento";
    }
  });

  ["#radio-speaker-church", "#popup-radio-speaker-church"].forEach((sel) => {
    const churchEl = document.querySelector(sel);
    if (churchEl) {
      churchEl.textContent = live.active
        ? `${live.speakerChurch} — Continue navegando: o áudio não desliga!`
        : "Você pode minimizar este popup e trocar de aba sem desligar a rádio.";
    }
  });

  ["#stop-broadcast-btn", "#popup-stop-broadcast-btn"].forEach((sel) => {
    const stopBtn = document.querySelector(sel);
    if (stopBtn) {
      stopBtn.style.display = (live.active || isBroadcastingMic) && canBroadcast ? "inline-flex" : "none";
    }
  });

  ["#external-audio-player", "#popup-external-audio-player"].forEach((sel) => {
    const extPlayer = document.querySelector(sel);
    if (!extPlayer) return;
    if (live.active && live.streamUrl && !isBroadcastingMic) {
      extPlayer.style.display = "block";
      if (extPlayer.src !== live.streamUrl) {
        extPlayer.src = live.streamUrl;
      }
    } else {
      extPlayer.style.display = "none";
    }
  });

  // Renderiza o Chat Ao Vivo tanto na página quanto no Popup Flutuante
  const msgs = appState.radioMessages || [];
  const canModerate = isAdmin() || canBroadcast;
  const chatHtml = msgs.length
    ? msgs
        .slice(0, 40)
        .map(
          (m) => `
        <div style="padding: 9px 10px; border: 1px solid var(--line); border-radius: 6px; background: #fbfdfc;">
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:11px; color:var(--muted);">
            <strong>${escapeHtml(m.author)} (${escapeHtml(m.church)})</strong>
            <div style="display:flex; align-items:center; gap:6px;">
              <span>${escapeHtml(m.time)}</span>
              ${
                canModerate
                  ? `<button type="button" class="delete-radio-msg-btn" data-msg-id="${escapeHtml(m.id)}" style="border:0; background:transparent; color:var(--red); font-weight:800; font-size:11px; padding:0 4px; cursor:pointer;" title="Apagar mensagem">✕</button>`
                  : ""
              }
            </div>
          </div>
          <p style="margin: 4px 0 0; font-size: 13px;">${escapeHtml(m.text)}</p>
        </div>
      `
        )
        .join("")
    : emptyCard("Nenhuma mensagem ainda. Seja o primeiro a enviar um Amém!");

  ["#radio-chat-list", "#popup-radio-chat-list"].forEach((sel) => {
    const chatList = document.querySelector(sel);
    if (!chatList) return;
    chatList.innerHTML = chatHtml;
    chatList.querySelectorAll(".delete-radio-msg-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const msgId = btn.dataset.msgId;
        await deleteRadioChatMessage(msgId);
      });
    });
  });
}

let radioChatSyncInterval = null;
let lastRenderedChatSignature = "";
let lastRenderedLiveSignature = "";

async function syncRadioChatAndStatus() {
  const chatEndpoint = getCloudEndpoint("appigreja_radio_chat");
  const liveEndpoint = getCloudEndpoint("appigreja_state/radioLive");
  if (!chatEndpoint) return;

  try {
    const [chatRes, liveRes] = await Promise.all([
      fetch(chatEndpoint, { cache: "no-store" }),
      fetch(liveEndpoint, { cache: "no-store" }),
    ]);

    let shouldRender = false;

    if (chatRes.ok) {
      const remoteMsgs = await chatRes.json();
      const normalizedMsgs = Array.isArray(remoteMsgs)
        ? remoteMsgs
        : remoteMsgs && typeof remoteMsgs === "object"
          ? Object.values(remoteMsgs)
          : [];
      const sig = JSON.stringify(normalizedMsgs);
      if (sig !== lastRenderedChatSignature) {
        lastRenderedChatSignature = sig;
        appState.radioMessages = normalizedMsgs;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
        shouldRender = true;
      }
    }

    if (liveRes.ok) {
      const remoteLive = await liveRes.json();
      if (remoteLive && typeof remoteLive === "object") {
        const liveSig = JSON.stringify(remoteLive);
        if (liveSig !== lastRenderedLiveSignature) {
          lastRenderedLiveSignature = liveSig;
          appState.radioLive = { ...appState.radioLive, ...remoteLive };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
          shouldRender = true;
        }
      }
    }

    if (shouldRender) {
      renderRadioPage();
    }
  } catch (err) {
    // Ignora oscilações momentâneas de rede
  }
}

async function sendRadioChatMessage(text) {
  if (!currentUser || !text) return;
  const chatEndpoint = getCloudEndpoint("appigreja_radio_chat");
  const newMsg = {
    id: `rmsg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    author: currentUser.name,
    church: currentUser.church,
    text,
    time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };

  let currentList = Array.isArray(appState.radioMessages) ? [...appState.radioMessages] : [];
  if (chatEndpoint) {
    try {
      const res = await fetch(chatEndpoint, { cache: "no-store" });
      if (res.ok) {
        const remote = await res.json();
        if (Array.isArray(remote)) {
          currentList = remote;
        } else if (remote && typeof remote === "object") {
          currentList = Object.values(remote);
        }
      }
    } catch {
      // usa lista local se falhar leitura prévia
    }
  }

  currentList.unshift(newMsg);
  currentList = currentList.slice(0, 50);
  appState.radioMessages = currentList;
  lastRenderedChatSignature = JSON.stringify(currentList);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  renderRadioPage();

  if (chatEndpoint) {
    try {
      await fetch(chatEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentList),
      });
      await fetch(getCloudEndpoint("appigreja_state/radioMessages"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentList),
      });
    } catch (err) {
      console.warn("Erro ao sincronizar mensagem do chat:", err);
    }
  }
}

async function deleteRadioChatMessage(msgId) {
  const chatEndpoint = getCloudEndpoint("appigreja_radio_chat");
  let currentList = Array.isArray(appState.radioMessages) ? [...appState.radioMessages] : [];
  currentList = currentList.filter((m) => m.id !== msgId);
  appState.radioMessages = currentList;
  lastRenderedChatSignature = JSON.stringify(currentList);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  renderRadioPage();

  if (chatEndpoint) {
    try {
      await fetch(chatEndpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentList),
      });
      await fetch(getCloudEndpoint("appigreja_state/radioMessages"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentList),
      });
    } catch (err) {
      console.warn("Erro ao excluir mensagem do chat:", err);
    }
  }
}

function startRealtimeRadioSyncLoop() {
  if (radioChatSyncInterval) clearInterval(radioChatSyncInterval);
  syncRadioChatAndStatus();
  radioChatSyncInterval = setInterval(syncRadioChatAndStatus, 2200);
}

// Transmissão Ao Vivo com trava Anti-Eco (Somente Entrada no aparelho locutor)
function setRadioButtonsAndStatus(listenText, listenDisabled, statusText, feedbackText) {
  ["#listen-radio-btn", "#popup-listen-radio-btn"].forEach((sel) => {
    const btn = document.querySelector(sel);
    if (!btn) return;
    if (listenText !== null) btn.textContent = listenText;
    if (typeof listenDisabled === "boolean") {
      btn.disabled = listenDisabled;
      btn.style.opacity = listenDisabled ? "0.5" : "1";
    }
  });
  ["#listener-audio-status", "#popup-listener-audio-status"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && statusText !== null) el.textContent = statusText;
  });
  ["#broadcaster-feedback", "#popup-broadcaster-feedback"].forEach((sel) => {
    const el = document.querySelector(sel);
    if (el && feedbackText !== null) el.textContent = feedbackText;
  });
}

async function startMicrophoneBroadcast() {
  if (!canBroadcastRadio()) return;
  const title =
    document.querySelector("#popup-broadcast-title")?.value.trim() ||
    document.querySelector("#broadcast-title")?.value.trim() ||
    "Palavra Pastoral Ao Vivo";
  const streamUrl =
    document.querySelector("#popup-broadcast-stream-url")?.value.trim() ||
    document.querySelector("#broadcast-stream-url")?.value.trim() ||
    "";

  // 1. Trava imediatamente qualquer saída de áudio neste aparelho (Modo Somente Entrada de Voz)
  isListeningRadio = false;
  isBroadcastingMic = true;
  if (currentPlayingAudio) {
    currentPlayingAudio.pause();
    currentPlayingAudio = null;
  }
  const extPlayer = document.querySelector("#external-audio-player");
  if (extPlayer) {
    extPlayer.pause();
    extPlayer.muted = true;
  }

  setRadioButtonsAndStatus(
    "🔇 Saída Mutada (Modo Locutor)",
    true,
    "Somente entrada de voz ativa neste aparelho (saída desligada para evitar retorno/eco).",
    null
  );

  appState.radioLive = {
    active: true,
    title,
    speakerName: currentUser.name,
    speakerChurch: `${currentUser.church} (${ROLE_LABELS[currentUser.roleId]})`,
    streamUrl,
    updatedAt: Date.now(),
  };
  await saveAppState();
  renderRadioPage();

  if (streamUrl) {
    setRadioButtonsAndStatus(null, null, null, "🔴 Rádio Ao Vivo iniciada com Link de Stream!");
    return;
  }

  try {
    // 2. Ativa o microfone com Cancelamento de Eco e Supressão de Ruído nativos
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      video: false,
    });

    setRadioButtonsAndStatus(null, null, null, "🔴 MICROFONE NO AR (Somente Entrada)! Você pode minimizar o popup e navegar pelas abas.");

    const recordAndSendChunk = () => {
      if (!micStream || !isBroadcastingMic || !appState.radioLive?.active) return;
      const recorder = new MediaRecorder(micStream);
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        if (!chunks.length || !isBroadcastingMic) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const endpoint = getCloudEndpoint("appigreja_radio_chunk");
          if (!endpoint) return;
          try {
            await fetch(endpoint, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id: Date.now(),
                deviceId: DEVICE_INSTANCE_ID,
                speaker: currentUser.name,
                audioUrl: String(reader.result || ""),
              }),
            });
          } catch (err) {
            console.warn("Falha no envio de chunk de áudio:", err);
          }
        };
        reader.readAsDataURL(blob);
      };
      recorder.start();
      setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 2400);
    };

    recordAndSendChunk();
    if (micRecorderInterval) clearInterval(micRecorderInterval);
    micRecorderInterval = setInterval(recordAndSendChunk, 2500);
  } catch (err) {
    isBroadcastingMic = false;
    setRadioButtonsAndStatus(null, null, null, "Permissão de microfone negada no navegador. Libere o microfone no cadeado da barra de endereços!");
  }
}

async function stopBroadcast() {
  isBroadcastingMic = false;
  if (micRecorderInterval) {
    clearInterval(micRecorderInterval);
    micRecorderInterval = null;
  }
  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
  }

  // Limpa o último pacote de áudio da nuvem ao encerrar para ninguém ouvir sobra
  const chunkEndpoint = getCloudEndpoint("appigreja_radio_chunk");
  if (chunkEndpoint) {
    fetch(chunkEndpoint, { method: "DELETE" }).catch(() => {});
  }

  appState.radioLive = {
    active: false,
    title: "",
    speakerName: "",
    speakerChurch: "",
    streamUrl: "",
    updatedAt: Date.now(),
  };
  await saveAppState();

  setRadioButtonsAndStatus(
    "🔊 Conectar Áudio para Ouvir",
    false,
    "Transmissão encerrada. Toque no botão amarelo se quiser ouvir outra pessoa.",
    "⏹️ Transmissão encerrada e microfone desligado."
  );
  renderRadioPage();
}

function startListeningRadioLoop() {
  if (isBroadcastingMic) {
    setRadioButtonsAndStatus(
      null,
      null,
      "🔇 Você está transmitindo neste aparelho! A saída de som fica desligada aqui para evitar retorno.",
      null
    );
    return;
  }

  isListeningRadio = !isListeningRadio;
  const extPlayer = document.querySelector("#popup-external-audio-player") || document.querySelector("#external-audio-player");

  if (!isListeningRadio) {
    if (currentPlayingAudio) {
      currentPlayingAudio.pause();
      currentPlayingAudio = null;
    }
    if (extPlayer) extPlayer.pause();
    setRadioButtonsAndStatus("🔊 Conectar Áudio para Ouvir", false, "🔇 Áudio silenciado neste aparelho.", null);
    renderRadioPage();
    return;
  }

  setRadioButtonsAndStatus("🔇 Silenciar Rádio neste Aparelho", false, "✅ Sintonizado! Você pode trocar de aba livremente.", null);
  renderRadioPage();

  if (extPlayer && appState.radioLive?.streamUrl) {
    extPlayer.muted = false;
    extPlayer.play().catch(() => {});
  }

  if (radioListenerInterval) clearInterval(radioListenerInterval);
  radioListenerInterval = setInterval(async () => {
    if (!isListeningRadio || isBroadcastingMic) return;

    const endpoint = getCloudEndpoint("appigreja_radio_chunk");
    if (!endpoint) return;
    try {
      const res = await fetch(endpoint, { cache: "no-store" });
      if (!res.ok) return;
      const chunk = await res.json();

      if (!chunk || !chunk.id || chunk.deviceId === DEVICE_INSTANCE_ID) return;

      if (chunk.id !== lastPlayedChunkId && Date.now() - chunk.id < 15000) {
        lastPlayedChunkId = chunk.id;
        if (chunk.audioUrl && !isBroadcastingMic) {
          if (currentPlayingAudio) {
            currentPlayingAudio.pause();
          }
          currentPlayingAudio = new Audio(chunk.audioUrl);
          currentPlayingAudio.play().catch(() => {});
          setRadioButtonsAndStatus(null, null, `🔊 Ouvindo ao vivo: ${chunk.speaker || "Locutor"}`, null);
        }
      }
    } catch {
      // ignora oscilações de rede
    }
  }, 1800);
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
  applyChurchLogoEverywhere();
  enhancePasswordInputs(document);
  renderUsersRoleManager();
  renderProfilePage();
  renderRadioPage();
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

function injectAuthRecoveryUI() {
  const authTabs = document.querySelector(".auth-tabs");
  if (authTabs && !document.querySelector("#show-recover")) {
    authTabs.style.gridTemplateColumns = "1fr 1fr 1fr";
    authTabs.insertAdjacentHTML(
      "beforeend",
      `<button type="button" id="show-recover">Recuperar Senha</button>`
    );
  }

  // Adiciona link "Esqueci minha senha" embaixo do campo de senha no Login
  const loginForm = document.querySelector("#login-form");
  if (loginForm && !document.querySelector("#forgot-pass-trigger")) {
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.insertAdjacentHTML(
        "beforebegin",
        `<button type="button" class="forgot-link-btn" id="forgot-pass-trigger">🔑 Esqueci minha senha / Recuperar acesso</button>`
      );
    }
  }

  // Adiciona campo de WhatsApp no Cadastro inicial (se ainda não existir) para facilitar recuperação futura
  const registerForm = document.querySelector("#register-form");
  if (registerForm && !registerForm.querySelector('input[name="phone"]')) {
    const loginLabel = registerForm.querySelector('input[name="login"]')?.closest("label");
    if (loginLabel) {
      loginLabel.insertAdjacentHTML(
        "afterend",
        `<label>
          WhatsApp / Telefone (Para recuperar senha)
          <input name="phone" type="tel" placeholder="(19) 99999-9999" autocomplete="tel" />
        </label>`
      );
    }
  }

  // Injeta o formulário completo de Recuperação de Senha (por E-mail ou WhatsApp do perfil)
  if (registerForm && !document.querySelector("#recover-form")) {
    const recoverHtml = `
      <form class="auth-form" id="recover-form">
        <label>
          Digite seu E-mail ou WhatsApp cadastrado no Perfil
          <input id="recover-identifier" name="identifier" type="text" placeholder="seuemail@exemplo.com ou (19) 99999-9999" required />
        </label>
        <button class="secondary-button" type="submit" id="recover-search-btn">🔍 Localizar Meu Cadastro</button>

        <div id="recover-result-area" style="display: none;"></div>
      </form>
    `;
    registerForm.insertAdjacentHTML("afterend", recoverHtml);
  }

  enhancePasswordInputs(document);
}

function wireAuth() {
  injectAuthRecoveryUI();

  document.querySelector("#show-login")?.addEventListener("click", () => showAuthMode("login"));
  document.querySelector("#show-register")?.addEventListener("click", () => showAuthMode("register"));
  document.querySelector("#show-recover")?.addEventListener("click", () => showAuthMode("recover"));
  document.querySelector("#forgot-pass-trigger")?.addEventListener("click", () => {
    const currentEmail = document.querySelector('#login-form input[name="login"]')?.value || "";
    showAuthMode("recover");
    const recInput = document.querySelector("#recover-identifier");
    if (recInput && currentEmail) {
      recInput.value = currentEmail;
    }
  });

  // Lógica de Recuperar Senha buscando do Perfil (E-mail ou WhatsApp)
  let recoveredUser = null;
  document.querySelector("#recover-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const rawQuery = String(document.querySelector("#recover-identifier")?.value || "").trim();
    const resultArea = document.querySelector("#recover-result-area");
    if (!rawQuery || !resultArea) return;

    setAuthMessage("Buscando seu cadastro no banco de dados...", "info");
    await syncFromCloud();

    const cleanEmail = normalizeEmail(rawQuery);
    const digits = onlyDigits(rawQuery);

    recoveredUser = appState.users.find((u) => {
      const matchEmail = normalizeEmail(u.loginKey || u.login) === cleanEmail;
      const userPhoneDigits = onlyDigits(u.phone);
      const matchPhone = digits.length >= 8 && userPhoneDigits.length >= 8 && (userPhoneDigits.endsWith(digits) || digits.endsWith(userPhoneDigits));
      return matchEmail || matchPhone;
    });

    if (!recoveredUser) {
      resultArea.style.display = "none";
      setAuthMessage("Nenhum cadastro encontrado com esse E-mail ou WhatsApp.", "error");
      return;
    }

    setAuthMessage("Cadastro localizado! Escolha abaixo como recuperar seu acesso:", "success");
    const hasPhone = onlyDigits(recoveredUser.phone).length >= 8;

    resultArea.style.display = "block";
    resultArea.innerHTML = `
      <div class="recovery-result-box">
        <div>
          <strong style="font-size: 16px; display: block;">👤 ${escapeHtml(recoveredUser.name)}</strong>
          <small style="display: block; color: var(--muted);">E-mail: ${escapeHtml(recoveredUser.login)} | Igreja: ${escapeHtml(recoveredUser.church)}</small>
          <small style="display: block; color: var(--teal); font-weight: 700;">WhatsApp no perfil: ${escapeHtml(recoveredUser.phone || "Não cadastrado no perfil")}</small>
        </div>

        <label style="font-size: 13px; color: var(--ink); font-weight: 800;">
          Criar Nova Senha Agora (Toque no 👁️ para ver a senha)
          <input id="recover-new-pass" type="password" minlength="4" placeholder="Digite sua nova senha (mín. 4 dígitos)" />
        </label>

        <button class="primary-button" type="button" id="recover-save-now-btn">
          ✅ Salvar Nova Senha e Entrar Agora
        </button>

        <div style="border-top: 1px solid var(--line); padding-top: 10px; display: grid; gap: 8px;">
          <small style="color: var(--muted); font-weight: 700;">Ou receba uma senha temporária pelos canais do seu perfil:</small>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            ${
              hasPhone
                ? `<button class="secondary-button" type="button" id="recover-send-whatsapp-btn" style="flex: 1; font-size: 12px;">📲 Receber via WhatsApp</button>`
                : ""
            }
            <button class="secondary-button" type="button" id="recover-send-email-btn" style="flex: 1; font-size: 12px;">📧 Receber via E-mail</button>
          </div>
        </div>
      </div>
    `;

    enhancePasswordInputs(resultArea);

    resultArea.querySelector("#recover-save-now-btn")?.addEventListener("click", async () => {
      const newPass = String(resultArea.querySelector("#recover-new-pass")?.value || "").trim();
      if (newPass.length < 4) {
        setAuthMessage("Digite uma nova senha com pelo menos 4 caracteres.", "error");
        return;
      }
      recoveredUser.passwordHash = await hashPassword(newPass);
      await saveAppState();
      setAuthMessage("Senha atualizada com sucesso! Entrando...", "success");
      authenticateAs(recoveredUser);
    });

    resultArea.querySelector("#recover-send-whatsapp-btn")?.addEventListener("click", async () => {
      const tempPass = String(Math.floor(100000 + Math.random() * 900000));
      recoveredUser.passwordHash = await hashPassword(tempPass);
      await saveAppState();
      const phoneDigits = onlyDigits(recoveredUser.phone);
      const waNum = phoneDigits.startsWith("55") ? phoneDigits : `55${phoneDigits}`;
      const text = `Olá *${recoveredUser.name}*! Aqui está sua senha de recuperação do *APPIGREJA*:

📧 *E-mail:* ${recoveredUser.login}
🔑 *Senha Temporária:* ${tempPass}`;
      window.open(`https://wa.me/${waNum}?text=${encodeURIComponent(text)}`, "_blank");
      setAuthMessage(`Senha temporária (${tempPass}) gerada e enviada para o seu WhatsApp!`, "success");
    });

    resultArea.querySelector("#recover-send-email-btn")?.addEventListener("click", async () => {
      const tempPass = String(Math.floor(100000 + Math.random() * 900000));
      recoveredUser.passwordHash = await hashPassword(tempPass);
      await saveAppState();
      const subject = "Recuperação de Senha - APPIGREJA";
      const body = `Olá ${recoveredUser.name},

Seus dados de acesso ao APPIGREJA foram atualizados:
E-mail: ${recoveredUser.login}
Nova Senha Temporária: ${tempPass}

Você pode alterar essa senha a qualquer momento no aplicativo.`;
      window.location.href = `mailto:${recoveredUser.login}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setAuthMessage(`Senha temporária (${tempPass}) gerada! Verifique seu aplicativo de e-mail.`, "success");
    });
  });

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
    const rawPass = String(form.get("password") || "").trim();

    const user = {
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(rawPass),
      roleId,
      role: ROLE_LABELS[roleId] || "Obreiro",
      subRoleId: "nenhum",
      subRole: SUBROLE_LABELS.nenhum,
      canBroadcast: roleId === "adm",
      churchId,
      church: church.name,
      pastor: church.pastor,
      pastorId: church.pastorId,
      memberCard: `IGR-${String(appState.users.length + 1).padStart(4, "0")}`,
      photoUrl: "",
      cpf: "",
      birthDate: "",
      phone: String(form.get("phone") || "").trim(),
      baptismDate: "",
      address: "",
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

    const rawLogin = String(form.get("login") || "").trim();
    const loginKey = normalizeEmail(rawLogin);
    const loginDigits = onlyDigits(rawLogin);

    const user = appState.users.find((item) => {
      const emailMatch = normalizeEmail(item.loginKey || item.login) === loginKey;
      const phoneDigits = onlyDigits(item.phone);
      const phoneMatch = loginDigits.length >= 8 && phoneDigits.length >= 8 && (phoneDigits.endsWith(loginDigits) || loginDigits.endsWith(phoneDigits));
      return emailMatch || phoneMatch;
    });

    if (!user) {
      setAuthMessage("E-mail não encontrado no sistema. Confira a digitação ou use Recuperar Senha.", "error");
      return;
    }

    const rawPassword = String(form.get("password") || "");
    const isPasswordValid = await verifyUserPassword(rawPassword, user);
    if (!isPasswordValid) {
      setAuthMessage("Senha incorreta. Toque no 👁️ para conferir o que digitou ou clique em 'Esqueci minha senha'.", "error");
      return;
    }

    // Atualiza o hash para o padrão SHA-256 caso estivesse em formato antigo
    user.passwordHash = await hashPassword(rawPassword.trim() || rawPassword);
    await saveAppState();

    formElement.reset();
    authenticateAs(user);
  });
}

let globalNavWired = false;

function wireSeamlessLinkInterception() {
  if (globalNavWired) return;
  globalNavWired = true;

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;
    const href = link.getAttribute("href") || "";
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("data:") || link.hasAttribute("download")) {
      return;
    }
    if (href.startsWith("#")) return;
    if (href.includes(".html")) {
      event.preventDefault();
      navigateToPageSeamless(href, true);
    }
  });

  window.addEventListener("popstate", () => {
    const pathPage = decodeURIComponent(window.location.pathname.split("/").pop() || "");
    if (pathPage && pathPage.endsWith(".html") && pathPage !== "index.html") {
      navigateToPageSeamless(pathPage, false);
    }
  });
}

function wirePageContentEvents() {
  document.querySelector("#logout-button")?.addEventListener("click", logout);
  document.querySelector("#reset-db-btn")?.addEventListener("click", resetEntireDatabase);

  // Upload da Logo da Igreja pelo ADM
  document.querySelector("#upload-church-logo-input")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const compressedLogo = await compressImageFile(file, 220);
    if (compressedLogo) {
      appState.churchLogo = compressedLogo;
      await saveAppState();
      applyChurchLogoEverywhere();
      const fb = document.querySelector("#role-save-feedback");
      if (fb) fb.textContent = "🖼️ Logo da Igreja atualizado em todo o aplicativo!";
    }
  });

  // Upload da Foto de Perfil do Usuário em perfil.html
  document.querySelector("#profile-photo-input")?.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;
    const compressedPhoto = await compressImageFile(file, 260);
    if (compressedPhoto) {
      currentUser.photoUrl = compressedPhoto;
      await saveAppState();
      const fb = document.querySelector("#profile-feedback");
      if (fb) fb.textContent = "📷 Foto de perfil atualizada!";
      renderAll();
    }
  });

  // Salvar Dados Cadastrais do Perfil (Carteira de Membro, CPF, Aniversário, Endereço)
  document.querySelector("#profile-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const form = new FormData(event.currentTarget);
    currentUser.name = String(form.get("name") || currentUser.name).trim();
    currentUser.memberCard = String(form.get("memberCard") || "").trim();
    currentUser.cpf = String(form.get("cpf") || "").trim();
    currentUser.birthDate = String(form.get("birthDate") || "");
    currentUser.phone = String(form.get("phone") || "").trim();
    currentUser.baptismDate = String(form.get("baptismDate") || "");
    currentUser.address = String(form.get("address") || "").trim();

    await saveAppState();
    const fb = document.querySelector("#profile-feedback");
    if (fb) fb.textContent = "✅ Dados do perfil e carteira salvos com sucesso!";
    renderAll();
  });

  document.querySelector("#secretaria-search")?.addEventListener("input", renderProfilePage);

  // Eventos da Rádio Ao Vivo
  document.querySelector("#start-mic-broadcast-btn")?.addEventListener("click", startMicrophoneBroadcast);
  document.querySelector("#stop-broadcast-btn")?.addEventListener("click", stopBroadcast);
  document.querySelector("#listen-radio-btn")?.addEventListener("click", startListeningRadioLoop);

  document.querySelector("#radio-chat-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!currentUser) return;
    const formEl = event.currentTarget;
    const form = new FormData(formEl);
    const text = String(form.get("text") || "").trim();
    if (!text) return;
    formEl.reset();
    await sendRadioChatMessage(text);
  });

  document.querySelector("#promote-self-adm")?.addEventListener("click", async () => {
    if (!currentUser) return;
    currentUser.roleId = "adm";
    currentUser.role = ROLE_LABELS.adm;
    currentUser.canBroadcast = true;
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
    const subRoleId = form.get("subRoleId") || "nenhum";

    appState.users.push({
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(String(form.get("password"))),
      roleId,
      role: ROLE_LABELS[roleId] || "Obreiro",
      subRoleId,
      subRole: SUBROLE_LABELS[subRoleId] || "Sem subcargo específico",
      canBroadcast: roleId === "adm" || subRoleId === "pastor_adm",
      churchId,
      church: church.name,
      pastor: church.pastor,
      pastorId: church.pastorId,
      memberCard: `IGR-${String(appState.users.length + 1).padStart(4, "0")}`,
      photoUrl: "",
      cpf: "",
      birthDate: "",
      phone: "",
      baptismDate: "",
      address: "",
      createdAt: new Date().toISOString(),
    });

    await saveAppState();
    formElement.reset();
    if (msgEl) msgEl.textContent = "Pessoa cadastrada com cargo e subcargo!";
    renderAll();
  });

  const globalSearch = document.querySelector("#global-search");
  globalSearch?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && getCurrentPage() !== "visitas.html") {
      navigateToPageSeamless(`visitas.html?q=${encodeURIComponent(globalSearch.value.trim())}`);
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
    navigateToPageSeamless(getHomePageForUser(currentUser));
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
  applyChurchLogoEverywhere();
  const currentPage = getCurrentPage();
  const savedUserId = localStorage.getItem(SESSION_KEY);
  currentUser = appState.users.find((user) => user.id === savedUserId) || null;

  if (currentPage === "index.html") {
    wireAuth();
    showAuthMode("login");
    await syncFromCloud();
    applyChurchLogoEverywhere();
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
  injectRadioPopupWidget();
  wireSeamlessLinkInterception();
  wirePageContentEvents();
  renderAll();

  await syncFromCloud();
  startRealtimeRadioSyncLoop();
}

initApp();
