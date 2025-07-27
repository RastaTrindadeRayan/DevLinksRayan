// ========== CONFIGURAÇÕES ========== //
const OLLAMA_CONFIG = {
  endpoint: "http://34.67.216.224:11434/api/generate", // Substitua pelo seu endpoint
  model: "phi3", // Altere para o modelo desejado
  personality: `Você é o "RayBot", assistente do site trindaderayan.com.br. Siga estas regras:
- Linguagem informal e descontraída
- Respostas curtas (máximo 3 linhas)
- Foco em portfólio, TI e projetos pessoais
- Se não souber algo, diga "Vou perguntar ao Rayan!"`
};

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

// ========== CHATBOT ========== //
function toggleChat() {
  elements.chatContainer.style.display = elements.chatContainer.style.display === 'none' ? 'block' : 'none';
  elements.chatToggle.style.display = elements.chatContainer.style.display === 'block' ? 'none' : 'flex';
}

async function sendMessage() {
  const message = elements.userInput.value.trim();
  if (!message) return;

  // Exibe mensagem do usuário
  appendMessage('Você', message, 'user-message');
  elements.userInput.value = '';

  // Exibe "digitando..."
  const typingIndicator = appendMessage('RayBot', 'Digitando...', 'typing-message');

  try {
    const response = await fetch(OLLAMA_CONFIG.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_CONFIG.model,
        prompt: `${OLLAMA_CONFIG.personality}\n\nUsuário: ${message}\nRayBot:`,
        stream: false
      })
    });

    if (!response.ok) throw new Error(`Erro: ${response.status}`);
    
    const data = await response.json();
    typingIndicator.remove();
    appendMessage('RayBot', data.response, 'bot-message');
  } catch (error) {
    typingIndicator.remove();
    appendMessage('Sistema', `⚠️ ${error.message || "Servidor offline"}`, 'error-message');
    console.error("Erro no chatbot:", error);
  }
}

function appendMessage(sender, text, cssClass) {
  const messageDiv = document.createElement('div');
  messageDiv.innerHTML = `<strong>${sender}:</strong> ${text}`;
  messageDiv.className = cssClass;
  elements.chatMessages.appendChild(messageDiv);
  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
  return messageDiv;
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

// ========== INICIALIZAÇÃO ========== //
document.addEventListener('DOMContentLoaded', () => {
  // Inicializa chatbot
  elements.chatContainer.style.display = 'none';
  
  // Configura cookies
  setupCookieConsent();
  
  // Verifica se está no modo escuro
  if (!elements.html.classList.contains("Light")) {
    toggleMode();
  }
});