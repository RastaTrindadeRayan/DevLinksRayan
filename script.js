 function toggleMode()  {
 const html= document.documentElement
html.classList.toggle("Light")

const img = document.querySelector("#profile img")

if(html.classList.contains("Light")) {

  img.setAttribute("src", "./assets/euterno.jpeg") 
} else {
  
  img.setAttribute("src", "./assets/avatarblack.png")
}
if(html.classList.contains("Light")) {
  img.setAttribute("alt", "Foto de Rayan Trindade com um leve sorriso de camiseta listrada em azul preto branco e vermelho com a parede de fundo da cor cinza claro")
} else {
img.setAttribute(
  "alt",
  "Rayan com uma touca colorida com as cores da bandeira da Etiopia e uma cachoeira de fundo")
}

if(html.classList.contains("Light")) {

 links.setAttribute("href", "http://127.0.0.1:5500/assets/Avatar.png")
 } else {
  
links.setAttribute("href", "http://127.0.0.1:5500/assets/avatarblack.png")
} 
 }
 
  // Cookie Consent Manager
  document.addEventListener('DOMContentLoaded', function() {
    const cookieContainer = document.getElementById('cookie-consent-container');
    const acceptAllBtn = document.getElementById('accept-all-cookies');
    const necessaryBtn = document.getElementById('accept-necessary-cookies');
    const settingsBtn = document.getElementById('open-cookie-settings');
    const cookieModal = document.getElementById('cookie-settings-modal');
    const closeModal = document.querySelector('.close-modal');
    const saveSettingsBtn = document.getElementById('save-cookie-settings');
    const analyticsCheckbox = document.getElementById('analytics-cookies');
    
    // Verifica se já tem preferências salvas
    const cookiePrefs = getCookiePreferences();
    
    if (!cookiePrefs) {
      // Mostra o banner se não tiver preferências salvas
      cookieContainer.style.display = 'block';
    } else {
      // Carrega os cookies de acordo com as preferências salvas
      loadCookies(cookiePrefs);
    }
    
    // Configura os botões
    acceptAllBtn.addEventListener('click', function() {
      setCookiePreferences({ necessary: true, analytics: true });
      cookieContainer.style.display = 'none';
      loadCookies({ necessary: true, analytics: true });
    });
    
    necessaryBtn.addEventListener('click', function() {
      setCookiePreferences({ necessary: true, analytics: false });
      cookieContainer.style.display = 'none';
      loadCookies({ necessary: true, analytics: false });
    });
    
    settingsBtn.addEventListener('click', function() {
      cookieModal.style.display = 'block';
      // Atualiza o checkbox com as preferências atuais
      const prefs = getCookiePreferences();
      analyticsCheckbox.checked = prefs ? prefs.analytics : false;
    });
    
    closeModal.addEventListener('click', function() {
      cookieModal.style.display = 'none';
    });
    
    saveSettingsBtn.addEventListener('click', function() {
      const prefs = {
        necessary: true,
        analytics: analyticsCheckbox.checked
      };
      setCookiePreferences(prefs);
      cookieModal.style.display = 'none';
      cookieContainer.style.display = 'none';
      loadCookies(prefs);
    });
    
    // Fecha o modal ao clicar fora
    window.addEventListener('click', function(event) {
      if (event.target === cookieModal) {
        cookieModal.style.display = 'none';
      }
    });
    
    // Funções auxiliares
    function getCookiePreferences() {
      const prefs = localStorage.getItem('cookiePreferences');
      return prefs ? JSON.parse(prefs) : null;
    }
    
    function setCookiePreferences(prefs) {
      localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    }
    
    function loadCookies(prefs) {
      // Cookies necessários são sempre carregados
      // Aqui você carrega outros cookies baseado nas preferências
      if (prefs.analytics) {
        loadAnalyticsCookies();
      }
    }
    
    function loadAnalyticsCookies() {
      // Exemplo: Google Analytics
      // Substitua pelo seu código real de analytics
      console.log('Carregando cookies de analytics...');
      // window.dataLayer = window.dataLayer || [];
      // function gtag(){dataLayer.push(arguments);}
      // gtag('js', new Date());
      // gtag('config', 'UA-XXXXX-Y');
    }
  });
// Carrega o arquivo de personalidade (opcional: pode ser hardcoded)
const personalityText = `
Você é o "RayBot", assistente do site trindaderayan.com.br. Siga estas regras:
- Linguagem informal e descontraída (nada de "como um modelo AI").
- Respostas curtas.
- Seja útil, mas faça piadas ocasionais.
- Nunca repita respostas prontas; seja espontâneo.
- Se não souber algo, peça para ser ensinado.
- Se perguntarem quem te criou diga apenas meu nome, Rayan Trindade.
`;

async function sendMessage() {
  const input = document.getElementById("user-input").value;
  const chatBox = document.getElementById("chat-messages");

  if (!input) return;

  // Exibe a mensagem do usuário
  chatBox.innerHTML += `<div class="user-msg">Você: ${input}</div>`;
  document.getElementById("user-input").value = "";

  // Mostra um indicador de "digitando..."
  const typingIndicator = document.createElement("div");
  typingIndicator.id = "typing";
  typingIndicator.textContent = "RayBot está digitando...";
  chatBox.appendChild(typingIndicator);

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3", // Substitua pelo seu modelo (ex: mistral, phi3)
        prompt: `${personalityText}\n\nUsuário: ${input}\nRayBot:`,
        stream: false,
        options: { temperature: 0.8 }, // Controla a criatividade (0 = preciso, 1 = aleatório)
      }),
    });

    const data = await response.json();
    chatBox.removeChild(typingIndicator); // Remove o "digitando..."
    chatBox.innerHTML += `<div class="bot-msg">RayBot: ${data.response}</div>`;

  } catch (error) {
    chatBox.removeChild(typingIndicator);
    chatBox.innerHTML += `<div class="error-msg">RayBot: Estou offline! Verifique se o Ollama está rodando.</div>`;
  }
}
const response = await fetch('http://35.237.109.197:11434/api/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  body: JSON.stringify({
    model: "phi3",
    prompt: input,
    stream: false
  }),
  mode: 'cors' // Adicione esta linha
});