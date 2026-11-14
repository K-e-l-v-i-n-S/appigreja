const STORAGE_KEY = "appigreja_prototype_state_v1";
const SESSION_KEY = "appigreja_prototype_session_v1";
const CLOUD_INIT_KEY = "appigreja_cloud_initialized_v1";
const SEEN_ALERTS_KEY = "appigreja_seen_alerts_v1";

// LINK DO SEU FIREBASE REALTIME DATABASE JÁ CONFIGURADO:
const CLOUD_DB_URL = "https://appigreja-1f504-default-rtdb.firebaseio.com";

// Logotipo Oficial Embutido da Carteirinha (Igreja Evangélica Restauração)
const IER_CARD_LOGO_DATA_URL = "data:image/png;base64,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";

// Identificador único desta aba/aparelho para nunca reproduzir a própria voz no aparelho que transmite
const DEVICE_INSTANCE_ID = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const DEFAULT_CHURCHES = {
  sede: { name: "Igreja Sede", pastor: "Bispo Wagner", pastorId: "bispo-wagner" },
  campineiro: { name: "Igreja Campineiro", pastor: "Pastora Lindamir", pastorId: "pra-lindamir" },
  mogi: { name: "Igreja Mogi Guaçu", pastor: "Pastor Paulo", pastorId: "pr-paulo" },
};

const DEFAULT_ROLE_LABELS = {
  obreiro: "Obreiro",
  lideranca: "Liderança",
  secretaria_local: "Secretaria Local (Igreja)",
  secretaria_sede: "Secretaria Sede (Geral)",
  pastor: "Pastor",
  adm_igreja: "ADM de Igreja",
  bispo: "Bispo",
  adm: "ADM Geral",
};

// SUBCARGOS E FUNÇÕES MINISTERIAIS PADRÃO (Suporta múltiplos subcargos por pessoa)
const DEFAULT_SUBROLE_LABELS = {
  nenhum: "Sem subcargo específico",
  secretaria_sede: "SECRETARIA SEDE (GERAL)",
  secretaria_local: "SECRETARIA LOCAL (IGREJA)",
  secretaria_campineiro: "SECRETARIA CAMPINEIRO",
  secretaria_mogi: "SECRETARIA MOGI GUAÇU",
  adm_igreja: "ADM DE IGREJA LOCAL",
  pastor_adm: "PASTOR ADM",
  pastor_aux: "PASTOR AUX",
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

let CHURCHES = { ...DEFAULT_CHURCHES };
let ROLE_LABELS = { ...DEFAULT_ROLE_LABELS };
let SUBROLE_LABELS = { ...DEFAULT_SUBROLE_LABELS };

const ALL_ROLES = [
  "obreiro",
  "lideranca",
  "secretaria",
  "secretaria_local",
  "secretaria_sede",
  "pastor",
  "adm_igreja",
  "bispo",
  "adm",
];

const PAGE_PERMISSIONS = {
  "dashboard.html": ["secretaria", "secretaria_local", "secretaria_sede", "pastor", "adm_igreja", "bispo", "adm"],
  "visitas.html": ALL_ROLES,
  "nova-visita.html": ALL_ROLES,
  "zaqueus.html": ALL_ROLES,
  "calendario.html": ALL_ROLES,
  "biblioteca.html": ALL_ROLES,
  "visao.html": ["lideranca", "secretaria", "secretaria_local", "secretaria_sede", "pastor", "adm_igreja", "bispo", "adm"],
  "notificacoes.html": ALL_ROLES,
  "perfil.html": ALL_ROLES,
  "radio.html": ALL_ROLES,
};

const NAV_ITEMS = [
  { href: "dashboard.html", icon: "D", label: "Dashboard & Cargos", roles: ["secretaria", "secretaria_local", "secretaria_sede", "pastor", "adm_igreja", "bispo", "adm"] },
  { href: "perfil.html", icon: "P", label: "Meu Perfil", roles: ALL_ROLES },
  { href: "radio.html", icon: "R", label: "Rádio Ao Vivo", roles: ALL_ROLES },
  { href: "visitas.html", icon: "V", label: "Visitas realizadas", roles: ALL_ROLES },
  { href: "nova-visita.html", icon: "+", label: "Nova visita", roles: ALL_ROLES },
  { href: "zaqueus.html", icon: "Z", label: "Zaqueus", roles: ALL_ROLES },
  { href: "calendario.html", icon: "C", label: "Calendário Igreja", roles: ALL_ROLES },
  { href: "biblioteca.html", icon: "B", label: "Biblioteca", roles: ALL_ROLES },
  { href: "visao.html", icon: "G", label: "Visão Geral", roles: ["lideranca", "secretaria", "secretaria_local", "secretaria_sede", "pastor", "adm_igreja", "bispo", "adm"] },
  { href: "notificacoes.html", icon: "N", label: "Notificações", roles: ALL_ROLES },
];

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

let appState = loadAppState();
let currentUser = null;

// Variáveis de controle da Rádio Ao Vivo Multi-Locutores (Somente Saída do Mic / Zero Alto-Falante)
let micStream = null;
let micRecorderInterval = null;
let isBroadcastingMic = false;
let isMicPausedForListening = false;
let isHeadsetCoHostMode = false;
let isListeningRadio = false;
let radioListenerInterval = null;
let currentPlayingAudio = null;
let lastPlayedChunkId = 0;
let lastPlayedChunkByDevice = {};
let audioPlaybackQueue = [];
let isPlayingQueueItem = false;

function emptyState() {
  return {
    churchLogo: "",
    customChurches: {},
    customRoles: {},
    customSubRoles: {},
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
      speakers: {},
    },
    radioMessages: [],
  };
}

function getActiveRadioSpeakers(liveObj = appState.radioLive) {
  if (!liveObj || typeof liveObj !== "object") return [];
  const rawSpeakers = liveObj.speakers && typeof liveObj.speakers === "object" ? Object.values(liveObj.speakers) : [];
  const now = Date.now();
  // Mantém locutores que enviaram sinal recentemente (últimos 60 segundos) ou que estão ativos
  const activeList = rawSpeakers.filter((sp) => sp && sp.name && (!sp.lastActiveAt || now - Number(sp.lastActiveAt) < 60000));
  if (activeList.length > 0) return activeList;
  if (liveObj.active && liveObj.speakerName) {
    return [{ deviceId: "legacy", userId: "", name: liveObj.speakerName, church: liveObj.speakerChurch || "" }];
  }
  return [];
}

function refreshDynamicCatalogs(stateObj = appState) {
  CHURCHES = { ...DEFAULT_CHURCHES, ...(stateObj?.customChurches || {}) };
  SUBROLE_LABELS = { ...DEFAULT_SUBROLE_LABELS, ...(stateObj?.customSubRoles || {}) };

  const extraRoles = {};
  Object.entries(stateObj?.customRoles || {}).forEach(([k, val]) => {
    extraRoles[k] = typeof val === "object" ? val.label : String(val);
    if (!ALL_ROLES.includes(k)) ALL_ROLES.push(k);
    const scope = typeof val === "object" ? val.scope : "local_admin";
    if (["global_admin", "local_admin"].includes(scope)) {
      if (!PAGE_PERMISSIONS["dashboard.html"].includes(k)) PAGE_PERMISSIONS["dashboard.html"].push(k);
      if (!NAV_ITEMS[0].roles.includes(k)) NAV_ITEMS[0].roles.push(k);
    }
    if (["global_admin", "local_admin", "lideranca"].includes(scope)) {
      if (!PAGE_PERMISSIONS["visao.html"].includes(k)) PAGE_PERMISSIONS["visao.html"].push(k);
      const visaoNav = NAV_ITEMS.find((n) => n.href === "visao.html");
      if (visaoNav && !visaoNav.roles.includes(k)) visaoNav.roles.push(k);
    }
  });
  ROLE_LABELS = { ...DEFAULT_ROLE_LABELS, ...extraRoles };
}

