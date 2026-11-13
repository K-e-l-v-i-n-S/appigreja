const STORAGE_KEY = "appigreja_prototype_state_v1";
const SESSION_KEY = "appigreja_prototype_session_v1";
const CLOUD_INIT_KEY = "appigreja_cloud_initialized_v1";
const SEEN_ALERTS_KEY = "appigreja_seen_alerts_v1";

// LINK DO SEU FIREBASE REALTIME DATABASE JÁ CONFIGURADO:
const CLOUD_DB_URL = "https://appigreja-1f504-default-rtdb.firebaseio.com";

// Identificador único desta aba/aparelho para nunca reproduzir a própria voz no aparelho que transmite
const DEVICE_INSTANCE_ID = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const DEFAULT_CHURCHES = {
  sede: { name: "Igreja Sede", pastor: "Bispo Wagner", pastorId: "bispo-wagner" },
  campineiro: { name: "Igreja Campineiro", pastor: "Pastora Lindamir", pastorId: "pra-lindamir" },
  mogi: { name: "Igreja Mogi Guaçu", pastor: "Pastor Paulo", pastorId: "pr-paulo" },
};

// CARGOS PRINCIPAIS PADRÃO (Com divisão visível de Secretarias e ADMs)
const DEFAULT_ROLE_LABELS = {
  obreiro: "Obreiro",
  lideranca: "Liderança",
  secretaria_local: "Secretaria Local (Igreja)",
  secretaria_sede: "Secretaria Geral (Sede)",
  pastor: "Pastor",
  adm_igreja: "ADM de Igreja",
  bispo: "Bispo",
  adm: "ADM Geral",
};

// SUBCARGOS E FUNÇÕES MINISTERIAIS PADRÃO (Com divisão visível de Secretarias)
const DEFAULT_SUBROLE_LABELS = {
  nenhum: "Sem subcargo específico",
  secretaria_sede: "SECRETARIA GERAL (SEDE)",
  secretaria_local: "SECRETARIA LOCAL (IGREJA)",
  adm_igreja: "ADM DE IGREJA LOCAL",
  pastor_adm: "PASTOR ADM",
  pastor_aux: "PASTOR AUX",
  lider_obreiro: "LÍDER OBREIRO",
  lider_zaqueu: "LÍDER ZAQUEU",
  lider_louvor_sede: "LÍDER LOUVOR SEDE",
  lider_louvor_campineiro: "LÍDER LOUVOR CAMPINEIRO",
  lider_louvor_mogi: "LÍDER LOUVOR MOGI GUAÇU",
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

const ALL_ROLES = Object.keys(DEFAULT_ROLE_LABELS);

const PAGE_PERMISSIONS = {
  "dashboard.html": ["secretaria_local", "secretaria_sede", "secretaria", "pastor", "adm_igreja", "bispo", "adm"],
  "visitas.html": ALL_ROLES,
  "nova-visita.html": ALL_ROLES,
  "zaqueus.html": ALL_ROLES,
  "calendario.html": ALL_ROLES,
  "biblioteca.html": ALL_ROLES,
  "visao.html": ["lideranca", "secretaria_local", "secretaria_sede", "secretaria", "pastor", "adm_igreja", "bispo", "adm"],
  "notificacoes.html": ALL_ROLES,
  "perfil.html": ALL_ROLES,
  "radio.html": ALL_ROLES,
};

const NAV_ITEMS = [
  { href: "dashboard.html", icon: "D", label: "Dashboard & Cargos", roles: PAGE_PERMISSIONS["dashboard.html"] },
  { href: "perfil.html", icon: "P", label: "Meu Perfil", roles: ALL_ROLES },
  { href: "radio.html", icon: "R", label: "Rádio Ao Vivo", roles: ALL_ROLES },
  { href: "visitas.html", icon: "V", label: "Visitas realizadas", roles: ALL_ROLES },
  { href: "nova-visita.html", icon: "+", label: "Nova visita", roles: ALL_ROLES },
  { href: "zaqueus.html", icon: "Z", label: "Zaqueus", roles: ALL_ROLES },
  { href: "calendario.html", icon: "C", label: "Calendário Igreja", roles: ALL_ROLES },
  { href: "biblioteca.html", icon: "B", label: "Biblioteca", roles: ALL_ROLES },
  { href: "visao.html", icon: "G", label: "Visão Geral", roles: PAGE_PERMISSIONS["visao.html"] },
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
    },
    radioMessages: [],
  };
}

