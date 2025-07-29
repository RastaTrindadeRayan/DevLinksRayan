

// ========== ELEMENTOS DO DOM ========== //
const elements = {
  html: document.documentElement,
  profileImg: document.querySelector("#profile img"),
  switchBtn: document.getElementById('switch'),
  chatToggle: document.getElementById('chat-toggle'),
  chatContainer: document.getElementById('chat-container'),
  chatMessages: document.getElementById('chat-messages'),
  userInput: document.getElementById('user-input'),
  cookieConsent: document.getElementById('cookie-consent-container'),
  cookieModal: document.getElementById('cookie-settings-modal')
};

// ========== MODO CLARO/ESCURO ========== //
function toggleMode() {
  elements.html.classList.toggle("Light");
  
  // Alternar imagem do perfil
  if(elements.html.classList.contains("Light")) {
    elements.profileImg.setAttribute("src", "./assets/euterno.jpeg");
    elements.profileImg.setAttribute("alt", "Foto de Rayan Trindade com um leve sorriso de camiseta listrada em azul preto branco e vermelho com a parede de fundo da cor cinza claro");
  } else {
    elements.profileImg.setAttribute("src", "./assets/avatarblack.png");
    elements.profileImg.setAttribute("alt", "Rayan com uma touca colorida com as cores da bandeira da Etiopia e uma cachoeira de fundo");
  }
}



// ========== COOKIE CONSENT ========== //
function setupCookieConsent() {
  const getCookiePreferences = () => JSON.parse(localStorage.getItem('cookiePreferences'));
  const setCookiePreferences = (prefs) => localStorage.setItem('cookiePreferences', JSON.stringify(prefs));

  const loadAnalyticsCookies = () => {
    console.log('Cookies de analytics carregados');
    // Implemente seu código de analytics aqui
  };

  // Elementos
  const acceptAllBtn = document.getElementById('accept-all-cookies');
  const necessaryBtn = document.getElementById('accept-necessary-cookies');
  const settingsBtn = document.getElementById('open-cookie-settings');
  const closeModal = document.querySelector('.close-modal');
  const saveSettingsBtn = document.getElementById('save-cookie-settings');
  const analyticsCheckbox = document.getElementById('analytics-cookies');

  // Verifica preferências salvas
  const cookiePrefs = getCookiePreferences();
  if (!cookiePrefs) {
    elements.cookieConsent.style.display = 'block';
  } else if (cookiePrefs.analytics) {
    loadAnalyticsCookies();
  }

  // Event Listeners
  acceptAllBtn.addEventListener('click', () => {
    setCookiePreferences({ necessary: true, analytics: true });
    elements.cookieConsent.style.display = 'none';
    loadAnalyticsCookies();
  });

  necessaryBtn.addEventListener('click', () => {
    setCookiePreferences({ necessary: true, analytics: false });
    elements.cookieConsent.style.display = 'none';
  });

  settingsBtn.addEventListener('click', () => {
    elements.cookieModal.style.display = 'block';
    analyticsCheckbox.checked = cookiePrefs ? cookiePrefs.analytics : false;
  });

  closeModal.addEventListener('click', () => {
    elements.cookieModal.style.display = 'none';
  });

  saveSettingsBtn.addEventListener('click', () => {
    const prefs = {
      necessary: true,
      analytics: analyticsCheckbox.checked
    };
    setCookiePreferences(prefs);
    elements.cookieModal.style.display = 'none';
    elements.cookieConsent.style.display = 'none';
    if (prefs.analytics) loadAnalyticsCookies();
  });

  window.addEventListener('click', (event) => {
    if (event.target === elements.cookieModal) {
      elements.cookieModal.style.display = 'none';
    }
  });
}

// Pode ser usado para lógicas adicionais do site
console.log("Script carregado!");