/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the Gemini AI model. Assumes API_key is set in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const FALLBACK_MODEL_NAME = 'gemini-2.5-flash';

// ---------------------- Seed KB & Demo Data ----------------------
const emptyData = {
  kb: ``,
  customers: [],
  products: [],
  orders: [],
  samples: [],
  dashboard: {
    resolved: 0,
    csat: "N/A",
    art: "N/A",
    aiGenerations: 0,
    intents: {}
  },
  team: []
};

let appData = JSON.parse(JSON.stringify(emptyData));

const DEFAULT_KB = appData.kb;

// ---------------------- i18n ----------------------
const translations = {
  fr: {
    "header.title": "Chat Agent Co‑Pilot", "header.subtitle.main": "Gemini powered", "header.subtitle.soon": "(bientôt GPT powered)", "header.historyBtn": "Historique", "header.settingsBtn": "Paramètres", "header.adminBtn": "Centre d’administration",
    "kb.title": "Base de connaissances", "kb.searchPlaceholder": "Rechercher dans la KB...", "kb.resetBtn": "Réinitialiser",
    "composer.title": "Message du client", "composer.shortcutLabel": "Raccourci", "composer.translateBtn": "Traduire en FR", "composer.placeholder": "Collez ici le message du client...", "composer.generateBtn": "Générer", "composer.clearBtn": "Effacer", "composer.modelLabel": "Modèle", "composer.creativityLabel": "Créativité", "composer.lengthLabel": "Longueur",
    "results.title": "Proposition du Co‑Pilote", "results.checkPolicyBtn": "Voir le conseil de l'IA", "results.generating": "Génération...", "results.placeholder": "La réponse générée apparaîtra ici...", "results.refinePlaceholder": "Votre instruction de personnalisation... (ex: Rends le ton plus formel)", "results.updateBtn": "Mettre à jour", "results.updating": "Mise à jour...", "results.copyBtn": "Copier la réponse", "results.disclaimer": "L'IA peut faire des erreurs. Vérifiez toujours les informations importantes.",
    "insights.title": "Insights & Routage", "insights.intent": "Intent", "insights.language": "Langue", "insights.sentiment": "Sentiment", "insights.urgency": "Urgence", "insights.steps": "Étapes suggérées", "insights.noSteps": "Aucune étape suggérée.", "insights.kbHits": "KB pertinente",
    "tools.title": "Outils & Données", "tools.orderLookup": "Order lookup", "tools.searchBtn": "Chercher", "tools.orderActions": "Actions sur la commande", "tools.rmaBtn": "Générer RMA", "tools.voucherBtn": "Générer Voucher",
    "admin.title": "Centre d’administration", "admin.subtitle": "Gestion des connaissances, des intégrations et de l'équipe", "admin.backBtn": "Retour au Co-Pilote", "admin.nav.dashboard": "Tableau de bord", "admin.nav.kb": "Base de connaissances", "admin.nav.data": "Explorateur de données", "admin.nav.integrations": "Intégrations", "admin.nav.team": "Gestion d'équipe", "admin.dashboard.stat1.label": "Tickets résolus (jour)", "admin.dashboard.stat2.label": "Satisfaction (CSAT)", "admin.dashboard.stat3.label": "Tps de réponse moyen", "admin.dashboard.stat4.label": "Générations IA", "admin.dashboard.intentsTitle": "Intents les plus fréquents", "admin.dashboard.intent1": "Retour Produit", "admin.dashboard.intent2": "Support Technique", "admin.dashboard.intent3": "Question Livraison", "admin.kb.title": "Éditeur de la Base de Connaissances", "admin.kb.description": "Modifiez le contenu ci-dessous. L'IA utilisera cette source pour générer ses réponses.", "admin.kb.cancelBtn": "Annuler", "admin.kb.saveBtn": "Sauvegarder", "admin.integrations.dataSources.title": "Source de Données Principale",
    "admin.integrations.dataSources.integrateQueryBtn": "Tester & Intégrer la requête", "admin.integrations.platforms.title": "CRM & Plateformes", "admin.integrations.platforms.connectBtn": "Connecter", "admin.integrations.platforms.connectingBtn": "Connexion...", "admin.integrations.platforms.disconnectBtn": "Déconnecter", "admin.integrations.platforms.connectedTag": "Connecté", "admin.integrations.platforms.syncBtn": "Synchroniser", "admin.integrations.platforms.syncingBtn": "Synchro...", "admin.integrations.platforms.lastSyncLabel": "Dernière synchro :", "admin.integrations.platforms.syncNow": "à l'instant",
    "admin.team.title": "Membres de l'équipe", "admin.team.inviteBtn": "Inviter un membre", "admin.team.table.name": "Nom", "admin.team.table.role": "Rôle", "admin.team.table.status": "Statut", "admin.team.table.activity": "Dernière activité", "admin.team.you": "vous", "admin.team.roleAdmin": "Admin", "admin.team.roleAgent": "Agent", "admin.team.statusOnline": "En ligne", "admin.team.statusOffline": "Hors ligne", "admin.team.activityNow": "Maintenant", "admin.team.activity5min": "il y a 5 min", "admin.team.activity2h": "il y a 2h", "admin.team.activityYesterday": "Hier",
    "admin.integrations.dataSources.fileUploadTab": "Import Fichier", "admin.integrations.dataSources.liveConnectionTab": "Connexion Live", "admin.integrations.dataSources.dropzoneLabel": "Glissez-déposez un fichier JSON", "admin.integrations.dataSources.browseLabel": "ou parcourez vos fichiers", "admin.integrations.dataSources.fileSelectedLabel": "Fichier sélectionné :", "admin.integrations.dataSources.removeFileBtn": "Supprimer", "admin.integrations.dataSources.integrateFileBtn": "Intégrer le fichier", "admin.integrations.dataSources.connectedState": "Source de données connectée", "admin.integrations.dataSources.sourceLabel": "Source", "admin.integrations.dataSources.lastSyncLabel": "Dernière synchro", "admin.integrations.dataSources.disconnectBtn": "Déconnecter & Réinitialiser", "admin.integrations.dataSources.noSource": "Aucune source de données.", "admin.integrations.dataSources.pleaseUpload": "Veuillez importer un fichier ou connecter une API.",
    "admin.integrations.dataSources.apiEndpointLabel": "URL du point d'accès API", "admin.integrations.dataSources.apiTokenLabel": "Jeton d'authentification (Bearer)", "admin.integrations.dataSources.connectApiBtn": "Connecter & Synchroniser",
    "admin.data.customersTitle": "Clients Actifs", "admin.data.customers.name": "Nom", "admin.data.customers.lang": "Langue", "admin.data.customers.tier": "Tier", "admin.data.ordersTitle": "Commandes Récentes", "admin.data.orders.customer": "Client", "admin.data.orders.status": "Statut", "admin.data.orders.date": "Date", "admin.data.noData": "Aucune donnée à afficher. Importez une source de données.",
    "historyModal.title": "Historique",
    "voucherModal.title": "Générer un voucher", "voucherModal.amountLabel": "Montant du voucher (€)", "voucherModal.generateBtn": "Générer le code",
    "policyModal.title": "Conseil de l'IA", "policyModal.loading": "Analyse de la politique...",
    "settingsModal.title": "Paramètres", "settingsModal.profile.title": "Profil", "settingsModal.profile.loggedInAs": "Connecté en tant que", "settingsModal.language.label": "Langue de l'interface", "settingsModal.theme.label": "Thème d'apparence", "settingsModal.theme.light": "Clair", "settingsModal.theme.dark": "Sombre", "settingsModal.theme.system": "Système", "settingsModal.notifications.label": "Notifications", "settingsModal.notifications.enable": "Activer les notifications de bureau",
  },
  en: {
    "header.title": "Chat Agent Co‑Pilot", "header.subtitle.main": "Gemini powered", "header.subtitle.soon": "(soon GPT powered)", "header.historyBtn": "History", "header.settingsBtn": "Settings", "header.adminBtn": "Admin Center",
    "kb.title": "Knowledge Base", "kb.searchPlaceholder": "Search KB...", "kb.resetBtn": "Reset",
    "composer.title": "Customer Message", "composer.shortcutLabel": "Shortcut", "composer.translateBtn": "Translate to EN", "composer.placeholder": "Paste customer message here...", "composer.generateBtn": "Generate", "composer.clearBtn": "Clear", "composer.modelLabel": "Model", "composer.creativityLabel": "Creativity", "composer.lengthLabel": "Length",
    "results.title": "Co-Pilot Suggestion", "results.checkPolicyBtn": "Check AI Advice", "results.generating": "Generating...", "results.placeholder": "Generated response will appear here...", "results.refinePlaceholder": "Your refinement instruction... (e.g., Make the tone more formal)", "results.updateBtn": "Update", "results.updating": "Updating...", "results.copyBtn": "Copy response", "results.disclaimer": "AI can make mistakes. Always verify important information.",
    "insights.title": "Insights & Routing", "insights.intent": "Intent", "insights.language": "Language", "insights.sentiment": "Sentiment", "insights.urgency": "Urgency", "insights.steps": "Suggested steps", "insights.noSteps": "No steps suggested.", "insights.kbHits": "Relevant KB",
    "tools.title": "Tools & Data", "tools.orderLookup": "Order lookup", "tools.searchBtn": "Search", "tools.orderActions": "Order actions", "tools.rmaBtn": "Generate RMA", "tools.voucherBtn": "Generate Voucher",
    "admin.title": "Admin Center", "admin.subtitle": "Manage knowledge, integrations, and team", "admin.backBtn": "Back to Co-Pilot", "admin.nav.dashboard": "Dashboard", "admin.nav.kb": "Knowledge Base", "admin.nav.data": "Data Explorer", "admin.nav.integrations": "Integrations", "admin.nav.team": "Team Management", "admin.dashboard.stat1.label": "Tickets solved (daily)", "admin.dashboard.stat2.label": "Satisfaction (CSAT)", "admin.dashboard.stat3.label": "Avg. response time", "admin.dashboard.stat4.label": "AI generations", "admin.dashboard.intentsTitle": "Most frequent intents", "admin.dashboard.intent1": "Product Return", "admin.dashboard.intent2": "Technical Support", "admin.dashboard.intent3": "Shipping Question", "admin.kb.title": "Knowledge Base Editor", "admin.kb.description": "Edit the content below. The AI will use this source to generate its answers.", "admin.kb.cancelBtn": "Cancel", "admin.kb.saveBtn": "Save", "admin.integrations.dataSources.title": "Main Data Source",
    "admin.integrations.dataSources.integrateQueryBtn": "Test & Integrate Query", "admin.integrations.platforms.title": "CRM & Platforms", "admin.integrations.platforms.connectBtn": "Connect", "admin.integrations.platforms.connectingBtn": "Connecting...", "admin.integrations.platforms.disconnectBtn": "Disconnect", "admin.integrations.platforms.connectedTag": "Connected", "admin.integrations.platforms.syncBtn": "Sync", "admin.integrations.platforms.syncingBtn": "Syncing...", "admin.integrations.platforms.lastSyncLabel": "Last synced:", "admin.integrations.platforms.syncNow": "just now",
    "admin.team.title": "Team Members", "admin.team.inviteBtn": "Invite member", "admin.team.table.name": "Name", "admin.team.table.role": "Role", "admin.team.table.status": "Status", "admin.team.table.activity": "Last activity", "admin.team.you": "you", "admin.team.roleAdmin": "Admin", "admin.team.roleAgent": "Agent", "admin.team.statusOnline": "Online", "admin.team.statusOffline": "Offline", "admin.team.activityNow": "Now", "admin.team.activity5min": "5 minutes ago", "admin.team.activity2h": "2 hours ago", "admin.team.activityYesterday": "Yesterday",
    "admin.integrations.dataSources.fileUploadTab": "File Upload", "admin.integrations.dataSources.liveConnectionTab": "Live Connection", "admin.integrations.dataSources.dropzoneLabel": "Drag & drop a JSON file", "admin.integrations.dataSources.browseLabel": "or browse your files", "admin.integrations.dataSources.fileSelectedLabel": "Selected file:", "admin.integrations.dataSources.removeFileBtn": "Remove", "admin.integrations.dataSources.integrateFileBtn": "Integrate File", "admin.integrations.dataSources.connectedState": "Data source connected", "admin.integrations.dataSources.sourceLabel": "Source", "admin.integrations.dataSources.lastSyncLabel": "Last Sync", "admin.integrations.dataSources.disconnectBtn": "Disconnect & Reset", "admin.integrations.dataSources.noSource": "No data source.", "admin.integrations.dataSources.pleaseUpload": "Please upload a file or connect an API.",
    "admin.integrations.dataSources.apiEndpointLabel": "API Endpoint URL", "admin.integrations.dataSources.apiTokenLabel": "Authentication Token (Bearer)", "admin.integrations.dataSources.connectApiBtn": "Connect & Sync",
    "admin.data.customersTitle": "Active Customers", "admin.data.customers.name": "Name", "admin.data.customers.lang": "Language", "admin.data.customers.tier": "Tier", "admin.data.ordersTitle": "Recent Orders", "admin.data.orders.customer": "Customer", "admin.data.orders.status": "Status", "admin.data.orders.date": "Date", "admin.data.noData": "No data to display. Import a data source.",
    "historyModal.title": "History",
    "voucherModal.title": "Generate voucher", "voucherModal.amountLabel": "Voucher amount (€)", "voucherModal.generateBtn": "Generate code",
    "policyModal.title": "AI Advice", "policyModal.loading": "Analyzing policy...",
    "settingsModal.title": "Settings", "settingsModal.profile.title": "Profile", "settingsModal.profile.loggedInAs": "Logged in as", "settingsModal.language.label": "Interface Language", "settingsModal.theme.label": "Appearance Theme", "settingsModal.theme.light": "Light", "settingsModal.theme.dark": "Dark", "settingsModal.theme.system": "System", "settingsModal.notifications.label": "Notifications", "settingsModal.notifications.enable": "Enable desktop notifications",
  },
  nl: {
    "header.title": "Chat Agent Co‑Pilot", "header.subtitle.main": "Gemini aangedreven", "header.subtitle.soon": "(binnenkort GPT aangedreven)", "header.historyBtn": "Geschiedenis", "header.settingsBtn": "Instellingen", "header.adminBtn": "Admin Center",
    "kb.title": "Kennisbank", "kb.searchPlaceholder": "Zoek in KB...", "kb.resetBtn": "Resetten",
    "composer.title": "Bericht van klant", "composer.shortcutLabel": "Sneltoets", "composer.translateBtn": "Vertaal naar NL", "composer.placeholder": "Plak hier het bericht van de klant...", "composer.generateBtn": "Genereer", "composer.clearBtn": "Wissen", "composer.modelLabel": "Model", "composer.creativityLabel": "Creativiteit", "composer.lengthLabel": "Lengte",
    "results.title": "Co-Pilot Voorstel", "results.checkPolicyBtn": "Bekijk AI-advies", "results.generating": "Genereren...", "results.placeholder": "Gegenereerd antwoord verschijnt hier...", "results.refinePlaceholder": "Uw verfijningsinstructie... (bv. Maak de toon formeler)", "results.updateBtn": "Bijwerken", "results.updating": "Bijwerken...", "results.copyBtn": "Kopieer antwoord", "results.disclaimer": "AI kan fouten maken. Controleer altijd belangrijke informatie.",
    "insights.title": "Inzichten & Routing", "insights.intent": "Intentie", "insights.language": "Taal", "insights.sentiment": "Sentiment", "insights.urgency": "Urgentie", "insights.steps": "Voorgestelde stappen", "insights.noSteps": "Geen stappen voorgesteld.", "insights.kbHits": "Relevante KB",
    "tools.title": "Tools & Data", "tools.orderLookup": "Order opzoeken", "tools.searchBtn": "Zoeken", "tools.orderActions": "Orderacties", "tools.rmaBtn": "Genereer RMA", "tools.voucherBtn": "Genereer Voucher",
    "admin.title": "Admin Center", "admin.subtitle": "Beheer kennis, integraties en team", "admin.backBtn": "Terug naar Co-Pilot", "admin.nav.dashboard": "Dashboard", "admin.nav.kb": "Kennisbank", "admin.nav.data": "Gegevensverkenner", "admin.nav.integrations": "Integraties", "admin.nav.team": "Teambeheer", "admin.dashboard.stat1.label": "Tickets opgelost (dag)", "admin.dashboard.stat2.label": "Tevredenheid (CSAT)", "admin.dashboard.stat3.label": "Gem. reactietijd", "admin.dashboard.stat4.label": "AI-generaties", "admin.dashboard.intentsTitle": "Meest voorkomende intenties", "admin.dashboard.intent1": "Productretour", "admin.dashboard.intent2": "Technische Support", "admin.dashboard.intent3": "Verzendvraag", "admin.kb.title": "Kennisbank Editor", "admin.kb.description": "Bewerk de onderstaande inhoud. De AI zal deze bron gebruiken om antwoorden te genereren.", "admin.kb.cancelBtn": "Annuleren", "admin.kb.saveBtn": "Opslaan", "admin.integrations.dataSources.title": "Primaire Gegevensbron",
    "admin.integrations.dataSources.integrateQueryBtn": "Test & Integreer Query", "admin.integrations.platforms.title": "CRM & Platforms", "admin.integrations.platforms.connectBtn": "Verbinden", "admin.integrations.platforms.connectingBtn": "Verbinden...", "admin.integrations.platforms.disconnectBtn": "Verbinding verbreken", "admin.integrations.platforms.connectedTag": "Verbonden", "admin.integrations.platforms.syncBtn": "Synchroniseer", "admin.integrations.platforms.syncingBtn": "Syncen...", "admin.integrations.platforms.lastSyncLabel": "Laatste sync:", "admin.integrations.platforms.syncNow": "zojuist",
    "admin.team.title": "Teamleden", "admin.team.inviteBtn": "Nodig lid uit", "admin.team.table.name": "Naam", "admin.team.table.role": "Rol", "admin.team.table.status": "Status", "admin.team.table.activity": "Laatste activiteit", "admin.team.you": "jij", "admin.team.roleAdmin": "Admin", "admin.team.roleAgent": "Agent", "admin.team.statusOnline": "Online", "admin.team.statusOffline": "Offline", "admin.team.activityNow": "Nu", "admin.team.activity5min": "5 minuten geleden", "admin.team.activity2h": "2 uur geleden", "admin.team.activityYesterday": "Gisteren",
    "admin.integrations.dataSources.fileUploadTab": "Bestand Uploaden", "admin.integrations.dataSources.liveConnectionTab": "Live Verbinding", "admin.integrations.dataSources.dropzoneLabel": "Sleep een JSON-bestand hier", "admin.integrations.dataSources.browseLabel": "of blader door uw bestanden", "admin.integrations.dataSources.fileSelectedLabel": "Geselecteerd bestand:", "admin.integrations.dataSources.removeFileBtn": "Verwijderen", "admin.integrations.dataSources.integrateFileBtn": "Integreer Bestand", "admin.integrations.dataSources.connectedState": "Gegevensbron verbonden", "admin.integrations.dataSources.sourceLabel": "Bron", "admin.integrations.dataSources.lastSyncLabel": "Laatste Sync", "admin.integrations.dataSources.disconnectBtn": "Verbinding verbreken & Resetten", "admin.integrations.dataSources.noSource": "Geen gegevensbron.", "admin.integrations.dataSources.pleaseUpload": "Upload een bestand of verbind een API.",
    "admin.integrations.dataSources.apiEndpointLabel": "API Eindpunt URL", "admin.integrations.dataSources.apiTokenLabel": "Authenticatietoken (Bearer)", "admin.integrations.dataSources.connectApiBtn": "Verbind & Synchroniseer",
    "admin.data.customersTitle": "Actieve Klanten", "admin.data.customers.name": "Naam", "admin.data.customers.lang": "Taal", "admin.data.customers.tier": "Niveau", "admin.data.ordersTitle": "Recente Bestellingen", "admin.data.orders.customer": "Klant", "admin.data.orders.status": "Status", "admin.data.orders.date": "Datum", "admin.data.noData": "Geen gegevens om weer te geven. Importeer een gegevensbron.",
    "historyModal.title": "Geschiedenis",
    "voucherModal.title": "Voucher genereren", "voucherModal.amountLabel": "Voucherbedrag (€)", "voucherModal.generateBtn": "Code genereren",
    "policyModal.title": "AI Advies", "policyModal.loading": "Beleid analyseren...",
    "settingsModal.title": "Instellingen", "settingsModal.profile.title": "Profiel", "settingsModal.profile.loggedInAs": "Ingelogd als", "settingsModal.language.label": "Interface Taal", "settingsModal.theme.label": "Uiterlijk Thema", "settingsModal.theme.light": "Licht", "settingsModal.theme.dark": "Donker", "settingsModal.theme.system": "Systeem", "settingsModal.notifications.label": "Notificaties", "settingsModal.notifications.enable": "Desktopnotificaties inschakelen",
  }
};

