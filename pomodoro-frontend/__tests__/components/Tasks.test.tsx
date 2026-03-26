import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskList } from '@/components/Tasks/TaskList'
import { AddTask } from '@/components/Tasks/AddTask'
import { TaskItem } from '@/components/Tasks/TaskItem'
import { useTaskStore } from '@/store/taskStore'
import { useProjectStore } from '@/store/projectStore'
import { Task, Project } from '@/types'

const DEFAULT_PROJECT: Project = {
  id: 'default-project-id',
  name: 'Default',
  color: '#3B82F6',
  isDefault: true,
  createdAt: Date.now(),
}

beforeEach(() => {
  useTaskStore.setState({ tasks: [], selectedTaskId: null })
  // Projects available but no active filter by default
  useProjectStore.setState({
    projects: [DEFAULT_PROJECT],
    selectedProjectId: null,
  })
})

// Helper to create a mock task
const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'test-id',
  title: 'Test Task',
  completed: false,
  estimatedPomodoros: 2,
  actualPomodoros: 0,
  createdAt: Date.now(),
  projectId: null,
  ...overrides,
})

describe('TaskList', () => {
  it('shows empty state message when no tasks', () => {
    render(<TaskList />)
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
  })

  it('shows Add Task button', () => {
    render(<TaskList />)
    expect(screen.getByTestId('add-task-button')).toBeInTheDocument()
  })

  it('renders active tasks from store', () => {
    useTaskStore.getState().addTask('Write unit tests')
    render(<TaskList />)
    expect(screen.getByText('Write unit tests')).toBeInTheDocument()
  })

  it('shows remaining count for active tasks', () => {
    useTaskStore.getState().addTask('Task A')
    useTaskStore.getState().addTask('Task B')
    render(<TaskList />)
    expect(screen.getByText('2 remaining')).toBeInTheDocument()
  })

  it('does not show active tasks in completed section', () => {
    useTaskStore.getState().addTask('Active task')
    render(<TaskList />)
    // Should not have a completed section visible
    expect(screen.queryByText(/completed \(/i)).not.toBeInTheDocument()
  })

  it('shows completed section when tasks are done', async () => {
    useTaskStore.getState().addTask('Done task')
    const id = useTaskStore.getState().tasks[0].id
    useTaskStore.getState().toggleTask(id)
    render(<TaskList />)
    expect(screen.getByText(/completed \(1\)/i)).toBeInTheDocument()
  })
})

describe('AddTask', () => {
  beforeEach(() => {
    // When a project filter is active, the submit button is enabled without manual project selection
    useProjectStore.setState({
      projects: [DEFAULT_PROJECT],
      selectedProjectId: DEFAULT_PROJECT.id,
    })
  })

  it('renders the add task button initially', () => {
    render(<AddTask />)
    expect(screen.getByTestId('add-task-button')).toBeInTheDocument()
  })

  it('shows the form when add task button is clicked', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    expect(screen.getByTestId('add-task-form')).toBeInTheDocument()
  })

  it('hides the button and shows form after clicking', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    expect(screen.queryByTestId('add-task-button')).not.toBeInTheDocument()
    expect(screen.getByTestId('add-task-form')).toBeInTheDocument()
  })

  it('adds a task when form is submitted', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    await user.type(screen.getByTestId('task-title-input'), 'My new task')
    await user.click(screen.getByTestId('submit-task-button'))
    expect(useTaskStore.getState().tasks).toHaveLength(1)
    expect(useTaskStore.getState().tasks[0].title).toBe('My new task')
  })

  it('does not add empty task', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    // Submit button should be disabled (no title)
    expect(screen.getByTestId('submit-task-button')).toBeDisabled()
  })

  it('cancels the form without adding a task', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    await user.type(screen.getByTestId('task-title-input'), 'Cancelled task')
    await user.click(screen.getByText('Cancel'))
    expect(useTaskStore.getState().tasks).toHaveLength(0)
    expect(screen.getByTestId('add-task-button')).toBeInTheDocument()
  })

  it('resets form after successful submission', async () => {
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    await user.type(screen.getByTestId('task-title-input'), 'Done task')
    await user.click(screen.getByTestId('submit-task-button'))
    // Form should be gone, button should be back
    await waitFor(() => {
      expect(screen.getByTestId('add-task-button')).toBeInTheDocument()
    })
  })

  it('disables submit when no project selected and no filter active', async () => {
    // Override to have no active filter
    useProjectStore.setState({
      projects: [DEFAULT_PROJECT],
      selectedProjectId: null,
    })
    const user = userEvent.setup()
    render(<AddTask />)
    await user.click(screen.getByTestId('add-task-button'))
    await user.type(screen.getByTestId('task-title-input'), 'Some task')
    // Submit should still be disabled — no project selected
    expect(screen.getByTestId('submit-task-button')).toBeDisabled()
  })
})

