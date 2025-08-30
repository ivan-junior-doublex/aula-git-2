/**
 * Módulo de Armazenamento Local
 * Gerencia o salvamento e carregamento de dados no localStorage do navegador
 * 
 * Funcionalidades:
 * - Salvar tarefas no localStorage
 * - Carregar tarefas do localStorage
 * - Salvar configurações do timer
 * - Carregar configurações do timer
 * - Limpar dados armazenados
 */

const Storage = (function() {
    'use strict';

    // Chaves para o localStorage
    const STORAGE_KEYS = {
        TASKS: 'focuslite_tasks',
        TIMER_CONFIG: 'focuslite_timer_config',
        CYCLES: 'focuslite_cycles'
    };

    /**
     * Salva dados no localStorage
     * @param {string} key - Chave para armazenar os dados
     * @param {any} data - Dados a serem salvos
     */
    function saveData(key, data) {
        try {
            const serializedData = JSON.stringify(data);
            localStorage.setItem(key, serializedData);
            console.log(`Dados salvos com sucesso na chave: ${key}`);
        } catch (error) {
            console.error(`Erro ao salvar dados na chave ${key}:`, error);
        }
    }

    /**
     * Carrega dados do localStorage
     * @param {string} key - Chave dos dados a serem carregados
     * @param {any} defaultValue - Valor padrão caso não encontre dados
     * @returns {any} Dados carregados ou valor padrão
     */
    function loadData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            if (data === null) {
                console.log(`Nenhum dado encontrado para a chave: ${key}`);
                return defaultValue;
            }
            
            const parsedData = JSON.parse(data);
            console.log(`Dados carregados com sucesso da chave: ${key}`);
            return parsedData;
        } catch (error) {
            console.error(`Erro ao carregar dados da chave ${key}:`, error);
            return defaultValue;
        }
    }

    /**
     * Remove dados específicos do localStorage
     * @param {string} key - Chave dos dados a serem removidos
     */
    function removeData(key) {
        try {
            localStorage.removeItem(key);
            console.log(`Dados removidos com sucesso da chave: ${key}`);
        } catch (error) {
            console.error(`Erro ao remover dados da chave ${key}:`, error);
        }
    }

    /**
     * Salva a lista de tarefas no localStorage
     * @param {Array} tasks - Array de tarefas a serem salvas
     */
    function saveTasks(tasks) {
        saveData(STORAGE_KEYS.TASKS, tasks);
    }

    /**
     * Carrega a lista de tarefas do localStorage
     * @returns {Array} Array de tarefas ou array vazio
     */
    function loadTasks() {
        return loadData(STORAGE_KEYS.TASKS, []);
    }

    /**
     * Salva as configurações do timer no localStorage
     * @param {Object} config - Configurações do timer
     */
    function saveTimerConfig(config) {
        saveData(STORAGE_KEYS.TIMER_CONFIG, config);
    }

    /**
     * Carrega as configurações do timer do localStorage
     * @returns {Object} Configurações do timer ou configurações padrão
     */
    function loadTimerConfig() {
        const defaultConfig = {
            focusTime: 25 * 60, // 25 minutos em segundos
            breakTime: 5 * 60,  // 5 minutos em segundos
            autoSwitch: true,   // Alternar automaticamente entre foco e pausa
            soundEnabled: true  // Som habilitado
        };
        
        return loadData(STORAGE_KEYS.TIMER_CONFIG, defaultConfig);
    }

    /**
     * Salva o contador de ciclos no localStorage
     * @param {number} cycles - Número de ciclos completados
     */
    function saveCycles(cycles) {
        saveData(STORAGE_KEYS.CYCLES, cycles);
    }

    /**
     * Carrega o contador de ciclos do localStorage
     * @returns {number} Número de ciclos ou 0
     */
    function loadCycles() {
        return loadData(STORAGE_KEYS.CYCLES, 0);
    }

    /**
     * Limpa todos os dados do FocusLite do localStorage
     */
    function clearAllData() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            console.log('Todos os dados do FocusLite foram removidos');
        } catch (error) {
            console.error('Erro ao limpar dados:', error);
        }
    }

    /**
     * Verifica se o localStorage está disponível no navegador
     * @returns {boolean} True se disponível, false caso contrário
     */
    function isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (error) {
            console.warn('localStorage não está disponível neste navegador');
            return false;
        }
    }

    /**
     * Obtém informações sobre o uso do localStorage
     * @returns {Object} Informações sobre o uso do storage
     */
    function getStorageInfo() {
        if (!isStorageAvailable()) {
            return { available: false };
        }

        try {
            let totalSize = 0;
            let itemCount = 0;

            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    const item = localStorage.getItem(key);
                    totalSize += item ? item.length : 0;
                    itemCount++;
                }
            }

            return {
                available: true,
                totalSize: totalSize,
                itemCount: itemCount,
                maxSize: 5 * 1024 * 1024 // 5MB (estimativa)
            };
        } catch (error) {
            console.error('Erro ao obter informações do storage:', error);
            return { available: false };
        }
    }

    // Retorna a API pública do módulo
    return {
        // Funções principais
        saveTasks,
        loadTasks,
        saveTimerConfig,
        loadTimerConfig,
        saveCycles,
        loadCycles,
        
        // Funções utilitárias
        clearAllData,
        isStorageAvailable,
        getStorageInfo,
        
        // Funções genéricas
        saveData,
        loadData,
        removeData
    };
})();

// Verifica se o módulo está sendo executado em um ambiente que suporta módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}