function setLanguage(lang) {
  const langPack = translations[lang] || translations.fr;
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;
  localStorage.setItem('aetheria_lang', lang);

  $$('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (langPack[key]) {
      el.textContent = langPack[key];
    }
  });
  $$('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      if (langPack[key]) {
          (el as HTMLInputElement).placeholder = langPack[key];
      }
  });
}

// ---------------------- DOM ----------------------
const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];

const questionEl = $("#customer-question") as HTMLTextAreaElement;
const loader = $("#loader");
const tempRange = $("#tempRange") as HTMLInputElement;
const tempVal = $("#tempVal");
const maxTok = $("#maxTok") as HTMLInputElement;
const modelSelect = $("#modelSelect") as HTMLSelectElement;
const resetQuestionBtn = $("#resetQuestionBtn");
const formatSwitch = $("#format-switch");
const translationOutput = $("#translation-output");
const copyResponseBtn = $("#copyResponseBtn");

const resetKbBtn = $("#resetKbBtn");
const translateBtn = $("#translateBtn");
const historyBtn = $("#historyBtn");
const historyModal = $("#historyModal") as HTMLDialogElement;
const historyModalCloseBtn = $("#historyModalCloseBtn");
const historyList = $("#historyList");
const settingsBtn = $("#settingsBtn");
const settingsDropdown = $("#settingsDropdown");
const adminViewBtn = $("#adminViewBtn");