describe('TaskItem', () => {
  it('renders task title', () => {
    const task = makeTask({ title: 'My test task' })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.getByText('My test task')).toBeInTheDocument()
  })

  it('shows pomodoro count', () => {
    const task = makeTask({ actualPomodoros: 2, estimatedPomodoros: 4 })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.getByText('2/4')).toBeInTheDocument()
  })

  it('shows strikethrough for completed task', () => {
    const task = makeTask({ completed: true })
    render(<TaskItem task={task} isSelected={false} />)
    const titleEl = screen.getByText('Test Task')
    expect(titleEl).toHaveClass('line-through')
  })

  it('shows selected styling when selected', () => {
    const task = makeTask()
    const { container } = render(<TaskItem task={task} isSelected={true} />)
    const wrapper = container.firstChild
    expect(wrapper).toHaveClass('bg-white/20')
  })

  it('shows toggle button with correct aria-label (incomplete)', () => {
    const task = makeTask({ id: 'abc', completed: false })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.getByTestId('task-toggle-abc')).toHaveAttribute('aria-label', 'Mark complete')
  })

  it('shows toggle button with correct aria-label (complete)', () => {
    const task = makeTask({ id: 'abc', completed: true })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.getByTestId('task-toggle-abc')).toHaveAttribute('aria-label', 'Mark incomplete')
  })

  it('calls toggleTask when checkbox is clicked', async () => {
    const task = makeTask({ id: 'xyz' })
    useTaskStore.setState({ tasks: [task], selectedTaskId: null })
    const user = userEvent.setup()
    render(<TaskItem task={task} isSelected={false} />)
    await user.click(screen.getByTestId('task-toggle-xyz'))
    expect(useTaskStore.getState().tasks[0].completed).toBe(true)
  })

  it('calls deleteTask when delete button is clicked', async () => {
    const task = makeTask({ id: 'del' })
    useTaskStore.setState({ tasks: [task], selectedTaskId: null })
    const user = userEvent.setup()
    render(<TaskItem task={task} isSelected={false} />)
    await user.click(screen.getByTestId('task-delete-del'))
    expect(useTaskStore.getState().tasks).toHaveLength(0)
  })

  it('calls selectTask when item is clicked', async () => {
    const task = makeTask({ id: 'sel' })
    useTaskStore.setState({ tasks: [task], selectedTaskId: null })
    const user = userEvent.setup()
    render(<TaskItem task={task} isSelected={false} />)
    await user.click(screen.getByTestId('task-item-sel'))
    expect(useTaskStore.getState().selectedTaskId).toBe('sel')
  })

  it('deselects task when clicking already selected task', async () => {
    const task = makeTask({ id: 'sel' })
    useTaskStore.setState({ tasks: [task], selectedTaskId: 'sel' })
    const user = userEvent.setup()
    render(<TaskItem task={task} isSelected={true} />)
    await user.click(screen.getByTestId('task-item-sel'))
    expect(useTaskStore.getState().selectedTaskId).toBeNull()
  })

  it('shows project badge when task has a project', () => {
    const task = makeTask({ id: 'proj-task', projectId: DEFAULT_PROJECT.id })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.getByLabelText('Project: Default')).toBeInTheDocument()
    expect(screen.getByText('Default')).toBeInTheDocument()
  })

  it('does not show project badge when task has no project', () => {
    const task = makeTask({ id: 'no-proj-task', projectId: null })
    render(<TaskItem task={task} isSelected={false} />)
    expect(screen.queryByLabelText(/Project:/)).not.toBeInTheDocument()
  })
})