function slugifyKey(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeChurchId(id) {
  if (id === "norte") return "campineiro";
  if (id === "leste") return "mogi";
  return CHURCHES[id] ? id : "sede";
}

function getUserSubRoleList(user) {
  if (!user) return [];
  const rawList = Array.isArray(user.subRoleIds)
    ? user.subRoleIds
    : user.subRoleId && user.subRoleId !== "nenhum"
      ? [user.subRoleId]
      : [];
  return Array.from(new Set(rawList.filter((k) => k && k !== "nenhum" && SUBROLE_LABELS[k])));
}

function getUserSubRolesText(user) {
  const list = getUserSubRoleList(user);
  if (!list.length) return "Sem subcargo específico";
  return list.map((k) => SUBROLE_LABELS[k]).join(" • ");
}

function userHasAnySubRole(user, keys = []) {
  const list = getUserSubRoleList(user);
  return keys.some((k) => list.includes(k));
}

function normalizeStateData(raw) {
  const base = emptyState();
  const parsed = raw || {};
  const state = {
    churchLogo: parsed.churchLogo || "",
    customChurches: parsed.customChurches && typeof parsed.customChurches === "object" ? parsed.customChurches : {},
    customRoles: parsed.customRoles && typeof parsed.customRoles === "object" ? parsed.customRoles : {},
    customSubRoles: parsed.customSubRoles && typeof parsed.customSubRoles === "object" ? parsed.customSubRoles : {},
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

  refreshDynamicCatalogs(state);

  state.users.forEach((u, index) => {
    u.churchId = normalizeChurchId(u.churchId);
    u.church = CHURCHES[u.churchId].name;
    u.pastor = CHURCHES[u.churchId].pastor;
    u.pastorId = CHURCHES[u.churchId].pastorId;

    // Migra 'secretaria' antiga para 'secretaria_sede' ou 'secretaria_local'
    if (u.roleId === "secretaria") {
      u.roleId = u.churchId === "sede" ? "secretaria_sede" : "secretaria_local";
    }
    if (!ROLE_LABELS[u.roleId]) u.roleId = "obreiro";
    u.role = ROLE_LABELS[u.roleId];

    // Normaliza lista de múltiplos subcargos (u.subRoleIds)
    if (u.subRoleId === "secretaria") {
      u.subRoleId = u.churchId === "sede" ? "secretaria_sede" : "secretaria_local";
    }
    u.subRoleIds = getUserSubRoleList(u);
    u.subRoleId = u.subRoleIds[0] || "nenhum";
    u.subRole = getUserSubRolesText(u);

    u.canBroadcast = Boolean(
      u.canBroadcast ||
        u.roleId === "adm" ||
        u.roleId === "adm_igreja" ||
        userHasAnySubRole(u, ["pastor_adm", "adm_igreja"])
    );
    u.photoUrl = u.photoUrl || "";
    u.memberCard = u.memberCard || `IGR-${String(index + 1).padStart(4, "0")}`;
    u.cpf = u.cpf || "";
    u.birthDate = u.birthDate || "";
    u.phone = u.phone || "";
    u.baptismDate = u.baptismDate || "";
    u.maritalStatus = u.maritalStatus || "SP";
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
        fetch(getCloudEndpoint("appigreja_radio_chunks"), { method: "DELETE" }),
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
    return `<img src="${customLogo}" alt="Logo da Igreja" style="width:100%; height:100%; object-fit:contain; border-radius:4px; background:#ffffff;" />`;
  }
  return `<img src="logo.png" alt="Logo" style="width:100%; height:100%; object-fit:contain; border-radius:4px; background:#ffffff;" onerror="this.outerHTML='<span style=&quot;color:#60171E;font-weight:900;&quot;>AI</span>'" />`;
}

function applyChurchLogoEverywhere() {
  document.querySelectorAll(".brand-mark").forEach((el) => {
    el.style.background = "#ffffff";
    el.style.color = "#60171E";
    el.style.border = "2px solid #60171E";
    el.style.padding = "3px";
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
    :root {
      color-scheme: dark;
      --bg: #000000 !important;
      --surface: #0d0d0d !important;
      --surface-soft: #24080b !important;
      --ink: #ffffff !important;
      --muted: #d4d4d8 !important;
      --line: #60171E !important;
      --green: #60171E !important;
      --green-dark: #ffffff !important;
      --teal: #e5737d !important;
      --gold: #f3b743 !important;
      --red: #ef4444 !important;
      --blue: #ffffff !important;
    }
    body {
      background: #000000 !important;
      color: #ffffff !important;
    }
    .brand-mark {
      background: #ffffff !important;
      color: #60171E !important;
      border: 2px solid #60171E !important;
      padding: 3px !important;
    }
    .sidebar {
      background: #070707 !important;
      border-right: 2px solid #60171E !important;
    }
    .nav-item:hover, .nav-item.active {
      background: #60171E !important;
      color: #ffffff !important;
    }
    .primary-button {
      background: #60171E !important;
      border-color: #8a2530 !important;
      color: #ffffff !important;
    }
    .secondary-button, .ghost-button {
      background: #141414 !important;
      border-color: #60171E !important;
      color: #ffffff !important;
    }
    .panel, .metric-card, .visit-form, .auth-card {
      background: #0d0d0d !important;
      border-color: #60171E !important;
      color: #ffffff !important;
    }
    .visit-item, .zaqueu-card, .notification-item, .calendar-day, .calendar-event, .content-card, .week-box, .rank-list div {
      background: #121212 !important;
      border-color: #60171E !important;
      color: #ffffff !important;
    }
    input, select, textarea {
      background: #080808 !important;
      border-color: #60171E !important;
      color: #ffffff !important;
    }
    body.is-authenticated .app-shell { display: grid !important; }
    body.is-authenticated .screen { display: block !important; }
    body.can-dashboard .dashboard-only { display: block !important; }
    .inline-admin-panel {
      margin-bottom: 20px;
      border: 2px solid #60171E !important;
      background: #120406 !important;
    }
    .user-role-row {
      display: grid;
      grid-template-columns: minmax(190px, 1.3fr) minmax(130px, 0.9fr) minmax(170px, 1.1fr) minmax(160px, 1fr) auto;
      gap: 10px;
      align-items: center;
      padding: 12px;
      border: 1px solid #60171E;
      border-radius: var(--radius);
      background: #0d0d0d;
      color: #ffffff;
    }
    .danger-btn {
      color: #ff6b6b !important;
      border-color: #ef4444 !important;
      background: #2a0808 !important;
      padding: 6px 10px !important;
      min-height: 32px !important;
      font-size: 12px !important;
    }
    .danger-btn:hover {
      background: #ef4444 !important;
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
      background: linear-gradient(90deg, #60171E, #a32a36);
      color: #ffffff;
      font-weight: 800;
      box-shadow: 0 8px 20px rgba(96, 23, 30, 0.45);
    }

/* ==========================================================================
   CARTEIRINHA OFICIAL - IGREJA EVANGÉLICA RESTAURAÇÃO (FRENTE E VERSO)
   ========================================================================== */
.ier-cards-stack {
  display: grid;
  gap: 16px;
}

.ier-card-face {
  width: 100%;
  max-width: 460px;
  aspect-ratio: 502 / 319;
  border-radius: 14px;
  overflow: hidden;
  background: #ffffff !important;
  border: 2px solid #be995d;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.75);
  display: grid;
  grid-template-rows: 37.3% 2.4% 44.5% 2.4% 13.4%;
  position: relative;
  font-family: Arial, Helvetica, sans-serif;
  user-select: none;
  margin: 0 auto;
}

.ier-card-header {
  background: #4a1018;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 10px;
  position: relative;
}

.ier-card-header-title {
  color: #ffffff;
  font-size: clamp(11px, 2.4vw, 15px);
  font-weight: 400;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  line-height: 1.1;
  margin-bottom: 3px;
}

.ier-card-header-logo {
  height: 70%;
  max-height: 66px;
  width: auto;
  object-fit: contain;
  display: block;
}

.ier-card-back .ier-card-header-logo {
  height: 82%;
  max-height: 76px;
}

.ier-card-gold-bar {
  background: #be995d;
  width: 100%;
  height: 100%;
}

.ier-card-body-front {
  background: #ffffff;
  display: grid;
  grid-template-columns: 28% 72%;
  align-items: center;
  padding: 6px 14px 10px 16px;
  position: relative;
  color: #4a1018;
}

.ier-card-photo-frame {
  width: 100%;
  max-width: 96px;
  aspect-ratio: 48 / 58;
  border: 3px solid #4a1018;
  background: linear-gradient(180deg, #bde4ff 0%, #e6f5ff 62%, #b8dc6f 62%, #76a305 100%);
  overflow: hidden;
  display: grid;
  place-items: center;
}

.ier-card-photo-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ier-card-fields {
  display: grid;
  gap: 2px;
  padding-left: 8px;
  font-size: clamp(10px, 2.1vw, 13px);
  line-height: 1.18;
  color: #4a1018;
}

.ier-card-field-row {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  gap: 5px;
  align-items: baseline;
}

.ier-card-field-label {
  text-align: right;
  font-weight: 600;
  color: #4a1018;
  white-space: nowrap;
}

.ier-card-field-value {
  text-align: left;
  font-weight: 700;
  color: #4a1018;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ier-card-valid-pill {
  position: absolute;
  left: 50%;
  bottom: 11.5%;
  transform: translateX(-50%);
  background: #4a1018;
  color: #ffffff;
  font-weight: 700;
  font-size: clamp(9px, 1.8vw, 11.5px);
  padding: 3px 14px;
  border-radius: 999px;
  white-space: nowrap;
  z-index: 3;
  letter-spacing: 0.3px;
}

.ier-card-footer {
  background: #4a1018;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: clamp(11px, 2.4vw, 15px);
  letter-spacing: 0.3px;
}

.ier-card-body-back {
  background: #ffffff;
  color: #4a1018;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 6px 18px 6px;
  text-align: center;
}

.ier-card-back-info {
  display: grid;
  gap: 1px;
  font-weight: 700;
  font-size: clamp(10px, 2.1vw, 13px);
  line-height: 1.22;
  color: #4a1018;
}

.ier-card-signatures {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 0 10px;
  margin-top: auto;
}

.ier-card-sig-box {
  border-top: 1.5px solid #4a1018;
  padding-top: 2px;
  font-size: clamp(9.5px, 2vw, 12px);
  color: #4a1018;
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
      background: #0d0d0d;
      color: #ffffff;
      border: 2px solid #60171E;
      box-shadow: 0 14px 34px rgba(0, 0, 0, 0.65);
      cursor: pointer;
    }
    .radio-mini-bar.is-live {
      border-color: #ef4444;
      background: linear-gradient(135deg, #60171E, #0d0d0d);
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
      background: #0d0d0d;
      color: #ffffff;
      border: 2px solid #60171E;
      box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8);
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
      color: #ffffff;
      font-size: 17px;
      display: grid;
      place-items: center;
      cursor: pointer;
      user-select: none;
    }
    .password-toggle-btn:hover {
      background: rgba(96, 23, 30, 0.35) !important;
    }
    .forgot-link-btn {
      border: 0;
      background: transparent;
      color: #e5737d;
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
      border: 2px solid #60171E;
      border-radius: var(--radius);
      background: #120406;
      color: #ffffff;
      display: grid;
      gap: 12px;
    }
    .app-toast-container {
      position: fixed;
      top: 18px;
      right: 18px;
      z-index: 10000;
      display: grid;
      gap: 10px;
      width: min(380px, calc(100vw - 28px));
      pointer-events: none;
    }
    .app-toast-card {
      pointer-events: auto;
      padding: 14px 16px;
      border-radius: 12px;
      background: #0d0d0d;
      color: #ffffff;
      border: 1px solid #60171E;
      border-left: 5px solid #60171E;
      box-shadow: 0 18px 42px rgba(0, 0, 0, 0.7);
      display: grid;
      gap: 6px;
      cursor: pointer;
      animation: toastSlideIn 0.25s ease-out;
    }
    @keyframes toastSlideIn {
      from { transform: translateY(-16px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
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
    meta.content = "#60171E";
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
  return PAGE_PERMISSIONS["dashboard.html"].includes(user.roleId) ? "dashboard.html" : "visitas.html";
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

// Regras de Permissão: Escopo Global (ADM Geral, Bispo, Secretaria Sede) vs Escopo Local (ADM Igreja, Pastor, Secretaria Local)
function getCustomRoleScope(roleId) {
  const custom = appState.customRoles?.[roleId];
  return custom && typeof custom === "object" ? custom.scope : "";
}

function isAdmin() {
  const customScope = getCustomRoleScope(currentUser?.roleId);
  return (
    ["adm", "bispo", "adm_igreja", "pastor", "secretaria_sede", "secretaria_local", "secretaria"].includes(currentUser?.roleId) ||
    ["global_admin", "local_admin"].includes(customScope) ||
    userHasAnySubRole(currentUser, ["pastor_adm", "adm_igreja", "secretaria_sede", "secretaria_local"])
  );
}

// VISÃO GLOBAL: Apenas ADM Geral, Bispo e Secretaria Sede (no cargo principal ou no subcargo) veem TODAS as igrejas
function hasGlobalScope(user = currentUser) {
  if (!user) return false;
  if (user.roleId === "adm" || user.roleId === "bispo" || user.roleId === "secretaria_sede") return true;
  if (getCustomRoleScope(user.roleId) === "global_admin") return true;
  if (userHasAnySubRole(user, ["secretaria_sede"])) return true;
  return false;
}

// VISÃO LOCAL DE IGREJA: ADM de Igreja, Pastor/Pastor ADM e Secretaria Local veem tudo APENAS da igreja atribuída
function isLocalChurchManager(user = currentUser) {
  if (!user) return false;
  const customScope = getCustomRoleScope(user.roleId);
  return (
    ["adm_igreja", "pastor", "secretaria_local", "secretaria", "lideranca"].includes(user.roleId) ||
    ["local_admin", "lideranca"].includes(customScope) ||
    userHasAnySubRole(user, [
      "pastor_adm",
      "pastor_aux",
      "adm_igreja",
      "secretaria_local",
      "secretaria_campineiro",
      "secretaria_mogi",
      "lider_obreiro",
      "lider_zaqueu",
    ])
  );
}

function canViewSecretariaData() {
  if (!currentUser) return false;
  return (
    hasGlobalScope(currentUser) ||
    ["adm_igreja", "secretaria_local", "secretaria_sede", "secretaria", "pastor"].includes(currentUser.roleId) ||
    ["global_admin", "local_admin"].includes(getCustomRoleScope(currentUser.roleId)) ||
    userHasAnySubRole(currentUser, [
      "secretaria_sede",
      "secretaria_local",
      "secretaria_campineiro",
      "secretaria_mogi",
      "pastor_adm",
      "adm_igreja",
    ])
  );
}

function canManageRoles() {
  return isAdmin();
}

function canBroadcastRadio() {
  if (!currentUser) return false;
  return Boolean(
    currentUser.roleId === "adm" ||
      currentUser.roleId === "adm_igreja" ||
      userHasAnySubRole(currentUser, ["pastor_adm", "adm_igreja"]) ||
      currentUser.canBroadcast
  );
}

function canManageZaqueu() {
  return (
    ["lideranca", "pastor", "adm_igreja", "bispo", "adm"].includes(currentUser?.roleId) ||
    ["global_admin", "local_admin", "lideranca"].includes(getCustomRoleScope(currentUser?.roleId)) ||
    userHasAnySubRole(currentUser, ["lider_zaqueu", "pastor_adm", "adm_igreja"])
  );
}

function canViewAllVisits() {
  return hasGlobalScope() || isLocalChurchManager();
}

function getVisibleUsers() {
  if (!currentUser) return [];
  if (hasGlobalScope()) return appState.users;
  return appState.users.filter((u) => u.churchId === currentUser.churchId);
}

function getVisibleVisits() {
  if (!currentUser) return [];
  if (hasGlobalScope()) return appState.visits;
  if (isLocalChurchManager()) {
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
        <button type="button" id="popup-mini-listen-btn" class="primary-button" style="background:#60171E; color:#ffffff; border:1px solid #ffffff; min-height:30px; padding:4px 10px; font-size:12px; font-weight:900;">
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
        <div style="padding:14px; border-radius:10px; background:linear-gradient(135deg, #1a0507, #60171E); color:#ffffff; display:grid; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div id="popup-radio-live-indicator" style="width:14px; height:14px; border-radius:50%; background:#9ca3af; flex:0 0 14px;"></div>
            <div style="min-width:0;">
              <strong id="popup-radio-speaker-name" style="font-size:15px; display:block;">Ninguém ao vivo no momento</strong>
              <span id="popup-radio-speaker-church" style="font-size:12px; opacity:0.85; display:block;">Você pode trocar de aba livremente que a rádio não desliga.</span>
            </div>
          </div>

          <div style="display:flex; gap:8px; flex-wrap:wrap; align-items:center;">
            <button class="primary-button" type="button" id="popup-listen-radio-btn" style="background:#60171E; color:#ffffff; border:1px solid #ffffff; font-weight:900; width:100%;">
              🔊 Conectar Áudio para Ouvir
            </button>
            <small id="popup-listener-audio-status" style="font-size:12px; opacity:0.92;">Toque acima para ouvir enquanto navega pelo app.</small>
          </div>

          <audio id="popup-external-audio-player" controls style="width:100%; display:none;"></audio>
        </div>

        <!-- Estúdio de Transmissão Multi-Locutores (Microfone Somente Envio / Alto-Falante Cortado) -->
        <div id="popup-radio-broadcaster-studio" style="padding:12px; border:2px solid #60171E; border-radius:10px; background:#120406; color:#ffffff; display:none;">
          <p class="eyebrow" style="margin-bottom:4px;">🎙️ Bancada Ao Vivo Multi-Locutores (Alto-Falante Cortado = Zero Eco)</p>
          <div id="popup-active-speakers-pills" class="tag-row" style="margin-bottom:8px;"></div>
          <div class="stack-form" style="gap:10px;">
            <label style="font-size:12px;">
              Título da Transmissão / Bancada
              <input id="popup-broadcast-title" type="text" value="Palavra Pastoral e Oração Ao Vivo" style="min-height:34px; padding:6px 8px;" />
            </label>
            <label style="font-size:12px;">
              Link de Stream Externo (Opcional)
              <input id="popup-broadcast-stream-url" type="url" placeholder="https://... (deixe vazio p/ usar Microfone)" style="min-height:34px; padding:6px 8px;" />
            </label>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="primary-button" type="button" id="popup-start-mic-btn" style="flex:1; min-height:36px; font-size:12px;">
                🎙️ Entrar na Bancada (Só Mic)
              </button>
              <button class="secondary-button" type="button" id="popup-pause-mic-btn" style="display:none; flex:1; min-height:36px; font-size:12px; border-color:#f3b743; color:#f3b743;">
                ⏸️ Pausar Mic p/ Ouvir Bancada
              </button>
              <button class="secondary-button danger-btn" type="button" id="popup-stop-broadcast-btn" style="display:none; min-height:36px; font-size:12px;">
                ⏹️ Sair da Bancada
              </button>
            </div>
            <label style="display:flex; align-items:center; gap:6px; font-size:11px; color:var(--muted); cursor:pointer;">
              <input type="checkbox" id="popup-headset-mode-check" style="min-height:16px; width:16px;" />
              🎧 Estou de Fone de Ouvido (ouvir outros co-locutores sem cortar meu mic; minha própria voz nunca sai no som)
            </label>
            <small id="popup-broadcaster-feedback" style="color:#ffffff; font-weight:700; font-size:12px;"></small>
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
  document.querySelector("#popup-pause-mic-btn")?.addEventListener("click", togglePauseBroadcasterMic);
  document.querySelector("#popup-stop-broadcast-btn")?.addEventListener("click", stopBroadcast);
  document.querySelector("#popup-headset-mode-check")?.addEventListener("change", (e) => {
    isHeadsetCoHostMode = Boolean(e.target.checked);
    if (isHeadsetCoHostMode) {
      ensureCoHostListenerLoop();
      setRadioButtonsAndStatus(null, null, null, "🎧 Modo Fone Ativo: você ouvirá os outros locutores da bancada (sua própria voz continua 100% bloqueada no seu som).");
    } else {
      muteAllLocalAudioOutput();
      setRadioButtonsAndStatus(null, null, null, "🔇 Modo Alto-Falante Cortado: seu aparelho apenas envia sua voz pelo microfone (Zero Eco).");
    }
  });

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

// ============================================================================
// SISTEMA DE NOTIFICAÇÕES NATIVAS (CELULAR ANDROID E ÁREA DE TRABALHO PC)
// ============================================================================
let swRegistration = null;
let backgroundSyncWorker = null;

async function registerAppServiceWorker() {
  if (!("serviceWorker" in navigator)) return null;
  try {
    swRegistration = await navigator.serviceWorker.register("sw.js");
    navigator.serviceWorker.addEventListener("message", (event) => {
      const data = event.data || {};
      if (data.type === "NOTIFICATION_CLICK_NAVIGATE" && data.url) {
        const cleanTarget = String(data.url).replace("./", "");
        navigateToPageSeamless(cleanTarget, true);
      }
    });
    return swRegistration;
  } catch (err) {
    console.warn("Service Worker em modo local:", err);
    return null;
  }
}

function playNotificationChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.setValueAtTime(880, now + 0.14); // A5
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.45);
  } catch {
    // Ignora se o navegador bloquear áudio antes do 1º toque
  }
}

function showInAppToast({ title, body, url }) {
  let container = document.querySelector("#app-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "app-toast-container";
    container.className = "app-toast-container";
    document.body.appendChild(container);
  }

  const card = document.createElement("div");
  card.className = "app-toast-card";
  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
      <strong style="font-size:14px; color:#f3b743;">${escapeHtml(title)}</strong>
      <span style="font-size:11px; opacity:0.75;">Agora</span>
    </div>
    <p style="margin:0; font-size:13px; color:#eef4f1;">${escapeHtml(body)}</p>
  `;

  card.addEventListener("click", () => {
    card.remove();
    if (url) {
      navigateToPageSeamless(String(url).replace("./", ""), true);
    }
  });

  container.appendChild(card);
  setTimeout(() => {
    card.remove();
  }, 7000);
}

async function triggerSystemNotification({ title, body, tag, url = "./dashboard.html", requireInteraction = false }) {
  playNotificationChime();
  showInAppToast({ title, body, url });

  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  const iconUrl = appState.churchLogo || "logo.png";
  const options = {
    body,
    icon: iconUrl,
    badge: iconUrl,
    tag: tag || `appigreja_${Date.now()}`,
    renotify: true,
    requireInteraction,
    vibrate: [250, 120, 250, 120, 300],
    data: { url },
  };

  try {
    if (swRegistration && swRegistration.showNotification) {
      await swRegistration.showNotification(title, options);
      return;
    }
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && reg.showNotification) {
        await reg.showNotification(title, options);
        return;
      }
    }
  } catch {
    // Fallback para Notification da área de trabalho
  }

  try {
    const nativeNotif = new Notification(title, options);
    nativeNotif.onclick = () => {
      window.focus();
      nativeNotif.close();
      if (url) navigateToPageSeamless(String(url).replace("./", ""), true);
    };
  } catch (err) {
    console.warn("Erro ao exibir notificação nativa:", err);
  }
}

async function requestPushNotificationPermission(sendTest = true) {
  if (!("Notification" in window)) {
    alert("Este navegador não suporta notificações nativas do sistema.");
    return false;
  }

  let permission = Notification.permission;
  if (permission !== "granted") {
    permission = await Notification.requestPermission();
  }

  updatePushPermissionButtonUI();

  if (permission === "granted") {
    if (sendTest) {
      await triggerSystemNotification({
        title: "🔔 Alertas do APPIGREJA Ativados!",
        body: "Você receberá avisos de Novos Eventos, Notificações e Rádio Ao Vivo no celular e computador.",
        tag: "appigreja_test_alert",
        url: "./notificacoes.html",
      });
    }
    return true;
  } else {
    alert("Permissão de notificação negada. Para receber alertas no celular/PC, libere as notificações no ícone de cadeado da barra de endereços.");
    return false;
  }
}

function updatePushPermissionButtonUI() {
  const btn = document.querySelector("#push-permission-btn");
  if (!btn) return;
  const granted = "Notification" in window && Notification.permission === "granted";
  if (granted) {
    btn.textContent = "🔔 Alertas Ativos";
    btn.style.background = "#60171E";
    btn.style.color = "#ffffff";
    btn.style.borderColor = "#8a2530";
  } else {
    btn.textContent = "🔔 Ativar Alertas";
    btn.style.background = "#24080b";
    btn.style.color = "#ffffff";
    btn.style.borderColor = "#f3b743";
  }
}

function loadSeenAlerts() {
  try {
    const raw = localStorage.getItem(SEEN_ALERTS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSeenAlerts(seenObj) {
  localStorage.setItem(SEEN_ALERTS_KEY, JSON.stringify(seenObj));
}

// Marca os itens atuais como vistos no 1º carregamento ou quando o próprio usuário cria um item
function markCurrentItemsAsSeen() {
  const existing = loadSeenAlerts() || { initialized: true, notifIds: [], calIds: [], lastRadioLiveAt: 0 };
  const notifIds = new Set([...(existing.notifIds || []), ...(appState.notifications || []).map((n) => n.id)]);
  const calIds = new Set([...(existing.calIds || []), ...(appState.calendarEvents || []).map((c) => c.id)]);
  const liveAt = Math.max(Number(existing.lastRadioLiveAt || 0), Number(appState.radioLive?.updatedAt || 0));

  saveSeenAlerts({
    initialized: true,
    notifIds: Array.from(notifIds).slice(-200),
    calIds: Array.from(calIds).slice(-200),
    lastRadioLiveAt: liveAt,
  });
}

async function checkAndDispatchNewCloudAlerts(remoteState) {
  if (!remoteState || typeof remoteState !== "object") return;

  const seen = loadSeenAlerts();
  if (!seen || !seen.initialized) {
    markCurrentItemsAsSeen();
    return;
  }

  let changedSeen = false;
  const notifSet = new Set(seen.notifIds || []);
  const calSet = new Set(seen.calIds || []);
  let lastLiveAt = Number(seen.lastRadioLiveAt || 0);

  // 1. Verifica se alguém entrou AO VIVO na Rádio
  const remoteLive = remoteState.radioLive;
  if (remoteLive && remoteLive.active && Number(remoteLive.updatedAt || 0) > lastLiveAt) {
    lastLiveAt = Number(remoteLive.updatedAt);
    changedSeen = true;
    await triggerSystemNotification({
      title: `🔴 RÁDIO AO VIVO: ${remoteLive.title || "Transmissão Iniciada"}`,
      body: `🎙️ ${remoteLive.speakerName || "Locutor"} entrou ao vivo agora (${remoteLive.speakerChurch || "APPIGREJA"}). Toque para ouvir!`,
      tag: `radio_live_${lastLiveAt}`,
      url: "./radio.html",
      requireInteraction: true,
    });
  }

  // 2. Verifica se alguém criou uma NOVA NOTIFICAÇÃO
  const remoteNotifs = Array.isArray(remoteState.notifications) ? remoteState.notifications : [];
  for (const n of remoteNotifs) {
    if (n && n.id && !notifSet.has(n.id)) {
      notifSet.add(n.id);
      changedSeen = true;
      await triggerSystemNotification({
        title: `🔔 ${n.title || "Nova Notificação"}`,
        body: `${n.message || "Novo comunicado publicado no aplicativo."}`,
        tag: `notif_${n.id}`,
        url: "./notificacoes.html",
      });
    }
  }

  // 3. Verifica se alguém cadastrou um NOVO EVENTO NO CALENDÁRIO
  const remoteCals = Array.isArray(remoteState.calendarEvents) ? remoteState.calendarEvents : [];
  for (const ev of remoteCals) {
    if (ev && ev.id && !calSet.has(ev.id)) {
      calSet.add(ev.id);
      changedSeen = true;
      const timeStr = ev.time ? ` às ${ev.time}` : "";
      await triggerSystemNotification({
        title: `📅 Novo Evento: ${ev.title || "Agenda da Igreja"}`,
        body: `${formatDate(ev.date)}${timeStr} — ${ev.church || "Igreja Sede"}. ${ev.description || ""}`.trim(),
        tag: `cal_${ev.id}`,
        url: "./calendario.html",
      });
    }
  }

  if (changedSeen) {
    saveSeenAlerts({
      initialized: true,
      notifIds: Array.from(notifSet).slice(-200),
      calIds: Array.from(calSet).slice(-200),
      lastRadioLiveAt: lastLiveAt,
    });
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

  const subRoleDisplay = getUserSubRoleList(currentUser).length
    ? ` • ${getUserSubRolesText(currentUser)}`
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
      : `<a class="secondary-button" href="perfil.html#secretaria-members-panel">Fichas da Secretaria (${getVisibleUsers().length})</a>`;

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
        <button class="secondary-button" type="button" id="push-permission-btn" title="Ativar ou testar notificações no celular e área de trabalho">🔔 Ativar Alertas</button>
        ${promoteSelfBtn}
        <a class="secondary-button" href="perfil.html">Meu Perfil</a>
        <a class="ghost-button" href="nova-visita.html">Nova visita</a>
      </div>
    </header>
  `;

  shell.insertAdjacentHTML("afterbegin", sidebarHtml);
  main.insertAdjacentHTML("afterbegin", topbarHtml);

  // 1. PAINEL DE GESTÃO DE PESSOAS, CARGOS PRINCIPAIS, MÚLTIPLOS SUBCARGOS E IGREJAS LOCAIS
  const dashboardScreen = document.querySelector("#dashboard") || document.querySelector("#visao");
  if (dashboardScreen && canManageRoles() && !document.querySelector("#gestao-cargos")) {
    const heading = dashboardScreen.querySelector(".section-heading");
    const scopeLabel = hasGlobalScope()
      ? "Visão Global (Todas as Igrejas - Sede/ADM Geral)"
      : `Visão Local Restrita (${currentUser.church})`;

    const allowedRoleEntries = Object.entries(ROLE_LABELS).filter(([k]) =>
      hasGlobalScope() ? true : !["adm", "bispo", "secretaria_sede"].includes(k)
    );
    const allowedChurchEntries = Object.entries(CHURCHES).filter(([k]) =>
      hasGlobalScope() ? true : k === currentUser.churchId
    );

    const usersPanelHtml = `
      <section class="panel wide inline-admin-panel" id="gestao-cargos">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Administração — ${escapeHtml(scopeLabel)}</p>
            <h3>Pessoas Registradas no Seu Escopo (<span id="registered-users-count">0</span>)</h3>
          </div>
          <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <button class="secondary-button" type="button" id="toggle-add-role-box" style="padding: 6px 12px; min-height: 32px; font-size: 12px; border-color: var(--blue); color: var(--blue);">
              ➕ Adicionar Cargo Principal
            </button>
            <button class="secondary-button" type="button" id="toggle-add-subrole-box" style="padding: 6px 12px; min-height: 32px; font-size: 12px; border-color: var(--green); color: var(--green-dark);">
              ➕ Adicionar Subcargo
            </button>
            ${
              hasGlobalScope()
                ? `<button class="secondary-button" type="button" id="toggle-add-church-box" style="padding: 6px 12px; min-height: 32px; font-size: 12px; border-color: var(--teal); color: var(--teal);">
                    ⛪ Adicionar Igreja Local
                  </button>`
                : ""
            }
            <label class="secondary-button" style="cursor: pointer; padding: 6px 12px; min-height: 32px; font-size: 12px;">
              🖼️ Trocar Logo do App
              <input type="file" id="upload-church-logo-input" accept="image/*" style="display: none;" />
            </label>
            <a class="secondary-button" href="perfil.html#secretaria-members-panel" style="padding: 6px 12px; min-height: 32px; font-size: 12px;">
              🪪 Fichas da Secretaria
            </a>
            ${
              hasGlobalScope()
                ? `<button class="secondary-button danger-btn" type="button" id="reset-db-btn">Zerar Tudo</button>`
                : ""
            }
          </div>
        </div>

        <!-- Caixa Expansível 1: Adicionar Novo Cargo Principal / Função Principal -->
        <div id="add-role-box" style="display: none; margin-top: 12px; padding: 14px; border: 2px solid #60171E; border-radius: var(--radius); background: #0d0d0d; color: #ffffff;">
          <strong style="display: block; margin-bottom: 8px;">➕ Cadastrar Novo Cargo / Função Principal</strong>
          <form id="add-role-form" class="form-grid" style="align-items: end;">
            <label>
              Nome do Cargo Principal
              <input id="new-role-name" type="text" placeholder="Ex: Presbítero / Evangelista / Tesoureiro" required />
            </label>
            <label>
              Permissão / Escopo de Visão deste Cargo
              <select id="new-role-scope">
                <option value="local_admin">Gestão Local (Vê Dashboard e Secretaria da própria Igreja)</option>
                <option value="lideranca">Liderança (Vê Visão Geral, Visitas da Igreja e cria Zaqueus)</option>
                <option value="obreiro">Básico / Campo (Registra Visitas e vê as próprias)</option>
                ${hasGlobalScope() ? `<option value="global_admin">Visão Geral Completa (Vê todas as Igrejas - Igual Sede/ADM)</option>` : ""}
              </select>
            </label>
            <button class="primary-button" type="submit">Salvar Cargo Principal</button>
          </form>
          <div id="custom-roles-tags" class="tag-row" style="margin-top: 10px;"></div>
        </div>

        <!-- Caixa Expansível 2: Adicionar Novo Subcargo / Função Ministerial -->
        <div id="add-subrole-box" style="display: none; margin-top: 12px; padding: 14px; border: 2px solid #60171E; border-radius: var(--radius); background: #0d0d0d; color: #ffffff;">
          <strong style="display: block; margin-bottom: 8px;">➕ Cadastrar Novo Subcargo / Função Ministerial na Lista</strong>
          <form id="add-subrole-form" style="display: flex; gap: 8px; flex-wrap: wrap;">
            <input id="new-subrole-name" type="text" placeholder="Ex: LÍDER DE JOVENS / DIÁCONO / MÍDIA / INFANTIL" required style="flex: 1; min-width: 220px;" />
            <button class="primary-button" type="submit">Salvar Subcargo na Lista</button>
          </form>
          <div id="custom-subroles-tags" class="tag-row" style="margin-top: 10px;"></div>
        </div>

        <!-- Caixa Expansível 3: Adicionar Nova Igreja Local -->
        <div id="add-church-box" style="display: none; margin-top: 12px; padding: 14px; border: 2px solid #60171E; border-radius: var(--radius); background: #0d0d0d; color: #ffffff;">
          <strong style="display: block; margin-bottom: 8px;">⛪ Cadastrar Nova Igreja Local</strong>
          <form id="add-church-form" class="form-grid" style="align-items: end;">
            <label>
              Nome da Igreja Local
              <input id="new-church-name" type="text" placeholder="Ex: Igreja Hortolândia" required />
            </label>
            <label>
              Pastor / Liderança Responsável
              <input id="new-church-pastor" type="text" placeholder="Ex: Pastor Marcos" required />
            </label>
            <button class="primary-button" type="submit">Salvar Igreja Local</button>
          </form>
          <div id="custom-churches-tags" class="tag-row" style="margin-top: 10px;"></div>
        </div>

        <p style="margin: 8px 0 12px; font-size: 13px; color: var(--muted);" id="role-save-feedback">
          Você pode selecionar <strong>quantos subcargos quiser para a mesma pessoa</strong> usando o botão "+ Incluir subcargo..." em cada linha:
        </p>

        <div class="visit-list" id="page-users-list" style="margin-top: 12px; margin-bottom: 18px;"></div>

        <details style="border-top: 1px solid var(--line); padding-top: 14px;">
          <summary style="cursor: pointer; font-weight: 800; color: var(--green-dark);">+ Cadastrar Nova Pessoa (Permite Múltiplos Subcargos)</summary>
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
                  ${allowedChurchEntries
                    .map(([k, ch]) => `<option value="${escapeHtml(k)}">${escapeHtml(ch.name)} (${escapeHtml(ch.pastor)})</option>`)
                    .join("")}
                </select>
              </label>
              <label>
                Cargo / Função Principal
                <select name="roleId" class="dynamic-role-select" required>
                  ${allowedRoleEntries
                    .map(([k, v]) => `<option value="${escapeHtml(k)}">${escapeHtml(v)}</option>`)
                    .join("")}
                </select>
              </label>
            </div>
            <div>
              <strong style="font-size: 13px; color: var(--muted); display: block; margin-bottom: 6px;">
                Selecione 1 ou mais Subcargos / Funções Ministeriais (Opcional):
              </strong>
              <div id="new-user-subroles-checkboxes" style="display: flex; gap: 8px; flex-wrap: wrap; padding: 10px; border: 1px solid #60171E; border-radius: var(--radius); background: #0d0d0d; color: #ffffff;"></div>
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
                ${Object.values(CHURCHES)
                  .map((ch) => `<option value="${escapeHtml(ch.name)} (${escapeHtml(ch.pastor)})">${escapeHtml(ch.name)} (${escapeHtml(ch.pastor)})</option>`)
                  .join("")}
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
  const globalAccess = hasGlobalScope();
  const allowedRoleEntries = Object.entries(ROLE_LABELS).filter(([roleKey]) =>
    globalAccess ? true : !["adm", "bispo", "secretaria_sede"].includes(roleKey) || u.roleId === roleKey
  );
  const allowedChurchEntries = Object.entries(CHURCHES).filter(([chKey]) =>
    globalAccess ? true : chKey === currentUser?.churchId || chKey === u.churchId
  );

  const userSubRoles = getUserSubRoleList(u);
  const subRoleBadgesHtml = userSubRoles.length
    ? userSubRoles
        .map(
          (subKey) => `
          <span class="status-pill" style="display:inline-flex; align-items:center; gap:4px; padding:2px 8px; font-size:11px;">
            ${escapeHtml(SUBROLE_LABELS[subKey] || subKey)}
            <button type="button" class="remove-user-subrole-btn" data-user-id="${escapeHtml(u.id)}" data-subrole="${escapeHtml(subKey)}" style="border:0; background:transparent; color:var(--red); font-weight:900; cursor:pointer; padding:0 2px;" title="Remover este subcargo">✕</button>
          </span>
        `
        )
        .join("")
    : `<span class="tag" style="background:#24080b; color:#ffffff; font-size:11px;">Sem subcargos</span>`;

  const availableSubRoleOptions = Object.entries(SUBROLE_LABELS)
    .filter(([subKey]) => subKey !== "nenhum" && !userSubRoles.includes(subKey))
    .map(([subKey, label]) => `<option value="${escapeHtml(subKey)}">+ ${escapeHtml(label)}</option>`)
    .join("");

  return `
    <div class="user-role-row">
      <div style="display: flex; align-items: center; gap: 10px; min-width: 0;">
        ${getAvatarHtml(u, 42)}
        <div style="min-width: 0;">
          <strong style="font-size: 15px; display: block;">${escapeHtml(u.name)} ${isSelf ? "(Você)" : ""}</strong>
          <small style="display:block; color: var(--muted);">E-mail: ${escapeHtml(u.login)}</small>
          <small style="display:block; color: var(--teal); font-weight: 700;">Carteira: ${escapeHtml(u.memberCard || "Não informada")} • ${escapeHtml(u.church)}</small>
        </div>
      </div>

      <label style="font-size: 11px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Cargo / Função Principal
        <select class="user-role-select" data-user-id="${escapeHtml(u.id)}" ${!globalAccess && ["adm", "bispo", "secretaria_sede"].includes(u.roleId) ? "disabled" : ""}>
          ${allowedRoleEntries
            .map(([roleKey, label]) => `<option value="${escapeHtml(roleKey)}" ${u.roleId === roleKey ? "selected" : ""}>${escapeHtml(label)}</option>`)
            .join("")}
        </select>
      </label>

      <div style="display: grid; gap: 6px;">
        <span style="font-size: 11px; color: var(--muted); font-weight: 700;">Subcargos / Funções (${userSubRoles.length})</span>
        <div style="display: flex; gap: 4px; flex-wrap: wrap;">${subRoleBadgesHtml}</div>
        <select class="user-subrole-add-select" data-user-id="${escapeHtml(u.id)}" style="min-height: 34px; font-size: 12px; padding: 4px 8px;">
          <option value="">➕ Incluir subcargo...</option>
          ${availableSubRoleOptions}
        </select>
      </div>

      <label style="font-size: 11px; color: var(--muted); font-weight: 700; display: grid; gap: 4px;">
        Igreja Vinculada
        <select class="user-church-select" data-user-id="${escapeHtml(u.id)}" ${!globalAccess ? "disabled" : ""}>
          ${allowedChurchEntries
            .map(([chKey, chObj]) => `<option value="${escapeHtml(chKey)}" ${u.churchId === chKey ? "selected" : ""}>${escapeHtml(chObj.name)}</option>`)
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
      if (!hasGlobalScope() && ["adm", "bispo", "secretaria_sede"].includes(select.value)) {
        alert("Apenas a Administração Geral / Sede pode atribuir cargos globais.");
        renderAll();
        return;
      }
      targetUser.roleId = select.value;
      targetUser.role = ROLE_LABELS[select.value] || "Obreiro";
      if (targetUser.roleId === "adm" || targetUser.roleId === "adm_igreja") targetUser.canBroadcast = true;
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Cargo principal de ${targetUser.name} salvo como ${targetUser.role}!`;
      if (targetUser.id === currentUser.id) {
        window.location.reload();
      } else {
        renderAll();
      }
    });
  });

  // Adicionar mais um subcargo para a pessoa (Múltiplos Subcargos)
  rootElement.querySelectorAll(".user-subrole-add-select").forEach((select) => {
    select.addEventListener("change", async () => {
      const subKey = select.value;
      if (!subKey) return;
      const targetUser = appState.users.find((u) => u.id === select.dataset.userId);
      if (!targetUser) return;
      const list = getUserSubRoleList(targetUser);
      if (!list.includes(subKey)) list.push(subKey);
      targetUser.subRoleIds = list;
      targetUser.subRoleId = list[0] || "nenhum";
      targetUser.subRole = getUserSubRolesText(targetUser);
      if (["pastor_adm", "adm_igreja"].includes(subKey)) targetUser.canBroadcast = true;
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Subcargo "${SUBROLE_LABELS[subKey]}" adicionado para ${targetUser.name}!`;
      renderAll();
    });
  });

  // Remover um subcargo individual da pessoa clicando no ✕
  rootElement.querySelectorAll(".remove-user-subrole-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const subKey = btn.dataset.subrole;
      const targetUser = appState.users.find((u) => u.id === btn.dataset.userId);
      if (!targetUser) return;
      const list = getUserSubRoleList(targetUser).filter((k) => k !== subKey);
      targetUser.subRoleIds = list;
      targetUser.subRoleId = list[0] || "nenhum";
      targetUser.subRole = getUserSubRolesText(targetUser);
      await saveAppState();
      const feedback = document.querySelector("#role-save-feedback");
      if (feedback) feedback.textContent = `Subcargo removido de ${targetUser.name}.`;
      renderAll();
    });
  });

  rootElement.querySelectorAll(".user-church-select").forEach((select) => {
    select.addEventListener("change", async () => {
      if (!hasGlobalScope()) return;
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
        const msg = `Olá *${targetUser.name}*! Seu acesso no *APPIGREJA* foi atualizado:\n\n📧 *E-mail:* ${targetUser.login}\n🔑 *Nova Senha:* ${cleanPass}`;
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

function renderCustomCatalogTags() {
  refreshDynamicCatalogs(appState);

  document.querySelectorAll(".dynamic-role-select").forEach((sel) => {
    const val = sel.value || "obreiro";
    const allowed = Object.entries(ROLE_LABELS).filter(([k]) =>
      hasGlobalScope() ? true : !["adm", "bispo", "secretaria_sede"].includes(k)
    );
    sel.innerHTML = allowed
      .map(([k, v]) => `<option value="${escapeHtml(k)}">${escapeHtml(v)}</option>`)
      .join("");
    if (ROLE_LABELS[val]) sel.value = val;
  });

  const subCheckboxesBox = document.querySelector("#new-user-subroles-checkboxes");
  if (subCheckboxesBox) {
    subCheckboxesBox.innerHTML = Object.entries(SUBROLE_LABELS)
      .filter(([k]) => k !== "nenhum")
      .map(
        ([k, label]) => `
        <label style="display:inline-flex; align-items:center; gap:5px; padding:4px 8px; border:1px solid var(--line); border-radius:6px; font-size:12px; cursor:pointer; background:#141414; color:#ffffff;">
          <input type="checkbox" name="subRoles" value="${escapeHtml(k)}" style="min-height:16px; width:16px;" />
          ${escapeHtml(label)}
        </label>
      `
      )
      .join("");
  }

  const regChurchSelect = document.querySelector('#register-form select[name="churchId"]');
  if (regChurchSelect) {
    const currentVal = regChurchSelect.value || "sede";
    regChurchSelect.innerHTML = Object.entries(CHURCHES)
      .map(([k, ch]) => `<option value="${escapeHtml(k)}">${escapeHtml(ch.name)} (${escapeHtml(ch.pastor)})</option>`)
      .join("");
    if (CHURCHES[currentVal]) regChurchSelect.value = currentVal;
  }

  const roleTagsEl = document.querySelector("#custom-roles-tags");
  if (roleTagsEl) {
    const customRolesEntries = Object.entries(appState.customRoles || {});
    roleTagsEl.innerHTML = customRolesEntries.length
      ? customRolesEntries
          .map(([k, obj]) => {
            const label = typeof obj === "object" ? obj.label : String(obj);
            return `
              <span class="tag">
                ${escapeHtml(label)}
                <button type="button" class="del-custom-role-btn" data-key="${escapeHtml(k)}" style="border:0; background:transparent; color:var(--red); font-weight:900; margin-left:6px; cursor:pointer;" title="Remover cargo">✕</button>
              </span>
            `;
          })
          .join("")
      : `<small style="color:var(--muted);">Cadastre acima cargos principais extras para a igreja.</small>`;

    roleTagsEl.querySelectorAll(".del-custom-role-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const key = btn.dataset.key;
        delete appState.customRoles[key];
        refreshDynamicCatalogs(appState);
        await saveAppState();
        renderAll();
      });
    });
  }

  const subTagsEl = document.querySelector("#custom-subroles-tags");
  if (subTagsEl) {
    const customSubs = Object.entries(appState.customSubRoles || {});
    subTagsEl.innerHTML = customSubs.length
      ? customSubs
          .map(
            ([k, label]) => `
            <span class="tag">
              ${escapeHtml(label)}
              <button type="button" class="del-custom-subrole-btn" data-key="${escapeHtml(k)}" style="border:0; background:transparent; color:var(--red); font-weight:900; margin-left:6px; cursor:pointer;" title="Remover subcargo">✕</button>
            </span>
          `
          )
          .join("")
      : `<small style="color:var(--muted);">Digite acima qualquer subcargo novo e clique em Salvar para adicioná-lo a todas as listas.</small>`;

    subTagsEl.querySelectorAll(".del-custom-subrole-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const key = btn.dataset.key;
        delete appState.customSubRoles[key];
        refreshDynamicCatalogs(appState);
        await saveAppState();
        renderAll();
      });
    });
  }

  const churchTagsEl = document.querySelector("#custom-churches-tags");
  if (churchTagsEl) {
    const allCh = Object.entries(CHURCHES);
    churchTagsEl.innerHTML = allCh
      .map(([k, ch]) => {
        const isCustom = !DEFAULT_CHURCHES[k];
        return `
          <span class="tag">
            ⛪ ${escapeHtml(ch.name)} (${escapeHtml(ch.pastor)})
            ${
              isCustom
                ? `<button type="button" class="del-custom-church-btn" data-key="${escapeHtml(k)}" style="border:0; background:transparent; color:var(--red); font-weight:900; margin-left:6px; cursor:pointer;" title="Remover igreja">✕</button>`
                : ""
            }
          </span>
        `;
      })
      .join("");

    churchTagsEl.querySelectorAll(".del-custom-church-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const key = btn.dataset.key;
        if (!confirm(`Remover a igreja "${CHURCHES[key]?.name}"?`)) return;
        delete appState.customChurches[key];
        refreshDynamicCatalogs(appState);
        await saveAppState();
        renderAll();
      });
    });
  }
}

function renderUsersRoleManager() {
  renderCustomCatalogTags();
  const visibleUsers = getVisibleUsers();

  const countBadge = document.querySelector("#registered-users-count");
  if (countBadge) countBadge.textContent = String(visibleUsers.length);

  const pageContainer = document.querySelector("#page-users-list");
  if (!pageContainer) return;

  if (!visibleUsers.length) {
    pageContainer.innerHTML = emptyCard("Nenhuma pessoa registrada nesta igreja ainda.");
    return;
  }

  pageContainer.innerHTML = visibleUsers.map(buildUserRoleCardHtml).join("");
  wireUserRoleSelects(pageContainer);
}

// Renderização da Página Meu Perfil + Carteirinha Oficial IER (Frente e Verso) + Download PNG/PDF
function getMemberCargoForCard(user) {
  if (!user) return "Membro";
  const mainRole = ROLE_LABELS[user.roleId] || user.role || "Membro";
  const subs = getUserSubRoleList(user);
  if (!subs.length) return mainRole;
  return `${mainRole} (${subs.map((k) => SUBROLE_LABELS[k]).join(", ")})`;
}

function getCardHeaderLogoSrc() {
  return appState.churchLogo || IER_CARD_LOGO_DATA_URL || "logo.png";
}

function buildIerCardHtml(user) {
  const logoSrc = getCardHeaderLogoSrc();
  const photoHtml = user?.photoUrl
    ? `<img src="${user.photoUrl}" alt="${escapeHtml(user.name)}" />`
    : `<div style="width:100%; height:100%; display:grid; place-items:center; color:#4a1018; font-weight:800; font-size:11px; text-align:center; padding:4px;">FOTO<br/>3x4</div>`;

  const nomeVal = user?.name || "Não preenchido";
  const cpfVal = user?.cpf || "___.___.___-__";
  const cargoVal = getMemberCargoForCard(user);
  const membrouVal = formatDate(user?.baptismDate) || "__/__/____";
  const estadoVal = user?.maritalStatus || "SP";
  const validadeVal = user?.cardValidUntil || "31/12/2026";

  return `
    <div class="ier-cards-stack">
      <!-- FRENTE DA CARTEIRINHA -->
      <div>
        <small style="display:block; margin-bottom:6px; color:var(--muted); font-weight:700;">Frente da Carteirinha (Preenchimento Automático):</small>
        <div class="ier-card-face ier-card-front">
          <div class="ier-card-header">
            <div class="ier-card-header-title">MEMBRO ATIVO</div>
            <img class="ier-card-header-logo" src="${logoSrc}" alt="Igreja Evangélica Restauração" />
          </div>
          <div class="ier-card-gold-bar"></div>
          <div class="ier-card-body-front">
            <div class="ier-card-photo-frame">${photoHtml}</div>
            <div class="ier-card-fields">
              <div class="ier-card-field-row">
                <span class="ier-card-field-label">NOME:</span>
                <span class="ier-card-field-value" id="card-live-name">${escapeHtml(nomeVal)}</span>
              </div>
              <div class="ier-card-field-row">
                <span class="ier-card-field-label">CPF:</span>
                <span class="ier-card-field-value" id="card-live-cpf">${escapeHtml(cpfVal)}</span>
              </div>
              <div class="ier-card-field-row">
                <span class="ier-card-field-label">CARGO:</span>
                <span class="ier-card-field-value" id="card-live-cargo">${escapeHtml(cargoVal)}</span>
              </div>
              <div class="ier-card-field-row">
                <span class="ier-card-field-label">MEMBROU:</span>
                <span class="ier-card-field-value" id="card-live-membrou">${escapeHtml(membrouVal)}</span>
              </div>
              <div class="ier-card-field-row">
                <span class="ier-card-field-label">ESTADO:</span>
                <span class="ier-card-field-value" id="card-live-estado">${escapeHtml(estadoVal)}</span>
              </div>
            </div>
          </div>
          <div class="ier-card-valid-pill">VÁLIDO ATÉ: ${escapeHtml(validadeVal)}</div>
          <div class="ier-card-gold-bar"></div>
          <div class="ier-card-footer">www.ierestauracao.com.br</div>
        </div>
      </div>

      <!-- VERSO DA CARTEIRINHA -->
      <div>
        <small style="display:block; margin-bottom:6px; color:var(--muted); font-weight:700;">Verso da Carteirinha:</small>
        <div class="ier-card-face ier-card-back">
          <div class="ier-card-header">
            <img class="ier-card-header-logo" src="${logoSrc}" alt="Igreja Evangélica Restauração" />
          </div>
          <div class="ier-card-gold-bar"></div>
          <div class="ier-card-body-back">
            <div class="ier-card-back-info">
              <div>SEDE</div>
              <div>Avenida Mário Trevenzolli, 1199</div>
              <div>Campinas / SP</div>
              <div>CNPJ: 02.116.066/0001-77</div>
            </div>
            <div class="ier-card-signatures">
              <div class="ier-card-sig-box">Presidente</div>
              <div class="ier-card-sig-box">Secretária</div>
            </div>
          </div>
          <div class="ier-card-gold-bar"></div>
          <div class="ier-card-footer"></div>
        </div>
      </div>

      <!-- BOTÕES DE DOWNLOAD DIRETO -->
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:4px;">
        <button type="button" class="primary-button" id="download-my-card-png-btn" style="flex:1;">
          📥 Baixar Carteirinha (PNG)
        </button>
        <button type="button" class="secondary-button" id="download-my-card-pdf-btn" style="flex:1;">
          🖨️ Baixar / Imprimir em PDF
        </button>
      </div>
    </div>
  `;
}

function loadImageElement(src) {
  return new Promise((resolve) => {
    if (!src) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function drawRoundedRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

async function renderMemberCardToCanvas(user) {
  const W = 1004;
  const H = 638;
  const GAP = 44;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H * 2 + GAP;
  const ctx = canvas.getContext("2d");

  const logoImg = await loadImageElement(getCardHeaderLogoSrc());
  const photoImg = await loadImageElement(user?.photoUrl || "");

  const drawCardBase = (offsetY, isFront) => {
    ctx.save();
    drawRoundedRectPath(ctx, 0, offsetY, W, H, 28);
    ctx.clip();

    // Fundo branco geral
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, offsetY, W, H);

    // Topo Vinho (#4a1018)
    ctx.fillStyle = "#4a1018";
    ctx.fillRect(0, offsetY, W, 238);

    // Faixa Dourada Superior (#be995d)
    ctx.fillStyle = "#be995d";
    ctx.fillRect(0, offsetY + 238, W, 16);

    // Faixa Dourada Inferior (#be995d)
    ctx.fillStyle = "#be995d";
    ctx.fillRect(0, offsetY + 538, W, 16);

    // Rodapé Vinho (#4a1018)
    ctx.fillStyle = "#4a1018";
    ctx.fillRect(0, offsetY + 554, W, 84);

    if (isFront) {
      ctx.fillStyle = "#ffffff";
      ctx.font = "400 31px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("MEMBRO ATIVO", W / 2, offsetY + 46);
    }

    if (logoImg) {
      const targetH = isFront ? 152 : 182;
      const ratio = logoImg.width / Math.max(1, logoImg.height);
      const targetW = targetH * ratio;
      const logoY = isFront ? offsetY + 64 : offsetY + 30;
      ctx.drawImage(logoImg, (W - targetW) / 2, logoY, targetW, targetH);
    } else {
      ctx.fillStyle = "#f3d285";
      ctx.font = "bold 34px Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Igreja Evangélica Restauração", W / 2, offsetY + (isFront ? 148 : 130));
    }

    ctx.restore();
  };

  // 1. DESENHA A FRENTE
  drawCardBase(0, true);

  // Moldura 3x4 da Foto
  const pX = 52;
  const pY = 276;
  const pW = 198;
  const pH = 238;
  if (photoImg) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(pX, pY, pW, pH);
    ctx.clip();
    const imgRatio = photoImg.width / Math.max(1, photoImg.height);
    const boxRatio = pW / pH;
    let dW = pW, dH = pH, dX = pX, dY = pY;
    if (imgRatio > boxRatio) {
      dW = pH * imgRatio;
      dX = pX - (dW - pW) / 2;
    } else {
      dH = pW / imgRatio;
      dY = pY - (dH - pH) / 2;
    }
    ctx.drawImage(photoImg, dX, dY, dW, dH);
    ctx.restore();
  } else {
    ctx.fillStyle = "#d9f0ff";
    ctx.fillRect(pX, pY, pW, pH * 0.65);
    ctx.fillStyle = "#76a305";
    ctx.fillRect(pX, pY + pH * 0.65, pW, pH * 0.35);
  }
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#4a1018";
  ctx.strokeRect(pX, pY, pW, pH);

  // Campos da Frente
  const rows = [
    ["NOME:", user?.name || ""],
    ["CPF:", user?.cpf || ""],
    ["CARGO:", getMemberCargoForCard(user)],
    ["MEMBROU:", formatDate(user?.baptismDate) || ""],
    ["ESTADO:", user?.maritalStatus || "SP"],
  ];
  let startY = 334;
  rows.forEach(([label, val]) => {
    ctx.fillStyle = "#4a1018";
    ctx.font = "600 28px Arial, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(label, 522, startY);

    ctx.font = "bold 28px Arial, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(String(val || ""), 536, startY, 440);
    startY += 35;
  });

  // Pílula VÁLIDO ATÉ: 31/12/2026
  const pillW = 364;
  const pillH = 46;
  const pillX = (W - pillW) / 2;
  const pillY = 518;
  ctx.fillStyle = "#4a1018";
  drawRoundedRectPath(ctx, pillX, pillY, pillW, pillH, 23);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 24px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`VÁLIDO ATÉ: ${user?.cardValidUntil || "31/12/2026"}`, W / 2, pillY + 31);

  // Site no rodapé da frente
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 33px Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("www.ierestauracao.com.br", W / 2, 608);

  // 2. DESENHA O VERSO
  const backY = H + GAP;
  drawCardBase(backY, false);

  ctx.fillStyle = "#4a1018";
  ctx.textAlign = "center";
  ctx.font = "bold 26px Arial, sans-serif";
  ctx.fillText("SEDE", W / 2, backY + 286);
  ctx.fillText("Avenida Mário Trevenzolli, 1199", W / 2, backY + 320);
  ctx.fillText("Campinas / SP", W / 2, backY + 354);
  ctx.font = "bold 28px Arial, sans-serif";
  ctx.fillText("CNPJ: 02.116.066/0001-77", W / 2, backY + 390);

  // Assinaturas Presidente e Secretária
  ctx.strokeStyle = "#4a1018";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(104, backY + 498);
  ctx.lineTo(420, backY + 498);
  ctx.moveTo(590, backY + 498);
  ctx.lineTo(906, backY + 498);
  ctx.stroke();

  ctx.font = "400 26px Arial, sans-serif";
  ctx.fillText("Presidente", 262, backY + 526);
  ctx.fillText("Secretária", 748, backY + 526);

  return canvas;
}

