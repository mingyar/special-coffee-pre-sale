// Configurações da navegação
const navigation = {
    currentSlide: 0,
    totalSlides: document.querySelectorAll('.card').length,
    isAnimating: false,
    animationDuration: 400,
    
    // Inicialização
    init: function() {
        console.log('Configurando event listeners para navegação...');
        this.setupEventListeners();
        this.syncWithMainCarousel();
        console.log('Navegação inicializada com sucesso!');
    },
    
    // Sincroniza com o carrossel principal
    syncWithMainCarousel: function() {
        // Atualiza o slide atual com base no carrossel principal
        const track = document.querySelector('.cards-track');
        if (track) {
            const transform = window.getComputedStyle(track).transform;
            const matrix = new DOMMatrixReadOnly(transform);
            this.currentSlide = Math.round(-matrix.m41 / window.innerWidth);
            this.updateActiveDot();
        }
        
        // Escuta por mudanças no carrossel principal
        document.addEventListener('cardChanged', (e) => {
            if (!this.isAnimating) {
                this.currentSlide = e.detail.currentCard;
                this.updateActiveDot();
            }
        });
    },
    
    // Configura os event listeners
    setupEventListeners: function() {
        // Navegação por dots
        document.querySelectorAll('.nav-dot').forEach(dot => {
            dot.addEventListener('click', (e) => {
                if (this.isAnimating) return;
                const index = parseInt(e.target.getAttribute('data-index'));
                this.goToSlide(index);
            });
        });
    },
    
    // Navega para um slide específico
    goToSlide: function(index) {
        console.log(`Tentando navegar para o slide ${index}...`);
        
        if (this.isAnimating) {
            console.log('Navegação em andamento. Ignorando comando...');
            return;
        }
        
        if (index < 0 || index >= this.totalSlides) {
            console.error(`Índice ${index} fora dos limites (0-${this.totalSlides - 1}).`);
            return;
        }
        
        console.log(`Iniciando animação para o slide ${index}...`);
        this.isAnimating = true;
        this.currentSlide = index;
        
        // Dispara o evento de mudança de slide no carrossel principal
        const event = new CustomEvent('goToCardEvent', { detail: { index } });
        document.dispatchEvent(event);
        
        // Atualiza o dot ativo
        this.updateActiveDot();
        
        // Reseta a flag de animação
        console.log(`Aguardando término da animação (${this.animationDuration}ms)...`);
        setTimeout(() => {
            this.isAnimating = false;
            console.log(`Navegação para o slide ${index} concluída com sucesso!`);
        }, this.animationDuration);
    },
    
    // Atualiza o dot ativo
    updateActiveDot: function() {
        console.log(`Atualizando dot ativo para o slide ${this.currentSlide}...`);
        const dots = document.querySelectorAll('.nav-dot');
        
        if (dots.length === 0) {
            console.error('Nenhum elemento .nav-dot encontrado no DOM.');
            return;
        }
        
        console.log(`Encontrados ${dots.length} dots de navegação.`);
        
        dots.forEach((dot, index) => {
            if (index === this.currentSlide) {
                console.log(`Ativando dot ${index}...`);
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
                console.log(`Dot ${index} ativado com sucesso.`);
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
        
        console.log('Atualização dos dots concluída.');
    }
};

// Função para inicializar a navegação com base no tamanho da tela
function initNavigation() {
    console.log('Iniciando inicialização da navegação...');
    console.log('Largura da janela:', window.innerWidth);
    
    // Verifica se estamos em um dispositivo desktop (onde os dots são exibidos)
    if (window.innerWidth > 1023) {
        console.log('Dispositivo desktop detectado. Inicializando navegação por dots...');
        const navDots = document.querySelector('.nav-dots');
        
        if (navDots) {
            // Verifica se já foi inicializado para evitar duplicação
            if (!navDots.hasAttribute('data-initialized')) {
                console.log('Navegação por dots não inicializada. Inicializando...');
                navigation.init();
                navDots.setAttribute('data-initialized', 'true');
                console.log('Navegação por dots inicializada com sucesso!');
            } else {
                console.log('Navegação por dots já inicializada.');
            }
        } else {
            console.error('Elemento .nav-dots não encontrado no DOM.');
        }
    } else {
        console.log('Dispositivo móvel detectado. Navegação por dots desativada.');
        // Remove o atributo se voltar para mobile
        const navDots = document.querySelector('.nav-dots');
        if (navDots) {
            navDots.removeAttribute('data-initialized');
        }
    }
}

// Inicializa a navegação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    // Pequeno atraso para garantir que todos os elementos estejam renderizados
    setTimeout(() => {
        initNavigation();
        
        // Adiciona um listener para o redimensionamento da janela
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                initNavigation();
            }, 250); // Debounce para melhor performance
        });
    }, 100); // Pequeno atraso para garantir que tudo esteja pronto
});
