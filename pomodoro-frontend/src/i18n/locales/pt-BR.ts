export default {
  // Common
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    close: 'Fechar',
    delete: 'Excluir',
    edit: 'Editar',
    create: 'Criar',
    new: 'Novo',
    default: 'Padrão',
    loading: 'Carregando...',
    error: 'Erro',
    success: 'Sucesso',
  },

  // Header
  header: {
    title: 'Timer Pomodoro',
    projects: 'Projetos',
    settings: 'Configurações',
    settingsShortcut: 'Config. (Ctrl+,)',
    togglePanel: 'Alternar painel de tarefas',
    sessionCounter: '{count} pomodoro{plural} completado{plural}',
    signedInAs: 'Conectado como {name} — clique para sair',
    signOut: 'Sair',
  },

  // Timer
  timer: {
    modeTabs: {
      pomodoro: 'Pomodoro',
      shortBreak: 'Pausa Curta',
      longBreak: 'Pausa Longa',
    },
    start: 'INICIAR',
    pause: 'PAUSAR',
    reset: 'Resetar timer',
    switchMode: 'Mudar para {mode} (pressione {key})',
    keyboardHint: 'Pressione {key} para iniciar',
    modeLabel: {
      pomodoro: 'Hora de focar! Selecione uma tarefa.',
      break: '{mode} — aproveite para descansar.',
    },
  },

  // Task Panel
  taskPanel: {
    title: 'Tarefas',
    noTasks: 'Nenhuma tarefa ainda. Adicione uma abaixo!',
    selectToStart: 'Selecione uma tarefa para começar',
    tasksAvailable: '{count} tarefa{plural} disponível{plural}',
    workingOn: 'Trabalhando em',
    selected: 'Selecionada',
    pomodoros: 'Pomodoros',
    allTasks: 'Todas as tarefas',
    clickToSelect: 'Clique em uma tarefa para selecionar',
    deselectTask: 'Desmarcar tarefa',
  },

  // Add Task
  addTask: {
    button: 'Adicionar Tarefa',
    placeholder: 'No que você está trabalhando?',
    descriptionPlaceholder: 'Adicione uma descrição (opcional)...',
    project: 'Projeto:',
    selectProject: 'Selecione um projeto...',
    estimate: 'Est. Pomodoros:',
    decreaseEstimate: 'Diminuir estimativa',
    increaseEstimate: 'Aumentar estimativa',
    cancel: 'Cancelar',
    add: 'Adicionar',
  },

  // Task Item
  taskItem: {
    deleteTask: 'Excluir tarefa',
    editTask: 'Editar tarefa',
  },

  // Task List
  taskList: {
    noTasks: 'Nenhuma tarefa ainda.',
    addTask: 'Adicione uma abaixo!',
    showCompleted: 'Mostrar {count} tarefa{plural} concluída{plural}',
    hideCompleted: 'Ocultar concluídas',
  },

  // Settings Modal
  settings: {
    title: 'Configurações',
    close: 'Fechar configurações',
    sections: {
      time: 'Tempo (minutos)',
      longBreakInterval: 'Intervalo da Pausa Longa',
      sound: 'Som',
      autoStart: 'Início Automático',
    },
    fields: {
      pomodoro: 'Pomodoro',
      shortBreak: 'Pausa Curta',
      longBreak: 'Pausa Longa',
      longBreakAfter: 'Pausa longa após (pomodoros)',
      soundEnabled: 'Ativar notificações sonoras',
      volume: 'Volume',
      autoStartBreaks: 'Início automático nas pausas',
      autoStartPomodoros: 'Início automático nos pomodoros',
    },
    reset: 'Resetar para padrões',
    saveAndClose: 'Salvar e Fechar',
    language: 'Idioma',
    languageLabel: 'Idioma (Language)',
  },

  // Projects Modal
  projects: {
    title: 'Projetos',
    close: 'Fechar projetos',
    noProjects: 'Nenhum projeto ainda.',
    newProject: 'Novo Projeto',
    addProject: 'Adicionar Projeto',
    create: 'Criar',
    projectName: 'Nome do projeto',
    edit: 'Editar projeto {name}',
    delete: 'Excluir projeto {name}',
    save: 'Salvar',
    colorLabel: 'Cor do projeto',
  },

  // Login Modal
  login: {
    welcome: 'Bem-vindo ao Timer Pomodoro',
    description: 'Faça login para salvar suas tarefas e histórico em todos os dispositivos.',
    continueWithGithub: 'Continuar com GitHub',
    continueWithGoogle: 'Continuar com Google',
    continueWithFacebook: 'Continuar com Facebook',
    or: 'ou',
    continueWithoutLogin: 'Continuar sem fazer login',
    localOnly: 'Os dados serão salvos apenas localmente',
  },

  // Auth
  auth: {
    signingIn: 'Entrando...',
    signInFailed: 'Falha ao entrar',
    signOut: 'Saindo...',
  },

  // Validation
  validation: {
    required: 'Campo obrigatório',
    minLength: 'Mínimo de {min} caracteres',
    maxLength: 'Máximo de {max} caracteres',
    minNumber: 'Mínimo de {min}',
    maxNumber: 'Máximo de {max}',
  },

  // Time formatting
  time: {
    minutes: '{min} min',
    seconds: '{sec}s',
  },
} as const;