async function downloadMemberCardPng(targetUser = currentUser) {
  if (!targetUser) return;
  const canvas = await renderMemberCardToCanvas(targetUser);
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const safeName = slugifyKey(targetUser.name || "membro");
  link.download = `Carteirinha_IER_${safeName}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function printOrSaveMemberCardPdf(targetUser = currentUser) {
  if (!targetUser) return;
  const canvas = await renderMemberCardToCanvas(targetUser);
  const dataUrl = canvas.toDataURL("image/png");
  const win = window.open("", "_blank");
  if (!win) {
    alert("Permita popups para abrir a versão em PDF para impressão.");
    return;
  }
  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="utf-8" />
      <title>Carteirinha de Membro - ${escapeHtml(targetUser.name)}</title>
      <style>
        body { margin: 0; padding: 24px; background: #f4f4f4; font-family: Arial, sans-serif; text-align: center; }
        .no-print { margin-bottom: 18px; }
        .btn { padding: 10px 18px; background: #60171E; color: #fff; border: 0; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; }
        img { width: 85.6mm; max-width: 100%; height: auto; box-shadow: 0 6px 20px rgba(0,0,0,0.25); border-radius: 8px; }
        @media print {
          body { background: #fff; padding: 0; }
          .no-print { display: none; }
          img { width: 85.6mm; box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print">
        <button class="btn" onclick="window.print()">🖨️ Imprimir ou Salvar como PDF</button>
      </div>
      <img src="${dataUrl}" alt="Carteirinha Frente e Verso" onload="setTimeout(() => window.print(), 350)" />
    </body>
    </html>
  `);
  win.document.close();
}

