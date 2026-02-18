import { useTaskStore } from '@/store/taskStore'

beforeEach(() => {
  useTaskStore.setState({ tasks: [], selectedTaskId: null })
})

describe('taskStore', () => {
  describe('addTask', () => {
    it('adds a task with correct defaults', () => {
      useTaskStore.getState().addTask('Write tests')
      const { tasks } = useTaskStore.getState()
      expect(tasks).toHaveLength(1)
      expect(tasks[0].title).toBe('Write tests')
      expect(tasks[0].completed).toBe(false)
      expect(tasks[0].actualPomodoros).toBe(0)
      expect(tasks[0].estimatedPomodoros).toBe(1)
    })

    it('adds a task with custom estimate', () => {
      useTaskStore.getState().addTask('Big task', 5)
      expect(useTaskStore.getState().tasks[0].estimatedPomodoros).toBe(5)
    })

    it('generates a unique id', () => {
      useTaskStore.getState().addTask('Task 1')
      useTaskStore.getState().addTask('Task 2')
      const { tasks } = useTaskStore.getState()
      expect(tasks[0].id).not.toBe(tasks[1].id)
    })

    it('sets createdAt timestamp', () => {
      const before = Date.now()
      useTaskStore.getState().addTask('Timestamped task')
      const after = Date.now()
      const { tasks } = useTaskStore.getState()
      expect(tasks[0].createdAt).toBeGreaterThanOrEqual(before)
      expect(tasks[0].createdAt).toBeLessThanOrEqual(after)
    })

    it('appends tasks in order', () => {
      useTaskStore.getState().addTask('First')
      useTaskStore.getState().addTask('Second')
      useTaskStore.getState().addTask('Third')
      const { tasks } = useTaskStore.getState()
      expect(tasks[0].title).toBe('First')
      expect(tasks[1].title).toBe('Second')
      expect(tasks[2].title).toBe('Third')
    })
  })

  describe('toggleTask', () => {
    it('marks incomplete task as complete', () => {
      useTaskStore.getState().addTask('Toggle me')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().toggleTask(id)
      expect(useTaskStore.getState().tasks[0].completed).toBe(true)
    })

    it('marks complete task as incomplete', () => {
      useTaskStore.getState().addTask('Toggle me')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().toggleTask(id)
      useTaskStore.getState().toggleTask(id)
      expect(useTaskStore.getState().tasks[0].completed).toBe(false)
    })

    it('only toggles the specified task', () => {
      useTaskStore.getState().addTask('Task A')
      useTaskStore.getState().addTask('Task B')
      const idA = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().toggleTask(idA)
      expect(useTaskStore.getState().tasks[0].completed).toBe(true)
      expect(useTaskStore.getState().tasks[1].completed).toBe(false)
    })
  })

  describe('deleteTask', () => {
    it('removes the task', () => {
      useTaskStore.getState().addTask('Delete me')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().deleteTask(id)
      expect(useTaskStore.getState().tasks).toHaveLength(0)
    })

    it('clears selection when deleted task was selected', () => {
      useTaskStore.getState().addTask('Selected task')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().selectTask(id)
      useTaskStore.getState().deleteTask(id)
      expect(useTaskStore.getState().selectedTaskId).toBeNull()
    })

    it('preserves selection when other task is deleted', () => {
      useTaskStore.getState().addTask('Keep selected')
      useTaskStore.getState().addTask('Delete me')
      const keepId = useTaskStore.getState().tasks[0].id
      const deleteId = useTaskStore.getState().tasks[1].id
      useTaskStore.getState().selectTask(keepId)
      useTaskStore.getState().deleteTask(deleteId)
      expect(useTaskStore.getState().selectedTaskId).toBe(keepId)
    })

    it('leaves other tasks intact', () => {
      useTaskStore.getState().addTask('Keep')
      useTaskStore.getState().addTask('Delete')
      const deleteId = useTaskStore.getState().tasks[1].id
      useTaskStore.getState().deleteTask(deleteId)
      expect(useTaskStore.getState().tasks).toHaveLength(1)
      expect(useTaskStore.getState().tasks[0].title).toBe('Keep')
    })
  })

  describe('selectTask', () => {
    it('selects a task by id', () => {
      useTaskStore.getState().addTask('Selectable')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().selectTask(id)
      expect(useTaskStore.getState().selectedTaskId).toBe(id)
    })

    it('deselects when set to null', () => {
      useTaskStore.getState().addTask('Selectable')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().selectTask(id)
      useTaskStore.getState().selectTask(null)
      expect(useTaskStore.getState().selectedTaskId).toBeNull()
    })
  })

  describe('incrementTaskPomodoro', () => {
    it('increments actualPomodoros', () => {
      useTaskStore.getState().addTask('Focus work')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().incrementTaskPomodoro(id)
      expect(useTaskStore.getState().tasks[0].actualPomodoros).toBe(1)
    })

    it('increments multiple times', () => {
      useTaskStore.getState().addTask('Deep focus')
      const id = useTaskStore.getState().tasks[0].id
      useTaskStore.getState().incrementTaskPomodoro(id)
      useTaskStore.getState().incrementTaskPomodoro(id)
      useTaskStore.getState().incrementTaskPomodoro(id)
      expect(useTaskStore.getState().tasks[0].actualPomodoros).toBe(3)
    })
  })

  describe('clearCompleted', () => {
    it('removes only completed tasks', () => {
      useTaskStore.getState().addTask('Active')
      useTaskStore.getState().addTask('Done')
      const doneId = useTaskStore.getState().tasks[1].id
      useTaskStore.getState().toggleTask(doneId)
      useTaskStore.getState().clearCompleted()
      expect(useTaskStore.getState().tasks).toHaveLength(1)
      expect(useTaskStore.getState().tasks[0].title).toBe('Active')
    })

    it('clears all tasks when all are completed', () => {
      useTaskStore.getState().addTask('Task 1')
      useTaskStore.getState().addTask('Task 2')
      const { tasks } = useTaskStore.getState()
      tasks.forEach((t) => useTaskStore.getState().toggleTask(t.id))
      useTaskStore.getState().clearCompleted()
      expect(useTaskStore.getState().tasks).toHaveLength(0)
    })
  })
})