// KB
const kbStructuredContent = $("#kb-structured-content");
const kbSearchInput = $("#kbSearchInput") as HTMLInputElement;

// Views
const mainAppContainer = $("#main-app-container");
const adminView = $("#admin-view");
const backToMainBtn = $("#backToMainBtn");

const personalizationView = $("#personalization-view");
const personalizeText = $("#personalize-text") as HTMLTextAreaElement;
const personalizePrompt = $("#personalize-prompt") as HTMLTextAreaElement;
const personalizeGenerateBtn = $("#personalize-generateBtn");
const personalizeLoader = $("#personalize-loader");

// Insights
const insights = {
  intent: $("#ins-intent"),
  lang: $("#ins-lang"),
  sent: $("#ins-sent"),
  urg: $("#ins-urg"),
  steps: $("#ins-steps"),
  kbHits: $("#kbHits"),
};

// Tools & Data
const toolsContent = $("#tools-content");
const orderId = $("#orderId") as HTMLInputElement;
const orderBtn = $("#orderBtn");
const orderCard = $("#orderCard");
const genRma = $("#genRma") as HTMLButtonElement;
const genVoucher = $("#genVoucher") as HTMLButtonElement;
const actionOutWrapper = $("#actionOutWrapper");
const actionOutLabel = $("#actionOutLabel");
const actionOut = $("#actionOut");
const copyActionOutBtn = $("#copyActionOutBtn");