function renderProfilePage() {
  if (!currentUser) return;
  const form = document.querySelector("#profile-form");
  if (form) {
    if (!form.querySelector("#prof-estado")) {
      const grid = form.querySelector(".form-grid");
      if (grid) {
        grid.insertAdjacentHTML(
          "beforeend",
          `<label>
            Estado / Estado Civil (Campo ESTADO da Carteirinha)
            <input id="prof-estado" name="maritalStatus" type="text" placeholder="Ex: Casado(a) / Solteiro(a) / SP" />
          </label>`
        );
      }
    }

    const fields = {
      "#prof-name": currentUser.name,
      "#prof-member-card": currentUser.memberCard,
      "#prof-cpf": currentUser.cpf,
      "#prof-birth": currentUser.birthDate,
      "#prof-phone": currentUser.phone,
      "#prof-baptism": currentUser.baptismDate,
      "#prof-estado": currentUser.maritalStatus || "SP",
      "#prof-address": currentUser.address,
    };
    Object.entries(fields).forEach(([sel, val]) => {
      const input = document.querySelector(sel);
      if (input && document.activeElement !== input) input.value = val || "";
    });

    if (!form.dataset.liveCardWired) {
      form.dataset.liveCardWired = "true";
      form.addEventListener("input", () => {
        const liveName = document.querySelector("#prof-name")?.value || currentUser.name;
        const liveCpf = document.querySelector("#prof-cpf")?.value || currentUser.cpf;
        const liveBaptism = document.querySelector("#prof-baptism")?.value || currentUser.baptismDate;
        const liveEstado = document.querySelector("#prof-estado")?.value || currentUser.maritalStatus || "SP";

        const nameEl = document.querySelector("#card-live-name");
        const cpfEl = document.querySelector("#card-live-cpf");
        const membrouEl = document.querySelector("#card-live-membrou");
        const estadoEl = document.querySelector("#card-live-estado");
        if (nameEl) nameEl.textContent = liveName || "Não preenchido";
        if (cpfEl) cpfEl.textContent = liveCpf || "___.___.___-__";
        if (membrouEl) membrouEl.textContent = formatDate(liveBaptism) || "__/__/____";
        if (estadoEl) estadoEl.textContent = liveEstado || "SP";
      });
    }
  }

  const cardPreview = document.querySelector("#member-card-preview");
  if (cardPreview) {
    cardPreview.innerHTML = buildIerCardHtml(currentUser);
    cardPreview.querySelector("#download-my-card-png-btn")?.addEventListener("click", () => {
      downloadMemberCardPng({
        ...currentUser,
        name: document.querySelector("#prof-name")?.value || currentUser.name,
        cpf: document.querySelector("#prof-cpf")?.value || currentUser.cpf,
        baptismDate: document.querySelector("#prof-baptism")?.value || currentUser.baptismDate,
        maritalStatus: document.querySelector("#prof-estado")?.value || currentUser.maritalStatus || "SP",
      });
    });
    cardPreview.querySelector("#download-my-card-pdf-btn")?.addEventListener("click", () => {
      printOrSaveMemberCardPdf({
        ...currentUser,
        name: document.querySelector("#prof-name")?.value || currentUser.name,
        cpf: document.querySelector("#prof-cpf")?.value || currentUser.cpf,
        baptismDate: document.querySelector("#prof-baptism")?.value || currentUser.baptismDate,
        maritalStatus: document.querySelector("#prof-estado")?.value || currentUser.maritalStatus || "SP",
      });
    });
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
  const scopedMembers = getVisibleUsers();
  if (secCount) secCount.textContent = String(scopedMembers.length);

  const query = (document.querySelector("#secretaria-search")?.value || "").toLowerCase();
  const filtered = scopedMembers.filter((u) => {
    const text = `${u.name} ${u.login} ${u.cpf || ""} ${u.memberCard || ""} ${u.church} ${getUserSubRolesText(u)}`.toLowerCase();
    return !query || text.includes(query);
  });

  secList.innerHTML = filtered.length
    ? filtered
        .map((u) => {
          const userSubPills = getUserSubRoleList(u)
            .map((k) => `<span class="status-pill">${escapeHtml(SUBROLE_LABELS[k] || k)}</span>`)
            .join("");
          return `
            <article class="visit-item" style="grid-template-columns: minmax(0, 1fr);">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  ${getAvatarHtml(u, 52)}
                  <div>
                    <div class="tag-row">
                      <span class="tag">${escapeHtml(u.memberCard || "Sem Nº")}</span>
                      <span class="tag">${escapeHtml(ROLE_LABELS[u.roleId] || u.role)}</span>
                      ${userSubPills || `<span class="status-pill">Sem subcargo</span>`}
                      <span class="tag">${escapeHtml(u.church)}</span>
                    </div>
                    <h3 style="margin-top: 4px;">${escapeHtml(u.name)}</h3>
                    <small style="color: var(--muted);">E-mail: ${escapeHtml(u.login)} | WhatsApp: ${escapeHtml(u.phone || "Não informado")}</small>
                  </div>
                </div>
                <div style="display:flex; gap:8px; flex-wrap:wrap;">
                  <button type="button" class="primary-button sec-download-png-btn" data-user-id="${escapeHtml(u.id)}" style="min-height:32px; padding:6px 10px; font-size:12px;">
                    📥 Baixar Carteirinha (PNG)
                  </button>
                  <button type="button" class="secondary-button sec-download-pdf-btn" data-user-id="${escapeHtml(u.id)}" style="min-height:32px; padding:6px 10px; font-size:12px;">
                    🖨️ PDF Carteirinha
                  </button>
                </div>
              </div>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; margin-top: 10px; padding: 10px; background: #080808; color: #ffffff; border-radius: 6px; font-size: 13px;">
                <div><strong>CPF:</strong> ${escapeHtml(u.cpf || "Não preenchido")}</div>
                <div><strong>Aniversário:</strong> ${escapeHtml(formatDate(u.birthDate) || "Não preenchido")}</div>
                <div><strong>Membrou/Batismo:</strong> ${escapeHtml(formatDate(u.baptismDate) || "Não preenchido")}</div>
                <div><strong>Estado:</strong> ${escapeHtml(u.maritalStatus || "SP")}</div>
                <div style="grid-column: 1 / -1;"><strong>Endereço Residencial:</strong> ${escapeHtml(u.address || "Não preenchido")}</div>
              </div>
            </article>
          `;
        })
        .join("")
    : emptyCard("Nenhum membro encontrado para esta busca.");

  secList.querySelectorAll(".sec-download-png-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = appState.users.find((u) => u.id === btn.dataset.userId);
      if (target) downloadMemberCardPng(target);
    });
  });

  secList.querySelectorAll(".sec-download-pdf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = appState.users.find((u) => u.id === btn.dataset.userId);
      if (target) printOrSaveMemberCardPdf(target);
    });
  });
}

