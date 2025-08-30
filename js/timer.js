/**
 * Módulo do Timer Pomodoro
 * Gerencia o cronômetro com alternância entre foco e pausa
 * 
 * Funcionalidades:
 * - Timer de foco (25 min) e pausa (5 min)
 * - Iniciar, pausar e resetar timer
 * - Alternância automática entre modos
 * - Notificações sonoras e visuais
 * - Contador de ciclos completados
 * - Integração com tarefas
 */

const PomodoroTimer = (function() {
    'use strict';

    // Estado interno do timer
    let timerState = {
        isRunning: false,
        isPaused: false,
        currentMode: 'focus', // 'focus' ou 'break'
        timeRemaining: 25 * 60, // 25 minutos em segundos
        totalTime: 25 * 60,
        cycles: 0
    };

    // Configurações do timer
    let config = {
        focusTime: 25 * 60,
        breakTime: 5 * 60,
        autoSwitch: true,
        soundEnabled: true
    };

    // Referências aos elementos DOM
    const elements = {
        timerDisplay: null,
        timerLabel: null,
        startBtn: null,
        pauseBtn: null,
        resetBtn: null,
        cyclesCount: null,
        currentTask: null,
        currentTaskText: null,
        modeBtns: null
    };

    // Variáveis de controle
    let timerInterval = null;
    let notificationTimeout = null;

    /**
     * Inicializa o módulo do timer
     * @param {Object} domElements - Objeto com referências aos elementos DOM
     */
    function init(domElements) {
        // Armazena referências aos elementos DOM
        Object.assign(elements, domElements);
        
        // Carrega configurações do localStorage
        loadConfigFromStorage();
        
        // Carrega ciclos salvos
        loadCyclesFromStorage();
        
        // Configura event listeners
        setupEventListeners();
        
        // Atualiza a interface inicial
        updateDisplay();
        updateCyclesDisplay();
        
        console.log('Módulo do timer inicializado com sucesso');
    }

    /**
     * Configura os event listeners para controles do timer
     */
    function setupEventListeners() {
        // Botão iniciar
        if (elements.startBtn) {
            elements.startBtn.addEventListener('click', startTimer);
        }

        // Botão pausar
        if (elements.pauseBtn) {
            elements.pauseBtn.addEventListener('click', pauseTimer);
        }

        // Botão reset
        if (elements.resetBtn) {
            elements.resetBtn.addEventListener('click', resetTimer);
        }

        // Botões de modo
        if (elements.modeBtns) {
            elements.modeBtns.forEach(btn => {
                btn.addEventListener('click', () => switchMode(btn.dataset.mode));
            });
        }

        // Event listener para mudança de tarefa atual
        document.addEventListener('currentTaskChanged', handleCurrentTaskChanged);
    }

    /**
     * Manipula mudança na tarefa atual
     * @param {CustomEvent} event - Evento de mudança de tarefa
     */
    function handleCurrentTaskChanged(event) {
        const task = event.detail.task;
        updateCurrentTaskDisplay(task);
    }

    /**
     * Atualiza a exibição da tarefa atual
     * @param {Object} task - Tarefa atual ou null
     */
    function updateCurrentTaskDisplay(task) {
        if (!elements.currentTask || !elements.currentTaskText) return;

        if (task) {
            elements.currentTaskText.textContent = task.text;
            elements.currentTask.style.display = 'block';
        } else {
            elements.currentTask.style.display = 'none';
        }
    }

    /**
     * Inicia o timer
     */
    function startTimer() {
        if (timerState.isRunning) return;

        timerState.isRunning = true;
        timerState.isPaused = false;

        // Configura o intervalo do timer
        timerInterval = setInterval(() => {
            tick();
        }, 1000);

        // Atualiza a interface
        updateButtonStates();
        updateDisplayClass('running');

        console.log('Timer iniciado');
    }

    /**
     * Pausa o timer
     */
    function pauseTimer() {
        if (!timerState.isRunning || timerState.isPaused) return;

        timerState.isPaused = true;
        clearInterval(timerInterval);

        // Atualiza a interface
        updateButtonStates();
        updateDisplayClass('paused');

        console.log('Timer pausado');
    }

    /**
     * Resume o timer pausado
     */
    function resumeTimer() {
        if (!timerState.isPaused) return;

        timerState.isPaused = false;
        startTimer();
    }

    /**
     * Reseta o timer para o estado inicial
     */
    function resetTimer() {
        // Para o timer se estiver rodando
        if (timerState.isRunning) {
            clearInterval(timerInterval);
        }

        // Reseta o estado
        timerState.isRunning = false;
        timerState.isPaused = false;
        timerState.timeRemaining = timerState.totalTime;

        // Atualiza a interface
        updateButtonStates();
        updateDisplayClass('stopped');
        updateDisplay();

        console.log('Timer resetado');
    }

    /**
     * Executa um tick do timer (decrementa 1 segundo)
     */
    function tick() {
        if (timerState.timeRemaining > 0) {
            timerState.timeRemaining--;
            updateDisplay();
        } else {
            // Timer terminou
            handleTimerComplete();
        }
    }

    /**
     * Manipula a conclusão do timer
     */
    function handleTimerComplete() {
        // Para o timer
        clearInterval(timerInterval);
        timerState.isRunning = false;
        timerState.isPaused = false;

        // Toca notificação
        playNotification();

        // Mostra notificação do navegador
        showBrowserNotification();

        // Atualiza a interface
        updateButtonStates();
        updateDisplayClass('stopped');

        // Incrementa ciclos se for modo foco
        if (timerState.currentMode === 'focus') {
            timerState.cycles++;
            saveCyclesToStorage();
            updateCyclesDisplay();
        }

        // Alterna automaticamente se configurado
        if (config.autoSwitch) {
            setTimeout(() => {
                switchMode(timerState.currentMode === 'focus' ? 'break' : 'focus');
                startTimer();
            }, 2000); // Aguarda 2 segundos antes de alternar
        }

        console.log(`Timer ${timerState.currentMode} concluído`);
    }

    /**
     * Alterna entre os modos foco e pausa
     * @param {string} mode - Novo modo ('focus' ou 'break')
     */
    function switchMode(mode) {
        if (mode === timerState.currentMode) return;

        // Para o timer se estiver rodando
        if (timerState.isRunning) {
            clearInterval(timerInterval);
            timerState.isRunning = false;
            timerState.isPaused = false;
        }

        // Atualiza o modo
        timerState.currentMode = mode;
        timerState.totalTime = mode === 'focus' ? config.focusTime : config.breakTime;
        timerState.timeRemaining = timerState.totalTime;

        // Atualiza botões de modo
        updateModeButtons();

        // Atualiza a interface
        updateDisplay();
        updateButtonStates();
        updateDisplayClass('stopped');

        console.log(`Modo alterado para: ${mode}`);
    }

    /**
     * Atualiza a exibição do timer
     */
    function updateDisplay() {
        if (!elements.timerDisplay) return;

        const minutes = Math.floor(timerState.timeRemaining / 60);
        const seconds = timerState.timeRemaining % 60;
        
        elements.timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Atualiza o label do timer
        if (elements.timerLabel) {
            const modeText = timerState.currentMode === 'focus' ? 'Foco' : 'Pausa';
            elements.timerLabel.textContent = `Tempo de ${modeText}`;
        }
    }

    /**
     * Atualiza os estados dos botões
     */
    function updateButtonStates() {
        if (!elements.startBtn || !elements.pauseBtn) return;

        if (timerState.isRunning && !timerState.isPaused) {
            // Timer rodando
            elements.startBtn.style.display = 'none';
            elements.pauseBtn.style.display = 'inline-flex';
        } else if (timerState.isPaused) {
            // Timer pausado
            elements.startBtn.textContent = 'Resumir';
            elements.startBtn.style.display = 'inline-flex';
            elements.pauseBtn.style.display = 'none';
        } else {
            // Timer parado
            elements.startBtn.textContent = 'Iniciar';
            elements.startBtn.style.display = 'inline-flex';
            elements.pauseBtn.style.display = 'none';
        }
    }

    /**
     * Atualiza os botões de modo
     */
    function updateModeButtons() {
        if (!elements.modeBtns) return;

        elements.modeBtns.forEach(btn => {
            if (btn.dataset.mode === timerState.currentMode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    /**
     * Atualiza a classe de exibição do timer
     * @param {string} state - Estado do timer ('running', 'paused', 'stopped')
     */
    function updateDisplayClass(state) {
        if (!elements.timerDisplay) return;

        // Remove classes anteriores
        elements.timerDisplay.classList.remove('running', 'paused', 'stopped');
        
        // Adiciona nova classe
        if (state) {
            elements.timerDisplay.classList.add(state);
        }
    }

    /**
     * Atualiza a exibição dos ciclos
     */
    function updateCyclesDisplay() {
        if (elements.cyclesCount) {
            elements.cyclesCount.textContent = timerState.cycles;
        }
    }

    /**
     * Toca notificação sonora
     */
    function playNotification() {
        if (!config.soundEnabled) return;

        try {
            const audio = document.getElementById('timer-sound');
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(error => {
                    console.warn('Erro ao tocar áudio:', error);
                });
            }
        } catch (error) {
            console.warn('Erro ao tocar notificação sonora:', error);
        }
    }

    /**
     * Mostra notificação do navegador
     */
    function showBrowserNotification() {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'granted') {
            const modeText = timerState.currentMode === 'focus' ? 'Foco' : 'Pausa';
            new Notification('FocusLite', {
                body: `Tempo de ${modeText} concluído!`,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏱️</text></svg>'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    showBrowserNotification();
                }
            });
        }
    }

    /**
     * Carrega configurações do localStorage
     */
    function loadConfigFromStorage() {
        try {
            const savedConfig = Storage.loadTimerConfig();
            if (savedConfig) {
                Object.assign(config, savedConfig);
            }
        } catch (error) {
            console.error('Erro ao carregar configurações do timer:', error);
        }
    }

    /**
     * Salva configurações no localStorage
     */
    function saveConfigToStorage() {
        try {
            Storage.saveTimerConfig(config);
        } catch (error) {
            console.error('Erro ao salvar configurações do timer:', error);
        }
    }

    /**
     * Carrega ciclos do localStorage
     */
    function loadCyclesFromStorage() {
        try {
            const savedCycles = Storage.loadCycles();
            if (typeof savedCycles === 'number') {
                timerState.cycles = savedCycles;
            }
        } catch (error) {
            console.error('Erro ao carregar ciclos:', error);
        }
    }

    /**
     * Salva ciclos no localStorage
     */
    function saveCyclesToStorage() {
        try {
            Storage.saveCycles(timerState.cycles);
        } catch (error) {
            console.error('Erro ao salvar ciclos:', error);
        }
    }

    /**
     * Obtém o estado atual do timer
     * @returns {Object} Estado atual do timer
     */
    function getTimerState() {
        return { ...timerState };
    }

    /**
     * Obtém as configurações atuais
     * @returns {Object} Configurações atuais
     */
    function getConfig() {
        return { ...config };
    }

    /**
     * Atualiza as configurações do timer
     * @param {Object} newConfig - Novas configurações
     */
    function updateConfig(newConfig) {
        Object.assign(config, newConfig);
        saveConfigToStorage();
        
        // Atualiza o timer se não estiver rodando
        if (!timerState.isRunning) {
            if (timerState.currentMode === 'focus') {
                timerState.totalTime = config.focusTime;
            } else {
                timerState.totalTime = config.breakTime;
            }
            timerState.timeRemaining = timerState.totalTime;
            updateDisplay();
        }
    }

    /**
     * Obtém o tempo restante formatado
     * @returns {string} Tempo no formato MM:SS
     */
    function getFormattedTimeRemaining() {
        const minutes = Math.floor(timerState.timeRemaining / 60);
        const seconds = timerState.timeRemaining % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    /**
     * Obtém o tempo total formatado
     * @returns {string} Tempo total no formato MM:SS
     */
    function getFormattedTotalTime() {
        const minutes = Math.floor(timerState.totalTime / 60);
        const seconds = timerState.totalTime % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Retorna a API pública do módulo
    return {
        // Funções principais
        init,
        startTimer,
        pauseTimer,
        resumeTimer,
        resetTimer,
        switchMode,
        
        // Funções de configuração
        getConfig,
        updateConfig,
        
        // Funções de estado
        getTimerState,
        getFormattedTimeRemaining,
        getFormattedTotalTime,
        
        // Funções utilitárias
        updateDisplay,
        updateButtonStates
    };
})();

// Verifica se o módulo está sendo executado em um ambiente que suporta módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PomodoroTimer;
}