// Modals
const voucherModal = $("#voucherModal") as HTMLDialogElement;
const voucherModalCloseBtn = $("#voucherModalCloseBtn");
const voucherAmount = $("#voucherAmount") as HTMLInputElement;
const voucherGenerateBtn = $("#voucherGenerateBtn");
const policyModal = $("#policyModal") as HTMLDialogElement;
const policyModalCloseBtn = $("#policyModalCloseBtn");
const checkPolicyBtn = $("#checkPolicyBtn");
const policyLoader = $("#policyLoader");
const policyAdvice = $("#policyAdvice");
const settingsModal = $("#settingsModal") as HTMLDialogElement;
const settingsModalCloseBtn = $("#settingsModalCloseBtn");
const settingsPageBtn = $("#settingsPageBtn");
const languageSelect = $("#language-select") as HTMLSelectElement;
const notificationToggle = $("#notification-toggle") as HTMLButtonElement;

// Admin
const adminKbEditor = $("#admin-kb-editor") as HTMLTextAreaElement;
const adminKbSaveBtn = $("#admin-kb-save-btn");
const adminKbCancelBtn = $("#admin-kb-cancel-btn");
const fileDropZone = $("#file-drop-zone");
const bqFileInput = $("#bq-file-input") as HTMLInputElement;
const fileDisplay = $("#file-display");
const fileNameEl = $("#file-name");
const removeFileBtn = $("#remove-file-btn");
const integrateFileBtn = $("#integrate-file-btn") as HTMLButtonElement;
const dataSourceConnected = $("#data-source-connected");
const dataSourceDisconnected = $("#data-source-disconnected");
const connectedSourceInfo = $("#connected-source-info");
const connectedLastSync = $("#connected-last-sync");
const disconnectDataBtn = $("#disconnect-data-btn");
const connectApiBtn = $("#connect-api-btn") as HTMLButtonElement;
const apiEndpointInput = $("#api-endpoint-input") as HTMLInputElement;
const apiTokenInput = $("#api-token-input") as HTMLInputElement;

// ---------------------- State & Storage ----------------------
const state = {
    generationFormat: 'email',
    activeOrder: null,
    // Data Source State
    dataSourceType: null, // 'file' or 'api'
    dataSourceInfo: null, // filename or API endpoint
    lastSync: null, // Date object
    selectedFile: null, // For file upload flow
    // Integrations State
    integrations: {
        zendesk: { connected: false, lastSync: null },
        salesforce: { connected: false, lastSync: null },
        intercom: { connected: true, lastSync: new Date() }, // Pre-connected
    },
};

const store = {
  get kb() { return localStorage.getItem("aetheria_kb") || appData.kb; },
  set kb(v) { 
    const content = v || DEFAULT_KB;
    localStorage.setItem("aetheria_kb", content);
    appData.kb = content; // Keep appData object in sync
  },
  history: JSON.parse(localStorage.getItem("aetheria_history") || "[]"),
  saveHistory(item) {
    this.history.unshift(item);
    this.history = this.history.slice(0, 30);
    localStorage.setItem("aetheria_history", JSON.stringify(this.history));
  }
};

// ---------------------- Utilities ----------------------
function toast(msg, ok = true) {
  const t = document.createElement("div");
  t.className = `mb-2 px-4 py-2 rounded-xl border ${ok?"border-emerald-500/60 bg-emerald-500/10 text-emerald-300":"border-rose-500/60 bg-rose-500/10 text-rose-300"}`;
  t.innerHTML = `<div class="flex items-center gap-2 text-sm">${ok?'<i class="ph ph-check"></i>':'<i class="ph ph-x"></i>'}<span>${msg}</span></div>`;
  $("#toast").appendChild(t);
  setTimeout(()=>t.remove(), 2800);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(()=>toast(translations[document.documentElement.lang]?.results?.copyBtn || "Copié."));
}

function timeAgo(date) {
    if (!date) return '';
    const lang = document.documentElement.lang;
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 10) return translations[lang]['admin.integrations.platforms.syncNow'] || 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}


function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function genRmaCode() {
  const now = new Date();
  const ymd = now.toISOString().slice(0,10).replace(/-/g,"");
  const seq = Math.floor(1000 + Math.random()*9000);
  return `RMA-AD-${ymd}-${seq}`;
}

function genVoucherCode(amount) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = ""; for (let i=0;i<12;i++) s += chars[Math.floor(Math.random()*chars.length)];
  const code = `${s.slice(0,4)}-${s.slice(4,8)}-${s.slice(8)}`;
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  return { code, amount, expiry: expiry.toISOString().slice(0,10) };
}

function kbSearch(kw) {
  const lines = store.kb.split(/\n+/);
  const hits = [];
  for (const k of kw) {
    const rx = new RegExp(k, "i");
    for (const ln of lines) {
      if (rx.test(ln) && ln.trim().length > 4) hits.push({ k, ln: ln.trim() });
    }
  }
  const uniq = [];
  const seen = new Set();
  for (const h of hits) { const key = h.ln.toLowerCase(); if (!seen.has(key)) { seen.add(key); uniq.push(h); } }
  return uniq.slice(0,6);
}