// Renderização da Rádio Ao Vivo Multi-Locutores (Sincroniza tanto a página quanto o Popup Flutuante)
function renderRadioPage() {
  const live = appState.radioLive || { active: false };
  const activeSpeakers = getActiveRadioSpeakers(live);
  const isActuallyLive = Boolean((live.active && activeSpeakers.length > 0) || isBroadcastingMic);
  const canBroadcast = canBroadcastRadio();

  const speakersNamesText = activeSpeakers.length
    ? activeSpeakers.map((s) => s.name).join(" • ")
    : live.speakerName || "Locutor";

  const speakersChurchesText = activeSpeakers.length
    ? activeSpeakers.map((s) => `${s.name} (${s.church || "Igreja"})`).join(" | ")
    : live.speakerChurch || "";

  // Atualiza pílulas de locutores ativos na bancada
  const pillsContainer = document.querySelector("#popup-active-speakers-pills");
  if (pillsContainer) {
    pillsContainer.innerHTML = activeSpeakers.length
      ? activeSpeakers
          .map(
            (sp) => `
            <span class="tag" style="background:#60171E; border-color:#ffffff;">
              🎙️ ${escapeHtml(sp.name)} <small style="opacity:0.8; margin-left:4px;">(${escapeHtml(sp.church || "")})</small>
            </span>
          `
          )
          .join("")
      : `<span class="status-pill">Bancada livre — você e outros líderes autorizados podem entrar juntos ao vivo</span>`;
  }

  // Atualiza barra minimizada do Popup
  const miniBar = document.querySelector("#radio-mini-bar");
  const miniTitle = document.querySelector("#popup-mini-title");
  const miniSub = document.querySelector("#popup-mini-sub");
  const miniListenBtn = document.querySelector("#popup-mini-listen-btn");

  if (miniBar) {
    miniBar.classList.toggle("is-live", isActuallyLive);
  }
  if (miniTitle) {
    miniTitle.textContent = isBroadcastingMic
      ? isMicPausedForListening
        ? "⏸️ Mic Pausado (Ouvindo Bancada)"
        : `🎙️ No Ar (${activeSpeakers.length || 1} na bancada)`
      : isActuallyLive
        ? `🔴 ${live.title || "Rádio Ao Vivo"}`
        : "📻 Rádio Ao Vivo";
  }
  if (miniSub) {
    miniSub.textContent = isBroadcastingMic
      ? isMicPausedForListening
        ? "Seu mic está fechado para ouvir o outro locutor"
        : "Só saída de Mic ativa (Alto-falante cortado = Sem Eco)"
      : isActuallyLive
        ? `Na bancada (${activeSpeakers.length}): ${speakersNamesText}`
        : isListeningRadio
          ? "Sintonizado (aguardando locutores)"
          : "Toque para abrir o popup";
  }
  if (miniListenBtn) {
    if (isBroadcastingMic && !isMicPausedForListening) {
      miniListenBtn.textContent = "🔇 Só Mic";
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
    badge.textContent = isActuallyLive
      ? `🔴 AO VIVO (${activeSpeakers.length || 1} Locutor${activeSpeakers.length > 1 ? "es" : ""})`
      : "Offline no momento";
    badge.style.background = isActuallyLive ? "#60171E" : "#141414";
    badge.style.color = "#ffffff";
  });

  // Atualiza indicadores luminosos
  ["#radio-live-indicator", "#popup-radio-live-indicator"].forEach((sel) => {
    const indicator = document.querySelector(sel);
    if (!indicator) return;
    indicator.style.background = isActuallyLive ? "#ef4444" : "#9ca3af";
    indicator.style.boxShadow = isActuallyLive ? "0 0 12px #ef4444" : "none";
  });

  const titleEl = document.querySelector("#radio-current-title");
  if (titleEl) {
    titleEl.textContent = isActuallyLive ? live.title || "Transmissão Ao Vivo" : "Aguardando início da transmissão";
  }

  ["#radio-speaker-name", "#popup-radio-speaker-name"].forEach((sel) => {
    const speakerEl = document.querySelector(sel);
    if (speakerEl) {
      speakerEl.textContent = isActuallyLive
        ? `🎙️ Na Bancada (${activeSpeakers.length || 1}): ${speakersNamesText}`
        : "Ninguém ao vivo no momento";
    }
  });

  ["#radio-speaker-church", "#popup-radio-speaker-church"].forEach((sel) => {
    const churchEl = document.querySelector(sel);
    if (churchEl) {
      churchEl.textContent = isActuallyLive
        ? `${speakersChurchesText} — Mais de uma pessoa pode participar ao vivo!`
        : "Mais de um líder pode entrar na bancada ao vivo (o alto-falante de quem fala fica cortado para não dar eco).";
    }
  });

  const pauseBtn = document.querySelector("#popup-pause-mic-btn");
  if (pauseBtn) {
    pauseBtn.style.display = isBroadcastingMic ? "inline-flex" : "none";
    pauseBtn.textContent = isMicPausedForListening
      ? "🎙️ Abrir Meu Mic p/ Falar"
      : "⏸️ Pausar Mic p/ Ouvir Bancada";
  }

  ["#stop-broadcast-btn", "#popup-stop-broadcast-btn"].forEach((sel) => {
    const stopBtn = document.querySelector(sel);
    if (stopBtn) {
      stopBtn.style.display = (isActuallyLive || isBroadcastingMic) && canBroadcast ? "inline-flex" : "none";
    }
  });

  ["#external-audio-player", "#popup-external-audio-player"].forEach((sel) => {
    const extPlayer = document.querySelector(sel);
    if (!extPlayer) return;
    if (isActuallyLive && live.streamUrl && (!isBroadcastingMic || isMicPausedForListening)) {
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
        <div style="padding: 9px 10px; border: 1px solid var(--line); border-radius: 6px; background: #121212; color: #ffffff;">
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
let lastRenderedNotifSignature = "";
let lastRenderedCalSignature = "";

async function syncRadioChatAndStatus() {
  const chatEndpoint = getCloudEndpoint("appigreja_radio_chat");
  const stateEndpoint = getCloudEndpoint("appigreja_state");
  if (!chatEndpoint || !stateEndpoint) return;

  try {
    const [chatRes, stateRes] = await Promise.all([
      fetch(chatEndpoint, { cache: "no-store" }),
      fetch(stateEndpoint, { cache: "no-store" }),
    ]);

    let shouldRenderRadio = false;
    let shouldRenderNotifs = false;
    let shouldRenderCalendar = false;

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
        shouldRenderRadio = true;
      }
    }

    if (stateRes.ok) {
      const cloudState = await stateRes.json();
      if (cloudState && typeof cloudState === "object") {
        const normalizedCloud = normalizeStateData(cloudState);

        await checkAndDispatchNewCloudAlerts(normalizedCloud);

        const liveSig = JSON.stringify(normalizedCloud.radioLive);
        if (liveSig !== lastRenderedLiveSignature) {
          lastRenderedLiveSignature = liveSig;
          appState.radioLive = normalizedCloud.radioLive;
          shouldRenderRadio = true;
        }

        const notifSig = JSON.stringify(normalizedCloud.notifications);
        if (notifSig !== lastRenderedNotifSignature) {
          lastRenderedNotifSignature = notifSig;
          appState.notifications = normalizedCloud.notifications;
          shouldRenderNotifs = true;
        }

        const calSig = JSON.stringify(normalizedCloud.calendarEvents);
        if (calSig !== lastRenderedCalSignature) {
          lastRenderedCalSignature = calSig;
          appState.calendarEvents = normalizedCloud.calendarEvents;
          shouldRenderCalendar = true;
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
      }
    }

    if (shouldRenderRadio) renderRadioPage();
    if (shouldRenderNotifs) renderNotifications();
    if (shouldRenderCalendar) renderCalendar();
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
  markCurrentItemsAsSeen();
  syncRadioChatAndStatus();

  if (!backgroundSyncWorker && typeof Worker !== "undefined" && typeof Blob !== "undefined") {
    try {
      const workerBlob = new Blob(
        [
          `setInterval(() => { postMessage("tick"); }, 3000);`
        ],
        { type: "application/javascript" }
      );
      backgroundSyncWorker = new Worker(URL.createObjectURL(workerBlob));
      backgroundSyncWorker.onmessage = () => {
        syncRadioChatAndStatus();
      };
      return;
    } catch {
      // Fallback para setInterval padrão
    }
  }

  if (radioChatSyncInterval) clearInterval(radioChatSyncInterval);
  radioChatSyncInterval = setInterval(syncRadioChatAndStatus, 3000);
}

// ============================================================================
// MOTOR DE ÁUDIO MULTI-LOCUTORES (MICROFONE SÓ ENVIA / ALTO-FALANTE CORTADO = ZERO ECO)
// ============================================================================
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

// Corta imediatamente qualquer som no alto-falante local para impedir microfonia/eco
function muteAllLocalAudioOutput() {
  audioPlaybackQueue = [];
  isPlayingQueueItem = false;
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.muted = true;
      currentPlayingAudio.volume = 0;
    } catch {}
    currentPlayingAudio = null;
  }
  ["#external-audio-player", "#popup-external-audio-player"].forEach((sel) => {
    const extPlayer = document.querySelector(sel);
    if (extPlayer) {
      extPlayer.pause();
      extPlayer.muted = true;
    }
  });
}

// Se o navegador suportar setSinkId, direciona o áudio para fone/headset/auricular em vez do alto-falante aberto
async function routeAudioToHeadsetIfAvailable(audioEl) {
  if (!audioEl || typeof audioEl.setSinkId !== "function" || !navigator.mediaDevices?.enumerateDevices) {
    return;
  }
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const outputs = devices.filter((d) => d.kind === "audiooutput");
    const headset = outputs.find((d) => /headphone|headset|earpiece|bluetooth|fone|usb/i.test(d.label || ""));
    if (headset && headset.deviceId) {
      await audioEl.setSinkId(headset.deviceId);
    }
  } catch {
    // Segue saída padrão se o sistema não permitir troca de sink
  }
}

async function registerSpeakerInBancada(title, streamUrl) {
  await syncFromCloud();
  const currentLive = appState.radioLive && typeof appState.radioLive === "object" ? appState.radioLive : {};
  const speakers = currentLive.speakers && typeof currentLive.speakers === "object" ? { ...currentLive.speakers } : {};

  speakers[DEVICE_INSTANCE_ID] = {
    deviceId: DEVICE_INSTANCE_ID,
    userId: currentUser.id,
    name: currentUser.name,
    church: `${currentUser.church} (${ROLE_LABELS[currentUser.roleId] || currentUser.role})`,
    joinedAt: speakers[DEVICE_INSTANCE_ID]?.joinedAt || Date.now(),
    lastActiveAt: Date.now(),
  };

  const activeNames = Object.values(speakers).map((s) => s.name).join(" • ");

  appState.radioLive = {
    active: true,
    title: title || currentLive.title || "Palavra Pastoral Ao Vivo",
    speakerName: activeNames || currentUser.name,
    speakerChurch: `${currentUser.church} (${ROLE_LABELS[currentUser.roleId] || currentUser.role})`,
    streamUrl: streamUrl || currentLive.streamUrl || "",
    updatedAt: Date.now(),
    speakers,
  };
  markCurrentItemsAsSeen();
  await saveAppState();
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

  // 1. Trava imediatamente a saída de alto-falante neste aparelho (Microfone Somente Envio = Zero Eco)
  isBroadcastingMic = true;
  isMicPausedForListening = false;
  if (!isHeadsetCoHostMode) {
    isListeningRadio = false;
    muteAllLocalAudioOutput();
  }

  setRadioButtonsAndStatus(
    "🔇 Alto-Falante Cortado (Modo Locutor)",
    true,
    "Somente saída do Microfone ativa (o alto-falante deste aparelho está desligado para não dar eco).",
    null
  );

  await registerSpeakerInBancada(title, streamUrl);
  renderRadioPage();

  if (streamUrl) {
    setRadioButtonsAndStatus(null, null, null, "🔴 Rádio Ao Vivo iniciada com Link de Stream!");
    return;
  }

  try {
    // 2. Abre o microfone apenas para gravação/envio (nunca conectado ao alto-falante local!)
    micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
      },
      video: false,
    });

    setRadioButtonsAndStatus(
      null,
      null,
      null,
      "🔴 MICROFONE NO AR (Só Envio / Alto-Falante Desligado)! Mais pessoas podem entrar na bancada junto com você."
    );

    const recordAndSendChunk = () => {
      if (!micStream || !isBroadcastingMic || isMicPausedForListening) return;
      const recorder = new MediaRecorder(micStream);
      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };
      recorder.onstop = () => {
        if (!chunks.length || !isBroadcastingMic || isMicPausedForListening) return;
        const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const payload = {
            id: Date.now(),
            deviceId: DEVICE_INSTANCE_ID,
            speakerId: currentUser?.id || "",
            speaker: currentUser?.name || "Locutor",
            audioUrl: String(reader.result || ""),
          };
          try {
            // Salva no canal individual deste locutor (permite vários locutores ao vivo ao mesmo tempo!) e no nó geral
            await Promise.all([
              fetch(getCloudEndpoint(`appigreja_radio_chunks/${DEVICE_INSTANCE_ID}`), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }),
              fetch(getCloudEndpoint("appigreja_radio_chunk"), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              }),
              fetch(getCloudEndpoint(`appigreja_state/radioLive/speakers/${DEVICE_INSTANCE_ID}/lastActiveAt`), {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(Date.now()),
              }),
            ]);
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
    setRadioButtonsAndStatus(
      null,
      null,
      null,
      "Permissão de microfone negada no navegador. Libere o microfone no cadeado da barra de endereços!"
    );
  }
}

