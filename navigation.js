console.log('Arquivo navigation.js carregado com sucesso!');

// Aguarda o DOM estar totalmente carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM totalmente carregado, inicializando navegação...');
    
    // Configurações da navegação
    const navigation = {
        currentSlide: 0,
        totalSlides: document.querySelectorAll('.card').length,
        
        // Inicialização
        init: function() {
            console.log('Inicializando navegação...');
            this.setupEventListeners();
            this.updateActiveDot(); // Atualiza o dot ativo na inicialização
            console.log('Navegação inicializada com sucesso!');
        },
        
        // Configura os event listeners
        setupEventListeners: function() {
            console.log('Configurando event listeners...');
            
            // Navegação por dots
            document.querySelectorAll('.nav-dot').forEach(dot => {
                dot.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'));
                    console.log(`Clicou no dot ${index}`);
                    this.goToSlide(index);
                });
            });
            
            // Escuta por mudanças no carrossel principal
            document.addEventListener('cardChanged', (e) => {
                console.log('Evento cardChanged recebido:', e.detail);
                this.currentSlide = e.detail.currentCard;
                this.updateActiveDot();
            });
            
            console.log('Event listeners configurados com sucesso!');
        },
        
        // Navega para um slide específico
        goToSlide: function(index) {
            console.log(`Navegando para o slide ${index}...`);
            
            if (index < 0 || index >= this.totalSlides) {
                console.error(`Índice ${index} fora dos limites (0-${this.totalSlides - 1}).`);
                return;
            }
            
            this.currentSlide = index;
            
            // Dispara o evento de mudança de slide no carrossel principal
            const event = new CustomEvent('goToCardEvent', { detail: { index } });
            document.dispatchEvent(event);
            
            // Atualiza o dot ativo
            this.updateActiveDot();
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
                } else {
                    dot.classList.remove('active');
                    dot.removeAttribute('aria-current');
                }
            });
            
            console.log('Atualização dos dots concluída.');
        }
    };
    
    // Verifica se estamos em um dispositivo desktop (onde os dots são exibidos)
    if (window.innerWidth > 1023) {
        console.log('Dispositivo desktop detectado. Inicializando navegação por dots...');
        navigation.init();
    } else {
        console.log('Dispositivo móvel detectado. Navegação por dots desativada.');
    }
    
    // Adiciona um listener para o redimensionamento da janela
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            console.log('Redimensionamento detectado, verificando necessidade de reinicialização...');
            if (window.innerWidth > 1023) {
                console.log('Reinicializando navegação...');
                navigation.init();
            }
        }, 250); // Debounce para melhor performance
    });
});