// ---------------------- Gemini Calls ----------------------
async function geminiCall(prompt, { temperature = null, maxTokens = null, json = false, schema = null } = {}) {
  try {
    const modelName = modelSelect.value || FALLBACK_MODEL_NAME;
    const effectiveMaxTokens = maxTokens ?? parseInt(maxTok.value, 10);
    const config:any = {
      temperature: temperature ?? parseFloat(tempRange.value),
    };
    
    if (effectiveMaxTokens) {
        config.maxOutputTokens = effectiveMaxTokens;
        if (modelName === 'gemini-2.5-flash') {
          config.thinkingConfig = { thinkingBudget: Math.min(256, Math.floor(effectiveMaxTokens * 0.5)) };
        }
    }

    if (json) {
      config.responseMimeType = "application/json";
      if (schema) {
        config.responseSchema = schema;
      }
    }

    const response = await ai.models.generateContent({
        model: modelName,
        contents: [{ parts: [{ text: prompt }] }],
        config: config
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error(`Erreur Gemini: ${(error as Error).message || 'La requête a échoué.'}`);
  }
}

async function analyzeIntent(question) {
  const prompt = `Tu es un routeur de tickets. Analyse le message du client et réponds STRICTEMENT en JSON en suivant le schéma fourni.\n\nMessage:\n"""${question}"""`;
  const schema = {
    type: Type.OBJECT,
    properties: {
      intent: { type: Type.STRING, description: "L'intention principale du client (ex: retour produit, support technique, question livraison)." },
      language: { type: Type.STRING, description: "La langue du message (code ISO 639-1, ex: fr, en, nl)." },
      sentiment: { type: Type.STRING, description: "Le sentiment du message (positive, neutral, negative)." },
      urgency: { type: Type.STRING, description: "Le niveau d'urgence (low, medium, high)." },
      steps: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Un tableau de 3 à 5 prochaines étapes suggérées pour l'agent."
      },
    }
  };
  const txt = await geminiCall(prompt, { json: true, schema: schema, temperature: 0.1, maxTokens: 512 });
  try { return JSON.parse(txt); } catch { return { intent: "unknown", language: "fr", sentiment: "neutral", urgency: "low", steps: [] }; }
}

async function generateAnswer(question, context, format) {
  const formatInstruction = format === 'email'
    ? "Rédige une réponse complète et professionnelle au format email, avec objet, salutation, corps et signature."
    : "Rédige une réponse concise et directe, adaptée à un format de chat en direct.";
  const prompt = `Tu es un Co‑Pilote Service Client expert d\'Aetheria Dynamics.\nBasé EXCLUSIVEMENT sur la base de connaissances ci‑dessous, réponds au message du client.\n${formatInstruction}\nSi l'info manque: dis-le et propose une escalade.\n\n--- BASE DE CONNAISSANCES ---\n${context}\n--- FIN KB ---\n\n--- MESSAGE CLIENT ---\n${question}\n--- FIN ---`;
  return await geminiCall(prompt);
}

async function translate(text, lang) {
  const prompt = `Traduire le texte suivant en ${lang.toUpperCase()} en conservant le sens et le ton. Réponds UNIQUEMENT avec la traduction.\n\n${text}`;
  return await geminiCall(prompt, { temperature: 0.2, maxTokens: 1024 });
}

async function refineAnswer(originalText, instruction) {
    const prompt = `Tu es un assistant de rédaction. Modifie le texte original ci-dessous en suivant l'instruction donnée. Réponds UNIQUEMENT avec le texte mis à jour, sans préambule.\n\n--- TEXTE ORIGINAL ---\n${originalText}\n\n--- INSTRUCTION ---\n${instruction}\n--- FIN ---`;
    return await geminiCall(prompt, { temperature: 0.5, maxTokens: 1024 });
}

async function analyzePolicy(question, kb) {
    const prompt = `Analyse la question du client et la base de connaissances. Identifie les 3-5 extraits les plus pertinents de la KB pour répondre. Fournis aussi un conseil court pour l'agent. Réponds en JSON.\n\nKB:\n${kb}\n\nQuestion: "${question}"`;
    const schema = {
        type: Type.OBJECT,
        properties: {
            advice: { type: Type.STRING, description: "Un conseil pour l'agent (2-3 phrases max)." },
            excerpts: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Un tableau des extraits de texte exacts de la KB à surligner."
            }
        }
    };
    const txt = await geminiCall(prompt, { json: true, schema, temperature: 0.1 });
    try { return JSON.parse(txt); } catch { return { advice: "Impossible d'analyser la politique.", excerpts: [] }; }
}

