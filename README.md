# FocusLite - Pomodoro + Tarefas

Teste Subida Dev

Uma aplicação web simples e elegante para gerenciar tarefas e usar a técnica Pomodoro para melhorar a produtividade.

## 🚀 Funcionalidades

### 📝 Gerenciamento de Tarefas
- **Adicionar tarefas**: Crie novas tarefas facilmente
- **Marcar como concluída**: Clique no círculo para marcar/desmarcar
- **Excluir tarefas**: Remova tarefas que não são mais necessárias
- **Iniciar foco**: Clique no botão ⏱️ para iniciar o timer com uma tarefa específica
- **Estatísticas**: Visualize total de tarefas e quantas foram concluídas

### ⏱️ Timer Pomodoro
- **Modo Foco**: 25 minutos de concentração
- **Modo Pausa**: 5 minutos de descanso
- **Controles**: Iniciar, pausar, resumir e resetar
- **Alternância automática**: Muda automaticamente entre foco e pausa
- **Notificações**: Sonoras e visuais quando o timer termina
- **Contador de ciclos**: Acompanhe quantos ciclos de foco completou

### 💾 Armazenamento Local
- **Persistência**: Todas as tarefas e configurações são salvas no navegador
- **Sem banco externo**: Funciona completamente offline
- **Backup automático**: Dados são salvos automaticamente

## 🎯 Como Usar

### 1. Adicionando Tarefas
1. Vá para a aba "Tarefas"
2. Digite sua tarefa no campo de texto
3. Pressione Enter ou clique em "Adicionar"
4. Use Ctrl/Cmd + Enter para adicionar rapidamente

### 2. Usando o Timer
1. Vá para a aba "Timer"
2. Escolha entre modo "Foco" (25 min) ou "Pausa" (5 min)
3. Clique em "Iniciar" para começar
4. Use "Pausar" para interromper temporariamente
5. Use "Reset" para voltar ao tempo inicial

### 3. Integrando Tarefas com Timer
1. Na lista de tarefas, clique no botão ⏱️ da tarefa desejada
2. A tarefa será destacada no timer
3. Inicie o timer para focar naquela tarefa específica

## ⌨️ Atalhos de Teclado

- **Ctrl/Cmd + Enter**: Adicionar tarefa rapidamente
- **Ctrl/Cmd + 1**: Ir para página de Tarefas
- **Ctrl/Cmd + 2**: Ir para página do Timer
- **Espaço**: Iniciar/Pausar timer (na página do timer)

## 🎨 Características da Interface

- **Design responsivo**: Funciona em desktop, tablet e mobile
- **Tema moderno**: Interface limpa e intuitiva
- **Animações suaves**: Transições elegantes entre páginas
- **Cores consistentes**: Paleta de cores harmoniosa
- **Ícones intuitivos**: Emojis e símbolos fáceis de entender

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos com flexbox e grid
- **JavaScript ES6+**: Código modular e bem estruturado
- **localStorage**: Armazenamento local no navegador
- **CSS Animations**: Transições e animações suaves

## 📁 Estrutura do Projeto

```
focuslite/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos da aplicação
├── js/
│   ├── storage.js      # Gerenciamento de armazenamento
│   ├── tasks.js        # Gerenciamento de tarefas
│   ├── timer.js        # Timer Pomodoro
│   ├── router.js       # Navegação entre páginas
│   └── app.js          # Aplicação principal
└── README.md           # Este arquivo
```

## 🚀 Como Executar

1. **Clone ou baixe** o projeto
2. **Abra o arquivo** `index.html` em qualquer navegador moderno
3. **Comece a usar** imediatamente!

### Requisitos do Navegador
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 🔧 Configurações

### Timer
- **Tempo de Foco**: 25 minutos (configurável)
- **Tempo de Pausa**: 5 minutos (configurável)
- **Alternância automática**: Ativada por padrão
- **Som**: Habilitado por padrão

### Notificações
- **Notificações do navegador**: Solicita permissão na primeira vez
- **Som de alerta**: Toca quando o timer termina
- **Notificações visuais**: Mensagens de sucesso e erro

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona bem em:
- **Desktop**: Interface completa com todas as funcionalidades
- **Tablet**: Layout adaptado para telas médias
- **Mobile**: Interface otimizada para telas pequenas

## 🎯 Dicas de Uso

### Para Máxima Produtividade
1. **Liste suas tarefas** pela manhã
2. **Use o timer** para focar em uma tarefa por vez
3. **Respeite as pausas** para manter a energia
4. **Acompanhe seus ciclos** para medir progresso

### Personalização
- As configurações são salvas automaticamente
- Todas as tarefas persistem entre sessões
- O contador de ciclos é mantido

## 🐛 Solução de Problemas

### Timer não funciona
- Verifique se o JavaScript está habilitado
- Recarregue a página
- Verifique o console do navegador para erros

### Tarefas não são salvas
- Verifique se o localStorage está disponível
- Tente em outro navegador
- Limpe o cache do navegador

### Notificações não aparecem
- Permita notificações quando solicitado
- Verifique as configurações do navegador
- Teste em modo incógnito

## 🔮 Funcionalidades Futuras

- [ ] Configurações personalizáveis de tempo
- [ ] Temas visuais alternativos
- [ ] Exportação de dados
- [ ] Estatísticas avançadas
- [ ] Integração com calendário
- [ ] Modo noturno
- [ ] Sincronização entre dispositivos

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests
- Melhorar a documentação

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas:
1. Verifique este README
2. Consulte o console do navegador
3. Abra uma issue no repositório

---

**FocusLite** - Simplifique sua produtividade, uma tarefa por vez! 🎯✨
