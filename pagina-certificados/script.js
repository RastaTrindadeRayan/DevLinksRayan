// Variáveis globais
const botoesFiltragem = document.querySelectorAll('.botao-filtro');
const cartoesCertificados = document.querySelectorAll('.grid-certificados .cartao-certificado');
const contadorCertificados = document.getElementById('contador');
const modal = document.getElementById('modalCertificado');
const frameCertificado = document.getElementById('frameCertificado');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    inicializarFiltros();
    atualizarContador('todos');
    adicionarAnimacoes();
});

// Sistema de filtragem
function inicializarFiltros() {
    botoesFiltragem.forEach(botao => {
        botao.addEventListener('click', function() {
            const categoria = this.getAttribute('data-categoria');
            
            // Atualizar botões ativos
            botoesFiltragem.forEach(b => b.classList.remove('ativo'));
            this.classList.add('ativo');
            
            // Filtrar certificados
            filtrarCertificados(categoria);
            
            // Atualizar contador
            atualizarContador(categoria);
        });
    });
}

function filtrarCertificados(categoria) {
    cartoesCertificados.forEach(cartao => {
        const categoriaCartao = cartao.getAttribute('data-categoria');
        
        if (categoria === 'todos' || categoriaCartao === categoria) {
            cartao.style.display = 'block';
            cartao.classList.remove('oculto');
            
            // Adicionar animação de entrada
            setTimeout(() => {
                cartao.style.opacity = '1';
                cartao.style.transform = 'translateY(0)';
            }, 100);
        } else {
            cartao.style.opacity = '0';
            cartao.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                cartao.style.display = 'none';
                cartao.classList.add('oculto');
            }, 300);
        }
    });
}

function atualizarContador(categoria) {
    let contador = 0;
    
    if (categoria === 'todos') {
        contador = cartoesCertificados.length;
    } else {
        cartoesCertificados.forEach(cartao => {
            if (cartao.getAttribute('data-categoria') === categoria) {
                contador++;
            }
        });
    }
    
    const texto = contador === 1 ? 'certificado encontrado' : 'certificados encontrados';
    contadorCertificados.textContent = `${contador} ${texto}`;
}

// Sistema de modal para visualização
function abrirCertificado(caminhoCertificado) {
    frameCertificado.src = caminhoCertificado;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Adicionar animação de abertura
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function fecharModal() {
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        frameCertificado.src = '';
        document.body.style.overflow = 'auto';
    }, 300);
}

// Fechar modal ao clicar fora do conteúdo
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        fecharModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        fecharModal();
    }
});

// Sistema de download
function baixarCertificado(caminhoCertificado) {
    const link = document.createElement('a');
    link.href = caminhoCertificado;
    link.download = caminhoCertificado.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Feedback visual
    mostrarNotificacao('Download iniciado!');
}

// Sistema de notificações
function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.className = 'notificacao';
    notificacao.textContent = mensagem;
    notificacao.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1001;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notificacao);
    
    // Animação de entrada
    setTimeout(() => {
        notificacao.style.opacity = '1';
        notificacao.style.transform = 'translateX(0)';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 300);
    }, 3000);
}

// Animações de entrada
function adicionarAnimacoes() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    cartoesCertificados.forEach(cartao => {
        cartao.style.opacity = '0';
        cartao.style.transform = 'translateY(20px)';
        cartao.style.transition = 'all 0.6s ease';
        observer.observe(cartao);
    });
}

// Busca em tempo real (funcionalidade adicional)
function adicionarBusca() {
    const campoBusca = document.createElement('input');
    campoBusca.type = 'text';
    campoBusca.placeholder = 'Buscar certificados...';
    campoBusca.className = 'campo-busca';
    campoBusca.style.cssText = `
        width: 100%;
        max-width: 400px;
        padding: 0.8rem 1rem;
        border: 2px solid #e0e0e0;
        border-radius: 25px;
        font-size: 1rem;
        margin: 1rem auto;
        display: block;
        transition: border-color 0.3s ease;
    `;
    
    const secaoFiltros = document.querySelector('.secao-filtros .container');
    secaoFiltros.insertBefore(campoBusca, secaoFiltros.firstChild);
    
    campoBusca.addEventListener('input', function() {
        const termoBusca = this.value.toLowerCase();
        
        cartoesCertificados.forEach(cartao => {
            const titulo = cartao.querySelector('.titulo-certificado').textContent.toLowerCase();
            const descricao = cartao.querySelector('.descricao-certificado').textContent.toLowerCase();
            
            if (titulo.includes(termoBusca) || descricao.includes(termoBusca)) {
                cartao.style.display = 'block';
            } else {
                cartao.style.display = 'none';
            }
        });
        
        // Atualizar contador baseado na busca
        const certificadosVisiveis = Array.from(cartoesCertificados).filter(cartao => 
            cartao.style.display !== 'none'
        ).length;
        
        const texto = certificadosVisiveis === 1 ? 'certificado encontrado' : 'certificados encontrados';
        contadorCertificados.textContent = `${certificadosVisiveis} ${texto}`;
    });
    
    campoBusca.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
    });
    
    campoBusca.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
    });
}

// Ativar busca (descomente a linha abaixo para habilitar)
// adicionarBusca();

// Smooth scroll para navegação
function adicionarSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar smooth scroll
adicionarSmoothScroll();

// Lazy loading para PDFs (otimização)
function implementarLazyLoading() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cartao = entry.target;
                const botaoVisualizar = cartao.querySelector('.botao-visualizar');
                
                // Pré-carregar o PDF quando o cartão estiver visível
                if (botaoVisualizar && !cartao.dataset.precarregado) {
                    const caminhoPdf = botaoVisualizar.getAttribute('onclick').match(/'([^']+)'/)[1];
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = caminhoPdf;
                    document.head.appendChild(link);
                    
                    cartao.dataset.precarregado = 'true';
                }
            }
        });
    }, {
        rootMargin: '100px'
    });
    
    cartoesCertificados.forEach(cartao => {
        observer.observe(cartao);
    });
}

// Ativar lazy loading
implementarLazyLoading();