// ---------------------- Render & Data Sync ----------------------
function parseAndRenderKB(kbString) {
  kbStructuredContent.innerHTML = '';
  if (!kbString || kbString.trim() === '') {
      kbStructuredContent.innerHTML = `<div class="text-center text-slate-500 py-10">La base de connaissance est vide.</div>`;
      return;
  }
  const sections = kbString.split('\n## ');

  const firstPart = sections.shift().trim();
  const firstPartLines = firstPart.split('\n');
  const mainTitle = firstPartLines.shift().replace(/^#\s*/, '');
  const mainContent = firstPartLines.join('\n').trim();

  if (mainContent) {
      const details = document.createElement('details');
      details.className = 'kb-section';
      details.open = true;
      details.innerHTML = `
          <summary>${mainTitle}</summary>
          <div class="kb-section-content">${mainContent.replace(/</g, "&lt;")}</div>
      `;
      kbStructuredContent.appendChild(details);
  }

  sections.forEach(sectionText => {
      const lines = sectionText.trim().split('\n');
      const title = lines.shift()?.trim();
      const content = lines.join('\n').trim();
      
      if (!title) return;

      const details = document.createElement('details');
      details.className = 'kb-section';
      details.innerHTML = `
          <summary>${title}</summary>
          <div class="kb-section-content">${content.replace(/</g, "&lt;")}</div>
      `;
      kbStructuredContent.appendChild(details);
  });
}

function renderInsights(analysis) {
  insights.intent.textContent = analysis.intent || '—';
  insights.lang.textContent = (analysis.language || '—').toUpperCase();
  insights.sent.textContent = analysis.sentiment || '—';
  insights.urg.textContent = analysis.urgency || '—';
  insights.steps.innerHTML = (analysis.steps?.length)
    ? analysis.steps.map(s=>`<li>${s}</li>`).join("")
    : `<li class="text-slate-500">${translations[document.documentElement.lang]?.insights.noSteps || '...'}</li>`;

  const intentText = (analysis.intent || "").toLowerCase();
  const kw = intentText.split(/\s+/);
  if (intentText.includes("retour")) kw.push("RMA");
  if (intentText.includes("livraison")) kw.push("colis");
  const hits = kbSearch(kw);
  insights.kbHits.innerHTML = hits.length? hits.map(h=>`<span class="tag">${h.ln.replace(/#/g,'').slice(0,80)}</span>`).join("") : `<span class="text-slate-500">Aucun extrait pertinent.</span>`;
}

function renderOrder(o){
  if (!o){
    orderCard.classList.add('hidden');
    orderCard.innerHTML='';
    state.activeOrder = null;
    genRma.disabled = true;
    genVoucher.disabled = true;
    toolsContent.classList.add('disabled-panel');
    return;
  }
  const cust = appData.customers.find(c=>c.id===o.customer);
  orderCard.innerHTML = `
    <div class="flex items-center justify-between"><div><div class="font-semibold">Commande <span class="font-bold text-brand-400">${o.id}</span></div><div class="text-text-light text-xs">${o.date} · ${o.status} · ${o.ship}</div></div>
      <div class="text-right"><div class="text-xs text-text-light">Client</div><div>${cust?.name || '—'} <span class="tag">${cust?.tier||''}</span></div></div></div>
    <div class="mt-2 text-xs">Articles: ${o.items.map(i=>`${i.qty}× ${(appData.products.find(p=>p.sku===i.sku)||{}).name}`).join(', ')}</div>`;
  orderCard.classList.remove('hidden');
  state.activeOrder = o;
  genRma.disabled = false;
  genVoucher.disabled = false;
  toolsContent.classList.remove('disabled-panel');
}

function renderAdminData() {
    const lang = document.documentElement.lang;
    const teamData = appData.team || [];
    const dashboardData = appData.dashboard || { resolved: 0, csat: 'N/A', art: 'N/A', aiGenerations: 0, intents: {} };
    const intents: Record<string, number> = dashboardData.intents || {};
    const totalIntents = Object.values(intents).reduce((a, b) => a + b, 0) || 1;

    // Stats
    $("#stat-resolved").textContent = dashboardData.resolved;
    $("#stat-csat").textContent = dashboardData.csat;
    $("#stat-art").textContent = dashboardData.art;
    $("#stat-ai").textContent = dashboardData.aiGenerations;

    // Intents Chart
    const bars = $$('.bar-chart');
    if (bars.length === 3) {
        const intent1percent = Math.round(((intents['return'] || 0) / totalIntents) * 100);
        const intent2percent = Math.round(((intents['support'] || 0) / totalIntents) * 100);
        const intent3percent = Math.round(((intents['shipping'] || 0) / totalIntents) * 100);
        
        bars[0].querySelector('.bar-fill').style.width = `${intent1percent}%`;
        bars[0].querySelector('.bar-value').textContent = `${intent1percent}%`;
        bars[1].querySelector('.bar-fill').style.width = `${intent2percent}%`;
        bars[1].querySelector('.bar-value').textContent = `${intent2percent}%`;
        bars[2].querySelector('.bar-fill').style.width = `${intent3percent}%`;
        bars[2].querySelector('.bar-value').textContent = `${intent3percent}%`;
    }

    // Team Table
    const teamTableBody = $("#admin-team-table-body");
    const teamTitle = $("#admin-team-title");
    
    if (teamTitle) {
      teamTitle.textContent = `${translations[lang]?.['admin.team.title'] || 'Team Members'} (${teamData.length})`;
    }
    
    if (teamTableBody) {
        teamTableBody.innerHTML = teamData.map(member => `
            <tr class="border-t border-border">
                <td class="p-4 font-semibold text-text-strong">${member.name} ${member.isYou ? `(<span data-i18n="admin.team.you">${translations[lang]?.['admin.team.you'] || 'you'}</span>)` : ''}</td>
                <td class="p-4"><span class="tag" data-i18n="admin.team.role${member.role}">${translations[lang]?.[`admin.team.role${member.role}`] || member.role}</span></td>
                <td class="p-4 flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full ${member.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-500'}"></div>
                    <span data-i18n="admin.team.status${member.status}">${translations[lang]?.[`admin.team.status${member.status}`] || member.status}</span>
                </td>
                <td class="p-4" data-i18n="admin.team.${member.activity}">${translations[lang]?.[`admin.team.${member.activity}`] || member.activity}</td>
            </tr>
        `).join('');
    }
}

function renderDataExplorer() {
    const lang = document.documentElement.lang;
    const noDataHtml = `<tr><td colspan="4" class="p-8 text-center text-text-light" data-i18n="admin.data.noData">${translations[lang]['admin.data.noData']}</td></tr>`;
    const customersBody = $("#data-explorer-customers-body");
    if (customersBody) {
        customersBody.innerHTML = appData.customers?.length > 0
            ? appData.customers.map(c => `<tr><td class="p-4 font-mono text-xs">${c.id}</td><td class="p-4">${c.name}</td><td class="p-4">${c.lang}</td><td class="p-4"><span class="tag">${c.tier}</span></td></tr>`).join('')
            : noDataHtml;
    }

    const ordersBody = $("#data-explorer-orders-body");
    if (ordersBody) {
        ordersBody.innerHTML = appData.orders?.length > 0
            ? appData.orders.map(o => `<tr><td class="p-4 font-mono text-xs">${o.id}</td><td class="p-4">${o.customer}</td><td class="p-4">${o.status}</td><td class="p-4">${o.date}</td></tr>`).join('')
            : noDataHtml;
    }
}

function refreshAllData() {
    store.kb = appData.kb; // Sync KB with local storage
    parseAndRenderKB(store.kb);
    adminKbEditor.value = store.kb; // Update admin editor
    
    // Update main app view
    if (appData.orders && appData.orders.length > 0) {
        orderId.value = appData.orders[0].id;
        renderOrder(appData.orders[0]);
    } else {
        renderOrder(null);
        orderId.value = '';
    }
    
    // Update admin panel views
    renderAdminData();
    renderDataExplorer();
}


// ---------------------- Events ----------------------
tempRange.addEventListener('input', ()=> tempVal.textContent = tempRange.value);

resetKbBtn.addEventListener('click', ()=> {
  store.kb = DEFAULT_KB;
  parseAndRenderKB(store.kb);
  toast('KB réinitialisée.');
});

kbSearchInput.addEventListener('input', () => {
    const searchTerm = kbSearchInput.value.toLowerCase().trim();
    const sections = $$('.kb-section', kbStructuredContent);
    sections.forEach(section => {
        const sectionText = section.textContent.toLowerCase();
        if (sectionText.includes(searchTerm)) {
            section.classList.remove('hidden');
            const summary = section.querySelector('summary');
            if (searchTerm && summary.textContent.toLowerCase().includes(searchTerm)) {
                (section as HTMLDetailsElement).open = true;
            }
        } else {
            section.classList.add('hidden');
        }
    });
});


resetQuestionBtn.addEventListener('click', () => { questionEl.value = ''; translationOutput.classList.add('hidden'); questionEl.focus(); });

orderBtn.addEventListener('click', ()=>{
  const o = appData.orders.find(x=>x.id.toLowerCase() === orderId.value.trim().toLowerCase());
  renderOrder(o); if (!o) toast('Commande introuvable', false);
});

function showActionOutput(label, code) {
  if (!actionOutWrapper || !actionOutLabel || !actionOut) return;
  actionOutLabel.textContent = label;
  actionOut.textContent = code;
  actionOutWrapper.classList.remove('hidden');
}

genRma.addEventListener('click', ()=>{
  const code = genRmaCode();
  showActionOutput("RMA généré :", code);
  copyText(code);
});

genVoucher.addEventListener('click', () => voucherModal.showModal());
voucherModalCloseBtn.addEventListener('click', () => voucherModal.close());
voucherGenerateBtn.addEventListener('click', () => {
    const amount = voucherAmount.value;
    const voucher = genVoucherCode(amount);
    const text = `Code: ${voucher.code}\nMontant: ${voucher.amount} €\nExpire le: ${voucher.expiry}`;
    showActionOutput("Voucher généré :", text);
    copyText(text);
    voucherModal.close();
});

copyActionOutBtn?.addEventListener('click', () => {
    if (actionOut?.textContent) copyText(actionOut.textContent);
});

copyResponseBtn?.addEventListener('click', () => {
    if (personalizeText?.value) copyText(personalizeText.value);
});


// Theme Management
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
function applyTheme(theme) {
  localStorage.setItem('theme', theme);
  const themeRadios = $$(`input[name="theme"]`) as HTMLInputElement[];
  const activeRadio = themeRadios.find(r => r.value === theme);
  if (activeRadio) activeRadio.checked = true;
  document.documentElement.dataset.theme = (theme === 'auto') ? (prefersDark.matches ? 'dark' : 'light') : theme;
}
$$('#theme-selector input').forEach(radio => {
    radio.addEventListener('change', (e) => applyTheme((e.target as HTMLInputElement).value));
});
prefersDark.addEventListener('change', () => { if (localStorage.getItem('theme') === 'auto') applyTheme('auto'); });


// History Modal
historyBtn.addEventListener('click', ()=>{
  historyList.innerHTML = store.history.map(h=>`<div class="bg-surface border border-border rounded-xl p-3 mb-2"><div class="text-xs text-text-light">${new Date(h.ts).toLocaleString()}</div><div class="font-semibold">${h.intent || '—'} <span class="tag ml-2 text-xs">${(h.lang||'').toUpperCase()}</span></div><div class="text-sm mt-1">${h.q.replace(/</g,'&lt;')}</div></div>`).join('');
  historyModal.showModal();
});
historyModalCloseBtn.addEventListener('click', () => historyModal.close());

// Policy Modal
checkPolicyBtn.addEventListener('click', async () => {
    const q = questionEl.value.trim();
    if (!q) return toast("Veuillez entrer un message client d'abord.", false);
    policyModal.showModal();
    policyLoader.classList.remove('hidden');
    policyAdvice.innerHTML = "";

    try {
        const { advice } = await analyzePolicy(q, store.kb);
        policyAdvice.innerHTML = `<div class="text-text-light font-semibold mb-2">Conseil de l'IA</div><p>${advice}</p>`;
    } catch (e) {
        policyAdvice.innerHTML = `<p class="text-rose-400">Erreur lors de l'analyse : ${(e as Error).message}</p>`;
    } finally {
        policyLoader.classList.add('hidden');
    }
});
policyModalCloseBtn.addEventListener('click', () => policyModal.close());

// Settings Modal
settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsDropdown.classList.toggle('hidden');
});
settingsPageBtn.addEventListener('click', () => {
    settingsModal.showModal();
    settingsDropdown.classList.add('hidden');
});
settingsModalCloseBtn.addEventListener('click', () => settingsModal.close());
languageSelect.addEventListener('change', (e) => setLanguage((e.target as HTMLSelectElement).value));
notificationToggle.addEventListener('click', () => {
    const isEnabled = notificationToggle.getAttribute('aria-checked') === 'true';
    notificationToggle.setAttribute('aria-checked', String(!isEnabled));
    localStorage.setItem('aetheria_notifications', String(!isEnabled));
    toast(`Notifications ${!isEnabled ? 'activées' : 'désactivées'} (simulation).`);
});


