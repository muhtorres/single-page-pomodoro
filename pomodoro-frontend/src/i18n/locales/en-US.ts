export default {
  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    close: 'Close',
    delete: 'Delete',
    edit: 'Edit',
    create: 'Create',
    new: 'New',
    default: 'Default',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
  },

  // Header
  header: {
    title: 'Pomodoro Timer',
    projects: 'Projects',
    settings: 'Settings',
    settingsShortcut: 'Settings (Ctrl+,)',
    togglePanel: 'Toggle task panel',
    sessionCounter: '{count} pomodoro{plural} completed',
    signedInAs: 'Signed in as {name} — click to sign out',
    signOut: 'Sign out',
  },

  // Timer
  timer: {
    modeTabs: {
      pomodoro: 'Pomodoro',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
    },
    start: 'START',
    pause: 'PAUSE',
    reset: 'Reset timer',
    switchMode: 'Switch to {mode} (press {key})',
    keyboardHint: 'Press {key} to start',
    modeLabel: {
      pomodoro: 'Time to focus! Select a task to work on.',
      break: '{mode} — take a moment to rest.',
    },
  },

  // Task Panel
  taskPanel: {
    title: 'Tasks',
    noTasks: 'No tasks yet. Add one below!',
    selectToStart: 'Select a task to start',
    tasksAvailable: '{count} task{plural} available',
    workingOn: 'Working on',
    selected: 'Selected',
    pomodoros: 'Pomodoros',
    allTasks: 'All tasks',
    clickToSelect: 'Click on a task to select it',
    deselectTask: 'Deselect task',
  },

  // Add Task
  addTask: {
    button: 'Add Task',
    placeholder: 'What are you working on?',
    descriptionPlaceholder: 'Add a description (optional)...',
    project: 'Project:',
    selectProject: 'Select a project...',
    estimate: 'Est. Pomodoros:',
    decreaseEstimate: 'Decrease estimate',
    increaseEstimate: 'Increase estimate',
    cancel: 'Cancel',
    add: 'Add',
  },

  // Task Item
  taskItem: {
    deleteTask: 'Delete task',
    editTask: 'Edit task',
  },

  // Task List
  taskList: {
    noTasks: 'No tasks yet.',
    addTask: 'Add one below!',
    showCompleted: 'Show {count} completed task{plural}',
    hideCompleted: 'Hide completed',
  },

  // Settings Modal
  settings: {
    title: 'Settings',
    close: 'Close settings',
    sections: {
      time: 'Time (minutes)',
      longBreakInterval: 'Long Break Interval',
      sound: 'Sound',
      autoStart: 'Auto Start',
    },
    fields: {
      pomodoro: 'Pomodoro',
      shortBreak: 'Short Break',
      longBreak: 'Long Break',
      longBreakAfter: 'Long break after (pomodoros)',
      soundEnabled: 'Enable sound notifications',
      volume: 'Volume',
      autoStartBreaks: 'Auto-start breaks',
      autoStartPomodoros: 'Auto-start pomodoros',
    },
    reset: 'Reset to defaults',
    saveAndClose: 'Save & Close',
    language: 'Language',
    languageLabel: 'Language (Idioma)',
  },

  // Projects Modal
  projects: {
    title: 'Projects',
    close: 'Close projects',
    noProjects: 'No projects yet.',
    newProject: 'New Project',
    addProject: 'Add Project',
    create: 'Create',
    projectName: 'Project name',
    edit: 'Edit project {name}',
    delete: 'Delete project {name}',
    save: 'Save',
    colorLabel: 'Project color',
  },

  // Login Modal
  login: {
    welcome: 'Welcome to Pomodoro Timer',
    description: 'Sign in to save your tasks and history across devices.',
    continueWithGithub: 'Continue with GitHub',
    continueWithGoogle: 'Continue with Google',
    continueWithFacebook: 'Continue with Facebook',
    or: 'or',
    continueWithoutLogin: 'Continue without signing in',
    localOnly: 'Data will be saved locally only',
  },

  // Auth
  auth: {
    signingIn: 'Signing in...',
    signInFailed: 'Failed to sign in',
    signOut: 'Signing out...',
  },

  // Validation
  validation: {
    required: 'Required field',
    minLength: 'Minimum {min} characters',
    maxLength: 'Maximum {max} characters',
    minNumber: 'Minimum {min}',
    maxNumber: 'Maximum {max}',
  },

  // Time formatting
  time: {
    minutes: '{min} min',
    seconds: '{sec}s',
  },
} as const;