// Permite a um locutor pausar o próprio microfone para ouvir outro co-locutor da bancada sem eco
function togglePauseBroadcasterMic() {
  if (!isBroadcastingMic) return;
  isMicPausedForListening = !isMicPausedForListening;

  if (micStream) {
    micStream.getAudioTracks().forEach((track) => {
      track.enabled = !isMicPausedForListening;
    });
  }

  if (isMicPausedForListening) {
    ensureCoHostListenerLoop();
    setRadioButtonsAndStatus(
      "🔊 Ouvindo outros locutores da bancada",
      false,
      "Seu microfone está pausado para você ouvir os outros locutores sem eco.",
      "⏸️ Seu microfone está fechado. Você está ouvindo os outros integrantes da bancada."
    );
  } else {
    if (!isHeadsetCoHostMode) {
      muteAllLocalAudioOutput();
    }
    setRadioButtonsAndStatus(
      "🔇 Alto-Falante Cortado (Modo Locutor)",
      true,
      "Microfone aberto enviando sua voz (alto-falante cortado para não dar eco).",
      "🎙️ Microfone reaberto! Sua voz está sendo enviada ao vivo."
    );
  }
  renderRadioPage();
}

async function stopBroadcast() {
  isBroadcastingMic = false;
  isMicPausedForListening = false;
  if (micRecorderInterval) {
    clearInterval(micRecorderInterval);
    micRecorderInterval = null;
  }
  if (micStream) {
    micStream.getTracks().forEach((t) => t.stop());
    micStream = null;
  }

  // Remove apenas o canal de áudio deste locutor da bancada
  try {
    await fetch(getCloudEndpoint(`appigreja_radio_chunks/${DEVICE_INSTANCE_ID}`), { method: "DELETE" });
  } catch {}

  await syncFromCloud();
  const currentSpeakers = { ...(appState.radioLive?.speakers || {}) };
  delete currentSpeakers[DEVICE_INSTANCE_ID];
  // Remove também entradas antigas inativas (> 60s)
  const now = Date.now();
  Object.keys(currentSpeakers).forEach((k) => {
    if (currentSpeakers[k]?.lastActiveAt && now - Number(currentSpeakers[k].lastActiveAt) > 60000) {
      delete currentSpeakers[k];
    }
  });

  const remainingSpeakers = Object.values(currentSpeakers);

  if (remainingSpeakers.length > 0) {
    // Outros locutores continuam ao vivo na bancada!
    appState.radioLive.speakers = currentSpeakers;
    appState.radioLive.speakerName = remainingSpeakers.map((s) => s.name).join(" • ");
    appState.radioLive.active = true;
  } else {
    // Era o último locutor: encerra a transmissão
    fetch(getCloudEndpoint("appigreja_radio_chunk"), { method: "DELETE" }).catch(() => {});
    appState.radioLive = {
      active: false,
      title: "",
      speakerName: "",
      speakerChurch: "",
      streamUrl: "",
      updatedAt: Date.now(),
      speakers: {},
    };
  }

  await saveAppState();

  setRadioButtonsAndStatus(
    "🔊 Conectar Áudio para Ouvir",
    false,
    remainingSpeakers.length > 0
      ? `Você saiu da bancada (${remainingSpeakers.length} locutor(es) continuam no ar). Toque acima se quiser ouvir.`
      : "Transmissão encerrada. Toque no botão acima se quiser ouvir quando alguém entrar.",
    "⏹️ Seu microfone foi desligado e você saiu da bancada ao vivo."
  );
  renderRadioPage();
}

