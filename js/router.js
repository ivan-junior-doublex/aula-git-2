/**
 * Módulo de Roteamento Simples
 * Gerencia a navegação entre as páginas da aplicação
 * 
 * Funcionalidades:
 * - Navegação entre páginas (Tarefas e Timer)
 * - Atualização da URL sem recarregar a página
 * - Histórico de navegação
 * - Estado ativo dos botões de navegação
 */

const Router = (function() {
    'use strict';

    // Estado interno do roteador
    let currentPage = 'tasks';
    let pages = {};
    let navButtons = [];

    /**
     * Inicializa o roteador
     * @param {Object} pageConfig - Configuração das páginas
     */
    function init(pageConfig) {
        // Armazena configuração das páginas
        pages = pageConfig;
        
        // Obtém botões de navegação
        navButtons = document.querySelectorAll('.nav-btn');
        
        // Configura event listeners
        setupEventListeners();
        
        // Configura histórico do navegador
        setupHistory();
        
        // Navega para a página inicial ou restaura da URL
        const initialPage = getPageFromURL() || 'tasks';
        navigateTo(initialPage, false);
        
        console.log('Roteador inicializado com sucesso');
    }

    /**
     * Configura os event listeners para navegação
     */
    function setupEventListeners() {
        // Event listeners para botões de navegação
        navButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.preventDefault();
                const targetPage = btn.dataset.page;
                if (targetPage && pages[targetPage]) {
                    navigateTo(targetPage);
                }
            });
        });

        // Event listener para mudanças no histórico do navegador
        window.addEventListener('popstate', handlePopState);
    }

    /**
     * Configura o histórico do navegador
     */
    function setupHistory() {
        // Adiciona estado inicial ao histórico se não existir
        if (!window.history.state) {
            const state = { page: currentPage };
            const url = `#${currentPage}`;
            window.history.replaceState(state, '', url);
        }
    }

    /**
     * Manipula mudanças no histórico do navegador (botão voltar/avançar)
     * @param {PopStateEvent} event - Evento de mudança no histórico
     */
    function handlePopState(event) {
        const page = event.state ? event.state.page : 'tasks';
        navigateTo(page, false);
    }

    /**
     * Navega para uma página específica
     * @param {string} pageName - Nome da página de destino
     * @param {boolean} updateHistory - Se deve atualizar o histórico (padrão: true)
     */
    function navigateTo(pageName, updateHistory = true) {
        // Verifica se a página existe
        if (!pages[pageName]) {
            console.error(`Página não encontrada: ${pageName}`);
            return;
        }

        // Atualiza o estado interno
        currentPage = pageName;

        // Atualiza a interface
        updatePageDisplay();
        updateNavigationState();

        // Atualiza o histórico se solicitado
        if (updateHistory) {
            updateBrowserHistory(pageName);
        }

        // Dispara evento customizado
        dispatchCustomEvent('pageChanged', { 
            previousPage: currentPage, 
            currentPage: pageName 
        });

        console.log(`Navegação para: ${pageName}`);
    }

    /**
     * Atualiza a exibição das páginas
     */
    function updatePageDisplay() {
        // Oculta todas as páginas
        Object.values(pages).forEach(page => {
            if (page.element) {
                page.element.classList.remove('active');
            }
        });

        // Mostra a página atual
        const currentPageElement = pages[currentPage].element;
        if (currentPageElement) {
            currentPageElement.classList.add('active');
        }
    }

    /**
     * Atualiza o estado dos botões de navegação
     */
    function updateNavigationState() {
        navButtons.forEach(btn => {
            if (btn.dataset.page === currentPage) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Atualiza o histórico do navegador
     * @param {string} pageName - Nome da página
     */
    function updateBrowserHistory(pageName) {
        const state = { page: pageName };
        const url = `#${pageName}`;
        
        try {
            window.history.pushState(state, '', url);
        } catch (error) {
            console.warn('Erro ao atualizar histórico do navegador:', error);
            // Fallback: atualiza apenas a URL
            window.location.hash = pageName;
        }
    }

    /**
     * Obtém a página atual da URL
     * @returns {string|null} Nome da página ou null
     */
    function getPageFromURL() {
        const hash = window.location.hash;
        if (hash) {
            const pageName = hash.substring(1); // Remove o #
            if (pages[pageName]) {
                return pageName;
            }
        }
        return null;
    }

    /**
     * Obtém a página atual
     * @returns {string} Nome da página atual
     */
    function getCurrentPage() {
        return currentPage;
    }

    /**
     * Obtém informações sobre uma página
     * @param {string} pageName - Nome da página
     * @returns {Object|null} Informações da página ou null
     */
    function getPageInfo(pageName) {
        return pages[pageName] || null;
    }

    /**
     * Obtém todas as páginas disponíveis
     * @returns {Object} Objeto com todas as páginas
     */
    function getAllPages() {
        return { ...pages };
    }

    /**
     * Verifica se uma página está ativa
     * @param {string} pageName - Nome da página
     * @returns {boolean} True se a página estiver ativa
     */
    function isPageActive(pageName) {
        return currentPage === pageName;
    }

    /**
     * Navega para a página anterior no histórico
     */
    function goBack() {
        if (window.history.length > 1) {
            window.history.back();
        }
    }

    /**
     * Navega para a próxima página no histórico
     */
    function goForward() {
        if (window.history.length > 1) {
            window.history.forward();
        }
    }

    /**
     * Atualiza a URL sem navegar
     * @param {string} pageName - Nome da página
     */
    function updateURL(pageName) {
        if (pages[pageName]) {
            const state = { page: pageName };
            const url = `#${pageName}`;
            window.history.replaceState(state, '', url);
        }
    }

    /**
     * Dispara um evento customizado
     * @param {string} eventName - Nome do evento
     * @param {Object} detail - Dados do evento
     */
    function dispatchCustomEvent(eventName, detail) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true
        });
        document.dispatchEvent(event);
    }

    /**
     * Adiciona uma nova página ao roteador
     * @param {string} pageName - Nome da página
     * @param {Object} pageConfig - Configuração da página
     */
    function addPage(pageName, pageConfig) {
        if (pages[pageName]) {
            console.warn(`Página já existe: ${pageName}`);
            return false;
        }

        pages[pageName] = pageConfig;
        console.log(`Página adicionada: ${pageName}`);
        return true;
    }

    /**
     * Remove uma página do roteador
     * @param {string} pageName - Nome da página
     */
    function removePage(pageName) {
        if (pages[pageName]) {
            delete pages[pageName];
            console.log(`Página removida: ${pageName}`);
            
            // Se a página removida for a atual, navega para a primeira disponível
            if (currentPage === pageName) {
                const firstPage = Object.keys(pages)[0];
                if (firstPage) {
                    navigateTo(firstPage);
                }
            }
        }
    }

    /**
     * Obtém estatísticas do roteador
     * @returns {Object} Estatísticas do roteador
     */
    function getRouterStats() {
        return {
            currentPage,
            totalPages: Object.keys(pages).length,
            availablePages: Object.keys(pages),
            historyLength: window.history.length
        };
    }

    // Retorna a API pública do módulo
    return {
        // Funções principais
        init,
        navigateTo,
        getCurrentPage,
        getPageInfo,
        getAllPages,
        isPageActive,
        
        // Funções de navegação
        goBack,
        goForward,
        updateURL,
        
        // Funções de gerenciamento
        addPage,
        removePage,
        getRouterStats
    };
})();

// Verifica se o módulo está sendo executado em um ambiente que suporta módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}