function refreshDynamicCatalogs(stateObj = appState) {
  CHURCHES = { ...DEFAULT_CHURCHES, ...(stateObj?.customChurches || {}) };
  SUBROLE_LABELS = { ...DEFAULT_SUBROLE_LABELS, ...(stateObj?.customSubRoles || {}) };

  const dynamicRoles = {};
  Object.entries(stateObj?.customRoles || {}).forEach(([k, val]) => {
    dynamicRoles[k] = typeof val === "object" && val !== null ? val.label : String(val);
  });
  ROLE_LABELS = { ...DEFAULT_ROLE_LABELS, ...dynamicRoles };

  const allRoleKeys = Object.keys(ROLE_LABELS);
  const managerRoleKeys = allRoleKeys.filter((k) => {
    if (["secretaria_local", "secretaria_sede", "secretaria", "pastor", "adm_igreja", "bispo", "adm"].includes(k)) return true;
    const scope = stateObj?.customRoles?.[k]?.scope;
    return scope === "global" || scope === "local";
  });

  PAGE_PERMISSIONS["dashboard.html"] = managerRoleKeys;
  PAGE_PERMISSIONS["visao.html"] = ["lideranca", ...managerRoleKeys];
  ["visitas.html", "nova-visita.html", "zaqueus.html", "calendario.html", "biblioteca.html", "notificacoes.html", "perfil.html", "radio.html"].forEach((p) => {
    PAGE_PERMISSIONS[p] = allRoleKeys;
  });
  NAV_ITEMS.forEach((item) => {
    item.roles = PAGE_PERMISSIONS[item.href] || allRoleKeys;
  });
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

// Funções para Múltiplos Subcargos por Pessoa
function getUserSubRoleList(user) {
  if (!user) return [];
  const rawList = Array.isArray(user.subRoleIds)
    ? user.subRoleIds
    : user.subRoleId && user.subRoleId !== "nenhum"
      ? [user.subRoleId]
      : [];
  const valid = [];
  rawList.forEach((key) => {
    let k = key;
    if (k === "secretaria") {
      k = user.churchId === "sede" ? "secretaria_sede" : "secretaria_local";
    }
    if (k && k !== "nenhum" && SUBROLE_LABELS[k] && !valid.includes(k)) {
      valid.push(k);
    }
  });
  return valid;
}

function userHasSubRole(user, keysArray) {
  if (!user) return false;
  const userSubs = getUserSubRoleList(user);
  return keysArray.some((k) => userSubs.includes(k));
}

function getUserSubRolesText(user) {
  const list = getUserSubRoleList(user);
  if (!list.length) return SUBROLE_LABELS.nenhum;
  return list.map((k) => SUBROLE_LABELS[k]).join(" + ");
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

    if (u.roleId === "secretaria") {
      u.roleId = u.churchId === "sede" ? "secretaria_sede" : "secretaria_local";
    }
    if (!ROLE_LABELS[u.roleId]) u.roleId = "obreiro";
    u.role = ROLE_LABELS[u.roleId];

    u.subRoleIds = getUserSubRoleList(u);
    u.subRoleId = u.subRoleIds[0] || "nenhum";
    u.subRole = getUserSubRolesText(u);

    u.canBroadcast = Boolean(
      u.canBroadcast ||
        u.roleId === "adm" ||
        u.roleId === "adm_igreja" ||
        u.subRoleIds.includes("pastor_adm") ||
        u.subRoleIds.includes("adm_igreja")
    );
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

  // Usa um Web Worker em 2º plano para o timer não congelar quando o usuário minimizar o app ou trocar de janela
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
  markCurrentItemsAsSeen();
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
