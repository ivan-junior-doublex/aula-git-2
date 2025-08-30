/**
 * Aplicação Principal FocusLite
 * Arquivo principal que inicializa e coordena todos os módulos
 * 
 * Funcionalidades:
 * - Inicialização de todos os módulos
 * - Coordenação entre módulos
 * - Configuração inicial da aplicação
 * - Tratamento de erros globais
 */

const FocusLiteApp = (function() {
    'use strict';

    // Estado da aplicação
    let isInitialized = false;
    let modules = {};

    /**
     * Inicializa a aplicação FocusLite
     */
    function init() {
        try {
            console.log('🚀 Iniciando FocusLite...');

            // Verifica se o DOM está pronto
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', initializeApp);
            } else {
                initializeApp();
            }

        } catch (error) {
            console.error('Erro ao inicializar FocusLite:', error);
            showErrorMessage('Erro ao inicializar a aplicação. Recarregue a página.');
        }
    }

    /**
     * Função principal de inicialização
     */
    function initializeApp() {
        try {
            // Verifica se o localStorage está disponível
            if (!Storage.isStorageAvailable()) {
                console.warn('localStorage não está disponível. Algumas funcionalidades podem não funcionar.');
            }

            // Inicializa o roteador
            initializeRouter();

            // Inicializa o gerenciador de tarefas
            initializeTaskManager();

            // Inicializa o timer Pomodoro
            initializePomodoroTimer();

            // Configura event listeners globais
            setupGlobalEventListeners();

            // Marca como inicializada
            isInitialized = true;

            console.log('✅ FocusLite inicializado com sucesso!');
            
            // Dispara evento de inicialização
            dispatchCustomEvent('appInitialized');

        } catch (error) {
            console.error('Erro durante a inicialização:', error);
            showErrorMessage('Erro durante a inicialização da aplicação.');
        }
    }

    /**
     * Inicializa o roteador
     */
    function initializeRouter() {
        try {
            // Configuração das páginas
            const pageConfig = {
                tasks: {
                    name: 'Tarefas',
                    element: document.getElementById('tasks-page'),
                    description: 'Gerencie suas tarefas diárias'
                },
                timer: {
                    name: 'Timer',
                    element: document.getElementById('timer-page'),
                    description: 'Timer Pomodoro para foco e pausa'
                }
            };

            // Inicializa o roteador
            Router.init(pageConfig);
            modules.router = Router;

            console.log('✅ Roteador inicializado');

        } catch (error) {
            console.error('Erro ao inicializar roteador:', error);
            throw error;
        }
    }

    /**
     * Inicializa o gerenciador de tarefas
     */
    function initializeTaskManager() {
        try {
            // Elementos DOM para o gerenciador de tarefas
            const taskElements = {
                taskInput: document.getElementById('task-input'),
                addTaskForm: document.getElementById('add-task-form'),
                tasksList: document.getElementById('tasks-list'),
                emptyState: document.getElementById('empty-state'),
                totalTasks: document.getElementById('total-tasks'),
                completedTasks: document.getElementById('completed-tasks')
            };

            // Inicializa o gerenciador de tarefas
            TaskManager.init(taskElements);
            modules.taskManager = TaskManager;

            console.log('✅ Gerenciador de tarefas inicializado');

        } catch (error) {
            console.error('Erro ao inicializar gerenciador de tarefas:', error);
            throw error;
        }
    }

    /**
     * Inicializa o timer Pomodoro
     */
    function initializePomodoroTimer() {
        try {
            // Elementos DOM para o timer
            const timerElements = {
                timerDisplay: document.getElementById('timer-display'),
                timerLabel: document.getElementById('timer-label'),
                startBtn: document.getElementById('start-btn'),
                pauseBtn: document.getElementById('pause-btn'),
                resetBtn: document.getElementById('reset-btn'),
                cyclesCount: document.getElementById('cycles-count'),
                currentTask: document.getElementById('current-task'),
                currentTaskText: document.getElementById('current-task-text'),
                modeBtns: document.querySelectorAll('.mode-btn')
            };

            // Inicializa o timer
            PomodoroTimer.init(timerElements);
            modules.pomodoroTimer = PomodoroTimer;

            console.log('✅ Timer Pomodoro inicializado');

        } catch (error) {
            console.error('Erro ao inicializar timer Pomodoro:', error);
            throw error;
        }
    }

    /**
     * Configura event listeners globais
     */
    function setupGlobalEventListeners() {
        // Event listener para mudanças de página
        document.addEventListener('pageChanged', handlePageChange);

        // Event listener para mudanças na tarefa atual
        document.addEventListener('currentTaskChanged', handleCurrentTaskChange);

        // Event listener para tarefas adicionadas
        document.addEventListener('taskAdded', handleTaskAdded);

        // Event listener para tarefas concluídas
        document.addEventListener('taskToggled', handleTaskToggled);

        // Event listener para teclas de atalho
        document.addEventListener('keydown', handleKeyboardShortcuts);

        // Event listener para visibilidade da página
        document.addEventListener('visibilitychange', handleVisibilityChange);

        console.log('✅ Event listeners globais configurados');
    }

    /**
     * Manipula mudanças de página
     * @param {CustomEvent} event - Evento de mudança de página
     */
    function handlePageChange(event) {
        const { previousPage, currentPage } = event.detail;
        console.log(`Navegação: ${previousPage} → ${currentPage}`);

        // Atualiza título da página
        updatePageTitle(currentPage);

        // Atualiza foco da página
        updatePageFocus(currentPage);
    }

    /**
     * Manipula mudanças na tarefa atual
     * @param {CustomEvent} event - Evento de mudança de tarefa
     */
    function handleCurrentTaskChange(event) {
        const { task } = event.detail;
        console.log('Tarefa atual alterada:', task ? task.text : 'Nenhuma');
    }

    /**
     * Manipula tarefas adicionadas
     * @param {CustomEvent} event - Evento de tarefa adicionada
     */
    function handleTaskAdded(event) {
        const { task } = event.detail;
        console.log('Nova tarefa adicionada:', task.text);

        // Mostra notificação visual
        showSuccessMessage(`Tarefa "${task.text}" adicionada com sucesso!`);
    }

    /**
     * Manipula tarefas alteradas
     * @param {CustomEvent} event - Evento de tarefa alterada
     */
    function handleTaskToggled(event) {
        const { task } = event.detail;
        const action = task.completed ? 'concluída' : 'desmarcada';
        console.log(`Tarefa ${action}:`, task.text);

        // Mostra notificação visual
        showSuccessMessage(`Tarefa "${task.text}" ${action}!`);
    }

    /**
     * Manipula atalhos de teclado
     * @param {KeyboardEvent} event - Evento de tecla pressionada
     */
    function handleKeyboardShortcuts(event) {
        // Ctrl/Cmd + Enter: Adicionar tarefa
        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            const taskInput = document.getElementById('task-input');
            if (taskInput && document.activeElement === taskInput) {
                event.preventDefault();
                const form = document.getElementById('add-task-form');
                if (form) {
                    form.dispatchEvent(new Event('submit'));
                }
            }
        }

        // Ctrl/Cmd + 1: Ir para Tarefas
        if ((event.ctrlKey || event.metaKey) && event.key === '1') {
            event.preventDefault();
            Router.navigateTo('tasks');
        }

        // Ctrl/Cmd + 2: Ir para Timer
        if ((event.ctrlKey || event.metaKey) && event.key === '2') {
            event.preventDefault();
            Router.navigateTo('timer');
        }

        // Espaço: Iniciar/Pausar timer (se estiver na página do timer)
        if (event.key === ' ' && Router.getCurrentPage() === 'timer') {
            event.preventDefault();
            const timer = modules.pomodoroTimer;
            if (timer) {
                const state = timer.getTimerState();
                if (state.isRunning) {
                    timer.pauseTimer();
                } else {
                    timer.startTimer();
                }
            }
        }
    }

    /**
     * Manipula mudanças na visibilidade da página
     */
    function handleVisibilityChange() {
        if (document.hidden) {
            console.log('Página oculta - pausando timer se necessário');
            // Pausa o timer se a página estiver oculta
            const timer = modules.pomodoroTimer;
            if (timer && timer.getTimerState().isRunning) {
                timer.pauseTimer();
            }
        } else {
            console.log('Página visível novamente');
        }
    }

    /**
     * Atualiza o título da página
     * @param {string} pageName - Nome da página
     */
    function updatePageTitle(pageName) {
        const pageInfo = Router.getPageInfo(pageName);
        if (pageInfo) {
            document.title = `FocusLite - ${pageInfo.name}`;
        }
    }

    /**
     * Atualiza o foco da página
     * @param {string} pageName - Nome da página
     */
    function updatePageFocus(pageName) {
        // Foca no primeiro elemento interativo da página
        setTimeout(() => {
            const pageElement = Router.getPageInfo(pageName)?.element;
            if (pageElement) {
                const firstFocusable = pageElement.querySelector('button, input, [tabindex]:not([tabindex="-1"])');
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }
        }, 100);
    }

    /**
     * Mostra mensagem de sucesso
     * @param {string} message - Mensagem a ser exibida
     */
    function showSuccessMessage(message) {
        showNotification(message, 'success');
    }

    /**
     * Mostra mensagem de erro
     * @param {string} message - Mensagem a ser exibida
     */
    function showErrorMessage(message) {
        showNotification(message, 'error');
    }

    /**
     * Mostra notificação
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo da notificação ('success', 'error', 'info')
     */
    function showNotification(message, type = 'info') {
        // Cria elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        // Estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Cores baseadas no tipo
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        // Adiciona ao DOM
        document.body.appendChild(notification);

        // Anima entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
     * Obtém o status da aplicação
     * @returns {Object} Status da aplicação
     */
    function getAppStatus() {
        return {
            isInitialized,
            modules: Object.keys(modules),
            currentPage: Router.getCurrentPage(),
            storageAvailable: Storage.isStorageAvailable(),
            taskCount: TaskManager.getAllTasks().length,
            timerState: PomodoroTimer.getTimerState()
        };
    }

    /**
     * Reinicia a aplicação
     */
    function restartApp() {
        console.log('🔄 Reiniciando FocusLite...');
        
        // Limpa módulos
        modules = {};
        
        // Reseta estado
        isInitialized = false;
        
        // Reinicializa
        setTimeout(init, 100);
    }

    /**
     * Limpa todos os dados da aplicação
     */
    function clearAllData() {
        if (confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
            try {
                Storage.clearAllData();
                TaskManager.clearAllTasks();
                
                // Reseta o timer
                const timer = modules.pomodoroTimer;
                if (timer) {
                    timer.resetTimer();
                }
                
                showSuccessMessage('Todos os dados foram limpos com sucesso!');
                console.log('✅ Todos os dados foram limpos');
                
            } catch (error) {
                console.error('Erro ao limpar dados:', error);
                showErrorMessage('Erro ao limpar dados.');
            }
        }
    }

    // Retorna a API pública da aplicação
    return {
        // Funções principais
        init,
        getAppStatus,
        restartApp,
        clearAllData,
        
        // Acesso aos módulos
        get modules() { return { ...modules }; },
        
        // Funções utilitárias
        showSuccessMessage,
        showErrorMessage,
        showNotification
    };
})();

// Inicializa a aplicação quando o script for carregado
FocusLiteApp.init();

// Expõe a aplicação globalmente para debugging
window.FocusLiteApp = FocusLiteApp;

// Verifica se o módulo está sendo executado em um ambiente que suporta módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FocusLiteApp;
}