function playNextQueuedAudioChunk() {
  if (isPlayingQueueItem || !audioPlaybackQueue.length) return;
  // Se este aparelho estiver com o microfone aberto falando e NÃO estiver no modo fone, corta o alto-falante imediatamente
  if (isBroadcastingMic && !isMicPausedForListening && !isHeadsetCoHostMode) {
    muteAllLocalAudioOutput();
    return;
  }

  const nextChunk = audioPlaybackQueue.shift();
  if (!nextChunk || !nextChunk.audioUrl) {
    playNextQueuedAudioChunk();
    return;
  }

  isPlayingQueueItem = true;
  const audio = new Audio(nextChunk.audioUrl);
  currentPlayingAudio = audio;
  routeAudioToHeadsetIfAvailable(audio);

  audio.onended = () => {
    isPlayingQueueItem = false;
    playNextQueuedAudioChunk();
  };
  audio.onerror = () => {
    isPlayingQueueItem = false;
    playNextQueuedAudioChunk();
  };

  audio.play().catch(() => {
    isPlayingQueueItem = false;
  });
  setRadioButtonsAndStatus(null, null, `🔊 Ouvindo ao vivo: ${nextChunk.speaker || "Locutor"}`, null);
}

function ensureCoHostListenerLoop() {
  if (!radioListenerInterval) {
    startRadioPollingInterval();
  }
}