// ---------------------- Admin View & Logic ----------------------
adminViewBtn.addEventListener('click', (e) => {
  e.preventDefault();
  mainAppContainer.classList.add('hidden');
  adminView.classList.remove('hidden');
  settingsDropdown.classList.add('hidden');
  adminKbEditor.value = store.kb;
  renderAdminData();
  renderDataExplorer();
  updateDataSourceStatusUI();
  Object.keys(state.integrations).forEach(renderIntegrationStatus);
});

backToMainBtn.addEventListener('click', () => {
  mainAppContainer.classList.remove('hidden');
  adminView.classList.add('hidden');
});

$$('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.admin-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.admin-tab-content').forEach(c => c.classList.add('hidden'));
        $(`#admin-tab-${tab}`)?.classList.remove('hidden');
    });
});

adminKbSaveBtn.addEventListener('click', () => {
    store.kb = adminKbEditor.value;
    parseAndRenderKB(store.kb);
    toast('Base de connaissances mise à jour.');
});

adminKbCancelBtn.addEventListener('click', () => {
    adminKbEditor.value = store.kb;
    toast('Changements annulés.', false);
});

// Admin -> CRM Integrations
function renderIntegrationStatus(integrationKey) {
    const lang = document.documentElement.lang;
    const integrationState = state.integrations[integrationKey];
    if (!integrationState) return;

    const container = $(`#integration-status-${integrationKey}`);
    if (!container) return;

    let statusHtml = '', buttonHtml = '';
    if (integrationState.connected) {
        const lastSyncText = timeAgo(integrationState.lastSync);
        statusHtml = `
            <div class="text-right">
                <span class="tag bg-emerald-500/20 text-emerald-300 border-emerald-500/50" data-i18n="admin.integrations.platforms.connectedTag">${translations[lang]['admin.integrations.platforms.connectedTag']}</span>
                <div class="text-xs text-text-light mt-1" data-i18n="admin.integrations.platforms.lastSyncLabel" data-i18n-arg="${lastSyncText}">${translations[lang]['admin.integrations.platforms.lastSyncLabel']} ${lastSyncText}</div>
            </div>`;
        buttonHtml = `
            <button data-integration="${integrationKey}" class="integration-sync-btn btn btn-ghost text-sm p-2"><i class="ph ph-arrows-clockwise text-lg"></i></button>
            <button data-integration="${integrationKey}" class="integration-toggle-btn btn btn-ghost text-sm text-rose-400 hover:bg-rose-500/10"><span data-i18n="admin.integrations.platforms.disconnectBtn">${translations[lang]['admin.integrations.platforms.disconnectBtn']}</span></button>`;
    } else {
        buttonHtml = `<button data-integration="${integrationKey}" class="integration-toggle-btn btn btn-outline text-sm"><span data-i18n="admin.integrations.platforms.connectBtn">${translations[lang]['admin.integrations.platforms.connectBtn']}</span></button>`;
    }
    container.innerHTML = statusHtml + buttonHtml;
}


async function handleIntegrationToggle(button: HTMLButtonElement) {
    const integrationKey = button.dataset.integration;
    if (!integrationKey) return;
    
    const lang = document.documentElement.lang;
    const wasConnected = state.integrations[integrationKey].connected;

    button.disabled = true;
    if (!wasConnected) {
        button.innerHTML = `<div class="h-4 w-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></div> <span data-i18n="admin.integrations.platforms.connectingBtn">${translations[lang]['admin.integrations.platforms.connectingBtn']}</span>`;
    }
    
    await new Promise(r => setTimeout(r, 1000)); // Simulate API call

    state.integrations[integrationKey].connected = !wasConnected;
    if (state.integrations[integrationKey].connected) {
        state.integrations[integrationKey].lastSync = new Date();
    } else {
        state.integrations[integrationKey].lastSync = null;
    }
    toast(`${integrationKey} ${!wasConnected ? 'connecté' : 'déconnecté'}.`);
    renderIntegrationStatus(integrationKey);
}

async function handleCrmSync(button: HTMLButtonElement) {
    const integrationKey = button.dataset.integration;
    if (!integrationKey || !state.integrations[integrationKey].connected) return;

    button.disabled = true;
    const icon = button.querySelector('i');
    if(icon) icon.classList.add('animate-spin');

    await new Promise(r => setTimeout(r, 800)); // Simulate sync
    
    state.integrations[integrationKey].lastSync = new Date();
    toast(`${integrationKey} synchronisé.`);
    renderIntegrationStatus(integrationKey); // Re-render to update time and button state
    if(icon) icon.classList.remove('animate-spin');
    button.disabled = false;
}

document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const toggleButton = target.closest('.integration-toggle-btn') as HTMLButtonElement | null;
    const syncButton = target.closest('.integration-sync-btn') as HTMLButtonElement | null;

    if (toggleButton) {
        handleIntegrationToggle(toggleButton);
    } else if (syncButton) {
        handleCrmSync(syncButton);
    }
});


// Admin -> Data Source Management
function updateDataSourceStatusUI() {
    if (state.dataSourceType) { // 'file' or 'api'
        dataSourceConnected.classList.remove('hidden');
        dataSourceDisconnected.classList.add('hidden');
        $('#data-source-config-container').classList.add('hidden');
        connectedSourceInfo.textContent = state.dataSourceInfo;
        connectedLastSync.textContent = state.lastSync ? timeAgo(state.lastSync) : 'N/A';
    } else {
        dataSourceConnected.classList.add('hidden');
        dataSourceDisconnected.classList.remove('hidden');
        $('#data-source-config-container').classList.remove('hidden');
        removeFileBtn.click(); // Reset file input UI
    }
}

function resetApplicationData() {
    if (confirm("Êtes-vous sûr de vouloir déconnecter la source de données ? Toutes les données actuelles (KB, clients, etc.) seront réinitialisées à leur état vide.")) {
        appData = JSON.parse(JSON.stringify(emptyData));
        state.dataSourceType = null;
        state.dataSourceInfo = null;
        state.lastSync = null;
        state.selectedFile = null;
        refreshAllData();
        updateDataSourceStatusUI();
        toast('Source de données déconnectée et application réinitialisée.');
    }
}
disconnectDataBtn?.addEventListener('click', resetApplicationData);


function handleFile(file) {
    if (file && file.type === 'application/json') {
        state.selectedFile = file;
        fileDropZone.classList.add('hidden');
        fileDisplay.classList.remove('hidden');
        fileNameEl.textContent = file.name;
        integrateFileBtn.disabled = false;
        toast(`Fichier ${file.name} prêt à être intégré.`);
    } else {
        toast('Veuillez sélectionner un fichier JSON valide.', false);
    }
}

