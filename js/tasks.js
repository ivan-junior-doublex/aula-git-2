/**
 * Módulo de Gerenciamento de Tarefas
 * Gerencia a criação, edição, exclusão e marcação de tarefas
 * 
 * Funcionalidades:
 * - Adicionar novas tarefas
 * - Marcar tarefas como concluídas
 * - Excluir tarefas
 * - Iniciar timer para uma tarefa específica
 * - Contar tarefas totais e concluídas
 * - Persistir dados no localStorage
 */

const TaskManager = (function() {
    'use strict';

    // Estado interno do módulo
    let tasks = [];
    let currentTaskId = null;

    // Elementos DOM
    const elements = {
        taskInput: null,
        addTaskForm: null,
        tasksList: null,
        emptyState: null,
        totalTasks: null,
        completedTasks: null
    };

    /**
     * Inicializa o módulo de tarefas
     * @param {Object} domElements - Objeto com referências aos elementos DOM
     */
    function init(domElements) {
        // Armazena referências aos elementos DOM
        Object.assign(elements, domElements);
        
        // Carrega tarefas salvas do localStorage
        loadTasksFromStorage();
        
        // Configura event listeners
        setupEventListeners();
        
        // Renderiza a lista inicial
        renderTasks();
        
        console.log('Módulo de tarefas inicializado com sucesso');
    }

    /**
     * Configura os event listeners para interações com tarefas
     */
    function setupEventListeners() {
        // Formulário de adicionar tarefa
        if (elements.addTaskForm) {
            elements.addTaskForm.addEventListener('submit', handleAddTask);
        }

        // Input de tarefa
        if (elements.taskInput) {
            elements.taskInput.addEventListener('keypress', handleTaskInputKeypress);
        }
    }

    /**
     * Manipula o envio do formulário de adicionar tarefa
     * @param {Event} event - Evento de submit do formulário
     */
    function handleAddTask(event) {
        event.preventDefault();
        
        const taskText = elements.taskInput.value.trim();
        
        if (taskText) {
            addTask(taskText);
            elements.taskInput.value = '';
            elements.taskInput.focus();
        }
    }

    /**
     * Manipula tecla pressionada no input de tarefa
     * @param {KeyboardEvent} event - Evento de tecla pressionada
     */
    function handleTaskInputKeypress(event) {
        if (event.key === 'Enter') {
            const taskText = event.target.value.trim();
            
            if (taskText) {
                addTask(taskText);
                event.target.value = '';
            }
        }
    }

    /**
     * Adiciona uma nova tarefa
     * @param {string} text - Texto da tarefa
     * @returns {Object} Tarefa criada
     */
    function addTask(text) {
        const task = {
            id: generateTaskId(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        tasks.push(task);
        
        // Salva no localStorage
        saveTasksToStorage();
        
        // Renderiza a lista atualizada
        renderTasks();
        
        console.log('Tarefa adicionada:', task);
        
        // Dispara evento customizado
        dispatchCustomEvent('taskAdded', { task });
        
        return task;
    }

    /**
     * Gera um ID único para a tarefa
     * @returns {string} ID único
     */
    function generateTaskId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Alterna o status de conclusão de uma tarefa
     * @param {string} taskId - ID da tarefa
     */
    function toggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            // Salva no localStorage
            saveTasksToStorage();
            
            // Renderiza a lista atualizada
            renderTasks();
            
            console.log(`Tarefa ${task.completed ? 'concluída' : 'desmarcada'}:`, task);
            
            // Dispara evento customizado
            dispatchCustomEvent('taskToggled', { task });
        }
    }

    /**
     * Remove uma tarefa
     * @param {string} taskId - ID da tarefa
     */
    function deleteTask(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            const deletedTask = tasks.splice(taskIndex, 1)[0];
            
            // Remove a tarefa atual se for a deletada
            if (currentTaskId === taskId) {
                currentTaskId = null;
            }
            
            // Salva no localStorage
            saveTasksToStorage();
            
            // Renderiza a lista atualizada
            renderTasks();
            
            console.log('Tarefa removida:', deletedTask);
            
            // Dispara evento customizado
            dispatchCustomEvent('taskDeleted', { task: deletedTask });
        }
    }

    /**
     * Define uma tarefa como atual para o timer
     * @param {string} taskId - ID da tarefa
     */
    function setCurrentTask(taskId) {
        currentTaskId = taskId;
        
        // Dispara evento customizado
        const task = tasks.find(t => t.id === taskId);
        if (task) {
            dispatchCustomEvent('currentTaskChanged', { task });
        }
        
        console.log('Tarefa atual definida:', taskId);
    }

    /**
     * Obtém a tarefa atual
     * @returns {Object|null} Tarefa atual ou null
     */
    function getCurrentTask() {
        return currentTaskId ? tasks.find(t => t.id === currentTaskId) : null;
    }

    /**
     * Obtém todas as tarefas
     * @returns {Array} Array de tarefas
     */
    function getAllTasks() {
        return [...tasks];
    }

    /**
     * Obtém tarefas por status
     * @param {boolean} completed - Status de conclusão
     * @returns {Array} Array de tarefas filtradas
     */
    function getTasksByStatus(completed) {
        return tasks.filter(task => task.completed === completed);
    }

    /**
     * Obtém estatísticas das tarefas
     * @returns {Object} Objeto com estatísticas
     */
    function getTaskStats() {
        const total = tasks.length;
        const completed = tasks.filter(task => task.completed).length;
        const pending = total - completed;
        
        return {
            total,
            completed,
            pending,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    /**
     * Renderiza a lista de tarefas na interface
     */
    function renderTasks() {
        if (!elements.tasksList) return;

        // Limpa a lista atual
        elements.tasksList.innerHTML = '';

        // Renderiza cada tarefa
        tasks.forEach(task => {
            const taskElement = createTaskElement(task);
            elements.tasksList.appendChild(taskElement);
        });

        // Atualiza estatísticas
        updateStats();
        
        // Mostra/oculta estado vazio
        toggleEmptyState();
    }

    /**
     * Cria um elemento DOM para uma tarefa
     * @param {Object} task - Objeto da tarefa
     * @returns {HTMLElement} Elemento DOM da tarefa
     */
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.taskId = task.id;

        li.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="TaskManager.toggleTask('${task.id}')"></div>
            <span class="task-text">${escapeHtml(task.text)}</span>
            <div class="task-actions">
                <button class="task-btn focus" 
                        onclick="TaskManager.setCurrentTask('${task.id}')" 
                        title="Iniciar foco nesta tarefa">
                    ⏱️
                </button>
                <button class="task-btn delete" 
                        onclick="TaskManager.deleteTask('${task.id}')" 
                        title="Excluir tarefa">
                    🗑️
                </button>
            </div>
        `;

        return li;
    }

    /**
     * Escapa HTML para evitar XSS
     * @param {string} text - Texto a ser escapado
     * @returns {string} Texto escapado
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Atualiza as estatísticas na interface
     */
    function updateStats() {
        const stats = getTaskStats();
        
        if (elements.totalTasks) {
            elements.totalTasks.textContent = stats.total;
        }
        
        if (elements.completedTasks) {
            elements.completedTasks.textContent = stats.completed;
        }
    }

    /**
     * Mostra ou oculta o estado vazio
     */
    function toggleEmptyState() {
        if (elements.emptyState) {
            if (tasks.length === 0) {
                elements.emptyState.style.display = 'block';
                if (elements.tasksList) {
                    elements.tasksList.style.display = 'none';
                }
            } else {
                elements.emptyState.style.display = 'none';
                if (elements.tasksList) {
                    elements.tasksList.style.display = 'block';
                }
            }
        }
    }

    /**
     * Carrega tarefas do localStorage
     */
    function loadTasksFromStorage() {
        try {
            const savedTasks = Storage.loadTasks();
            if (Array.isArray(savedTasks)) {
                tasks = savedTasks;
                console.log(`${tasks.length} tarefas carregadas do localStorage`);
            }
        } catch (error) {
            console.error('Erro ao carregar tarefas do localStorage:', error);
            tasks = [];
        }
    }

    /**
     * Salva tarefas no localStorage
     */
    function saveTasksToStorage() {
        try {
            Storage.saveTasks(tasks);
        } catch (error) {
            console.error('Erro ao salvar tarefas no localStorage:', error);
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
     * Limpa todas as tarefas
     */
    function clearAllTasks() {
        tasks = [];
        currentTaskId = null;
        saveTasksToStorage();
        renderTasks();
        
        console.log('Todas as tarefas foram removidas');
        
        // Dispara evento customizado
        dispatchCustomEvent('allTasksCleared');
    }

    /**
     * Marca todas as tarefas como concluídas
     */
    function completeAllTasks() {
        tasks.forEach(task => {
            if (!task.completed) {
                task.completed = true;
                task.completedAt = new Date().toISOString();
            }
        });
        
        saveTasksToStorage();
        renderTasks();
        
        console.log('Todas as tarefas foram marcadas como concluídas');
        
        // Dispara evento customizado
        dispatchCustomEvent('allTasksCompleted');
    }

    // Retorna a API pública do módulo
    return {
        // Funções principais
        init,
        addTask,
        toggleTask,
        deleteTask,
        setCurrentTask,
        getCurrentTask,
        getAllTasks,
        getTasksByStatus,
        getTaskStats,
        
        // Funções utilitárias
        clearAllTasks,
        completeAllTasks,
        renderTasks,
        updateStats
    };
})();

// Verifica se o módulo está sendo executado em um ambiente que suporta módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskManager;
}