function startRadioPollingInterval() {
  if (radioListenerInterval) clearInterval(radioListenerInterval);
  radioListenerInterval = setInterval(async () => {
    const canHearNow =
      (isListeningRadio && !isBroadcastingMic) ||
      (isBroadcastingMic && (isMicPausedForListening || isHeadsetCoHostMode));

    if (!canHearNow) return;

    const multiEndpoint = getCloudEndpoint("appigreja_radio_chunks");
    if (!multiEndpoint) return;

    try {
      const res = await fetch(multiEndpoint, { cache: "no-store" });
      if (!res.ok) return;
      const chunksMap = await res.json();
      if (!chunksMap || typeof chunksMap !== "object") return;

      const now = Date.now();
      Object.values(chunksMap).forEach((chunk) => {
        if (!chunk || !chunk.id || !chunk.audioUrl) return;
        // TRAVA ABSOLUTA ANTI-ECO: Jamais reproduz a própria voz deste aparelho ou deste usuário!
        if (chunk.deviceId === DEVICE_INSTANCE_ID) return;
        if (currentUser && chunk.speakerId && chunk.speakerId === currentUser.id) return;

        const devKey = chunk.deviceId || "default";
        if (lastPlayedChunkByDevice[devKey] !== chunk.id && now - Number(chunk.id) < 15000) {
          lastPlayedChunkByDevice[devKey] = chunk.id;
          audioPlaybackQueue.push(chunk);
        }
      });

      playNextQueuedAudioChunk();
    } catch {
      // ignora oscilações de rede
    }
  }, 1500);
}

function startListeningRadioLoop() {
  // Se este aparelho estiver com o microfone aberto falando (sem modo fone), mantém alto-falante bloqueado
  if (isBroadcastingMic && !isMicPausedForListening && !isHeadsetCoHostMode) {
    setRadioButtonsAndStatus(
      null,
      null,
      "🔇 Seu microfone está aberto enviando voz! O alto-falante fica desligado aqui para nunca dar eco.",
      null
    );
    return;
  }

  isListeningRadio = !isListeningRadio;
  const extPlayer = document.querySelector("#popup-external-audio-player") || document.querySelector("#external-audio-player");

  if (!isListeningRadio) {
    muteAllLocalAudioOutput();
    setRadioButtonsAndStatus("🔊 Conectar Áudio para Ouvir", false, "🔇 Áudio silenciado neste aparelho.", null);
    renderRadioPage();
    return;
  }

  setRadioButtonsAndStatus("🔇 Silenciar Rádio neste Aparelho", false, "✅ Sintonizado na Bancada Ao Vivo!", null);
  renderRadioPage();

  if (extPlayer && appState.radioLive?.streamUrl) {
    extPlayer.muted = false;
    extPlayer.play().catch(() => {});
  }

  startRadioPollingInterval();
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
  renderCustomCatalogTags();

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
  document.querySelector("#push-permission-btn")?.addEventListener("click", () => {
    requestPushNotificationPermission(true);
  });
  updatePushPermissionButtonUI();
  document.querySelector("#reset-db-btn")?.addEventListener("click", resetEntireDatabase);

  // Abrir/fechar caixa de Adicionar Cargo Principal
  document.querySelector("#toggle-add-role-box")?.addEventListener("click", () => {
    const box = document.querySelector("#add-role-box");
    if (box) {
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") {
        document.querySelector("#new-role-name")?.focus();
      }
    }
  });

  // Salvar Novo Cargo Principal Dinâmico no Firebase
  document.querySelector("#add-role-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const nameInput = document.querySelector("#new-role-name");
    const scopeSelect = document.querySelector("#new-role-scope");
    const rawName = String(nameInput?.value || "").trim();
    const scope = scopeSelect?.value || "local_admin";
    if (!rawName) return;

    const key = `role_${slugifyKey(rawName)}`;
    appState.customRoles = appState.customRoles || {};
    appState.customRoles[key] = { label: rawName, scope };
    refreshDynamicCatalogs(appState);
    await saveAppState();
    if (nameInput) nameInput.value = "";
    const fb = document.querySelector("#role-save-feedback");
    if (fb) fb.textContent = `➕ Cargo Principal "${rawName}" adicionado com sucesso!`;
    renderAll();
  });

  // Abrir/fechar caixas de Adicionar Subcargo e Adicionar Igreja Local
  document.querySelector("#toggle-add-subrole-box")?.addEventListener("click", () => {
    const box = document.querySelector("#add-subrole-box");
    if (box) {
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") {
        document.querySelector("#new-subrole-name")?.focus();
      }
    }
  });

  document.querySelector("#toggle-add-church-box")?.addEventListener("click", () => {
    const box = document.querySelector("#add-church-box");
    if (box) {
      box.style.display = box.style.display === "none" ? "block" : "none";
      if (box.style.display === "block") {
        document.querySelector("#new-church-name")?.focus();
      }
    }
  });

  // Salvar Novo Subcargo Dinâmico no Firebase
  document.querySelector("#add-subrole-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.querySelector("#new-subrole-name");
    const rawName = String(input?.value || "").trim().toUpperCase();
    if (!rawName) return;
    const key = `sub_${slugifyKey(rawName)}`;
    appState.customSubRoles = appState.customSubRoles || {};
    appState.customSubRoles[key] = rawName;
    refreshDynamicCatalogs(appState);
    await saveAppState();
    if (input) input.value = "";
    const fb = document.querySelector("#role-save-feedback");
    if (fb) fb.textContent = `➕ Subcargo "${rawName}" adicionado à lista com sucesso!`;
    renderAll();
  });

  // Salvar Nova Igreja Local Dinâmica no Firebase
  document.querySelector("#add-church-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!hasGlobalScope()) return;
    const nameInput = document.querySelector("#new-church-name");
    const pastorInput = document.querySelector("#new-church-pastor");
    const rawName = String(nameInput?.value || "").trim();
    const rawPastor = String(pastorInput?.value || "").trim();
    if (!rawName || !rawPastor) return;

    const churchKey = slugifyKey(rawName) || `igr_${Date.now()}`;
    const pastorKey = slugifyKey(rawPastor) || `pr_${Date.now()}`;
    appState.customChurches = appState.customChurches || {};
    appState.customChurches[churchKey] = {
      name: rawName,
      pastor: rawPastor,
      pastorId: pastorKey,
    };
    refreshDynamicCatalogs(appState);
    await saveAppState();
    if (nameInput) nameInput.value = "";
    if (pastorInput) pastorInput.value = "";
    const fb = document.querySelector("#role-save-feedback");
    if (fb) fb.textContent = `⛪ Igreja "${rawName}" (${rawPastor}) adicionada ao sistema!`;
    renderAll();
  });

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
    currentUser.maritalStatus = String(form.get("maritalStatus") || "SP").trim();
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
    const selectedSubs = form.getAll("subRoles").filter((k) => k && k !== "nenhum");
    const subRoleId = selectedSubs[0] || "nenhum";

    appState.users.push({
      id: `user_${Date.now()}`,
      name: String(form.get("name")).trim(),
      login: rawEmail.toLowerCase(),
      loginKey,
      passwordHash: await hashPassword(String(form.get("password"))),
      roleId,
      role: ROLE_LABELS[roleId] || "Obreiro",
      subRoleIds: selectedSubs,
      subRoleId,
      subRole: selectedSubs.length ? selectedSubs.map((k) => SUBROLE_LABELS[k]).join(" • ") : "Sem subcargo específico",
      canBroadcast: roleId === "adm" || roleId === "adm_igreja" || selectedSubs.includes("pastor_adm") || selectedSubs.includes("adm_igreja"),
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
    markCurrentItemsAsSeen();
    await saveAppState();
    formElement.reset();
    const fb = document.querySelector("#notif-feedback");
    if (fb) fb.textContent = "Notificação publicada e enviada para todos os aparelhos!";
    renderNotifications();
    await triggerSystemNotification({
      title: `🔔 ${appState.notifications[0]?.title || "Nova Notificação"}`,
      body: appState.notifications[0]?.message || "",
      tag: `notif_${appState.notifications[0]?.id}`,
      url: "./notificacoes.html",
    });
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
    const createdEv = appState.calendarEvents[appState.calendarEvents.length - 1];
    markCurrentItemsAsSeen();
    await saveAppState();
    formElement.reset();
    const monthInput = document.querySelector("#calendar-month");
    if (monthInput && eventDate) {
      monthInput.value = eventDate.slice(0, 7);
    }
    const fb = document.querySelector("#cal-feedback");
    if (fb) fb.textContent = "Evento salvo e notificação enviada para todos!";
    renderCalendar();
    if (createdEv) {
      await triggerSystemNotification({
        title: `📅 Novo Evento: ${createdEv.title}`,
        body: `${formatDate(createdEv.date)}${createdEv.time ? " às " + createdEv.time : ""} — ${createdEv.church}`,
        tag: `cal_${createdEv.id}`,
        url: "./calendario.html",
      });
    }
  });
}

async function initApp() {
  injectCriticalFixesCss();
  injectPwaTags();
  registerAppServiceWorker();
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