fileDropZone?.addEventListener('click', () => bqFileInput.click());
fileDropZone?.addEventListener('dragover', (e) => { e.preventDefault(); fileDropZone.classList.add('dragover'); });
fileDropZone?.addEventListener('dragleave', () => fileDropZone.classList.remove('dragover'));
fileDropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropZone.classList.remove('dragover');
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
});
bqFileInput?.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) handleFile(file);
});
removeFileBtn?.addEventListener('click', () => {
    bqFileInput.value = ''; // Clear the file input
    state.selectedFile = null;
    fileDropZone.classList.remove('hidden');
    fileDisplay.classList.add('hidden');
    fileNameEl.textContent = '';
    integrateFileBtn.disabled = true;
});

async function handleFileIntegration() {
    if (!state.selectedFile) {
        toast('Aucun fichier sélectionné.', false);
        return;
    }

    const originalButtonText = integrateFileBtn.innerHTML;
    integrateFileBtn.disabled = true;
    integrateFileBtn.innerHTML = `<div class="h-4 w-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></div> Intégration...`;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const fileContent = event.target?.result as string;
            const data = JSON.parse(fileContent);
            appData = data;
            state.dataSourceType = 'file';
            state.dataSourceInfo = state.selectedFile.name;
            state.lastSync = new Date();
            refreshAllData();
            updateDataSourceStatusUI();
            toast('Données du fichier intégrées avec succès.');
        } catch (error) {
            console.error("Failed to parse or integrate JSON file:", error);
            toast('Erreur: Le fichier JSON est invalide ou corrompu.', false);
            state.dataSourceType = null;
        } finally {
            integrateFileBtn.disabled = false;
            integrateFileBtn.innerHTML = originalButtonText;
        }
    };
    reader.onerror = () => {
        toast('Erreur lors de la lecture du fichier.', false);
        integrateFileBtn.disabled = false;
        integrateFileBtn.innerHTML = originalButtonText;
    };
    reader.readAsText(state.selectedFile);
}
integrateFileBtn?.addEventListener('click', handleFileIntegration);

async function handleApiConnection() {
    const endpoint = apiEndpointInput.value.trim();
    if (!endpoint) {
        return toast("Veuillez entrer une URL d'API valide.", false);
    }

    const originalButtonText = connectApiBtn.innerHTML;
    connectApiBtn.disabled = true;
    connectApiBtn.innerHTML = `<div class="h-4 w-4 rounded-full border-2 border-slate-400 border-t-white animate-spin"></div> Connexion...`;

    // Simulate API call and data fetch
    await new Promise(r => setTimeout(r, 1500)); 

    // In a real app, you would fetch(endpoint) and parse the response.
    // For this demo, we'll assume it returns the same structure as our JSON.
    try {
        // This is a mock. Replace with actual fetch and data assignment.
        const mockData = JSON.parse(JSON.stringify(emptyData)); // Start with empty for demo
        mockData.kb = `# Données chargées depuis l'API\n\nEndpoint: ${endpoint}\n- Statut: Connecté\n- Données de démo simulées.`;
        mockData.customers = [{id: "API-C-001", name: "Client API", lang: "fr", tier: "Premium"}];
        
        appData = mockData;
        state.dataSourceType = 'api';
        state.dataSourceInfo = endpoint;
        state.lastSync = new Date();
        
        refreshAllData();
        updateDataSourceStatusUI();
// FIX: The string literal was using single quotes which conflicted with an apostrophe in the text. Switched to double quotes to fix the syntax error.
        toast("Connecté et synchronisé avec l'API avec succès.");
    } catch (error) {
        toast("Erreur lors de la connexion à l'API.", false);
    } finally {
        connectApiBtn.disabled = false;
        connectApiBtn.innerHTML = originalButtonText;
    }
}
connectApiBtn?.addEventListener('click', handleApiConnection);

$$('.integration-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        $$('.integration-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        $$('.integration-tab-content').forEach(c => c.classList.add('hidden'));
        $(`#integration-tab-${tab}`)?.classList.remove('hidden');
    });
});


document.addEventListener('click', (e) => {
  if (!settingsDropdown.classList.contains('hidden') && !$("#settings-menu-container").contains(e.target as Node)) {
    settingsDropdown.classList.add('hidden');
  }
});

// Generation Flow
document.addEventListener('keydown', (e)=>{
  if ((e.ctrlKey||e.metaKey) && e.key === 'Enter') {
    e.preventDefault();
    if (personalizationView.style.display !== 'none' && personalizePrompt.matches(':focus')) {
        handlePersonalization();
    } else {
        handleGeneration();
    }
  }
});

$("#generate-button").addEventListener('click', handleGeneration);
personalizeGenerateBtn.addEventListener('click', handlePersonalization);

formatSwitch.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const button = target.closest('.format-btn');
    if (button) {
        state.generationFormat = (button as HTMLElement).dataset.format;
        $$('.format-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    }
});

async function handleGeneration(){
  const q = questionEl.value.trim();
  if (!q){ questionEl.classList.add('ring-2','ring-rose-500'); setTimeout(()=>questionEl.classList.remove('ring-2','ring-rose-500'), 1200); return; }

  personalizationView.classList.remove('hidden');
  loader.classList.remove('hidden');
  personalizeText.value = "Génération en cours...";

  try {
    const [analysis, answer] = await Promise.all([
      analyzeIntent(q),
      generateAnswer(q, store.kb, state.generationFormat)
    ]);
    renderInsights(analysis);
    personalizeText.value = answer.trim();
    store.saveHistory({ ts: Date.now(), q, intent: analysis.intent, lang: analysis.language });
  } catch (err){
    console.error(err);
    personalizeText.value = `Erreur: ${(err as Error).message}`;
    toast('Échec de génération', false);
  } finally {
    loader.classList.add('hidden');
  }
}

async function handlePersonalization() {
    const originalText = personalizeText.value;
    const instruction = personalizePrompt.value.trim();
    if (!instruction) {
        personalizePrompt.classList.add('ring-2','ring-rose-500'); setTimeout(()=>personalizePrompt.classList.remove('ring-2','ring-rose-500'), 1200); return;
    }

    personalizeLoader.classList.remove('hidden');
    personalizeGenerateBtn.disabled = true;

    try {
        const updatedText = await refineAnswer(originalText, instruction);
        personalizeText.value = updatedText;
        personalizePrompt.value = '';
    } catch (err) {
        toast('Erreur de personnalisation', false);
    } finally {
        personalizeLoader.classList.add('hidden');
        personalizeGenerateBtn.disabled = false;
    }
}

translateBtn.addEventListener('click', async ()=>{
  const text = questionEl.value.trim();
  if (!text) return toast('Veuillez entrer un message à traduire.', false);
  
  const originalLang = (insights.lang.textContent || 'auto').toLowerCase();
  const targetLang = document.documentElement.lang;
  if (originalLang === targetLang) return toast(`Le message est déjà en ${targetLang.toUpperCase()}.`);
  
  translationOutput.classList.remove('hidden');
  translationOutput.textContent = "Traduction en cours...";
  try {
    const translatedText = await translate(text, targetLang === "fr" ? "français" : "english");
    translationOutput.textContent = translatedText;
    toast('Traduction terminée.');
  } catch(e){ 
      translationOutput.textContent = "Erreur de traduction.";
      toast('Erreur de traduction', false); 
  }
});

// Init
function initializeApp() {
    // Theme
    applyTheme(localStorage.getItem('theme') || 'auto');

    // Language
    const savedLang = localStorage.getItem('aetheria_lang') || 'fr';
    languageSelect.value = savedLang;
    setLanguage(savedLang);

    // Notifications
    const notifPref = localStorage.getItem('aetheria_notifications') === 'true';
    notificationToggle.setAttribute('aria-checked', String(notifPref));
    
    // Initial data render
    refreshAllData();
}

initializeApp();