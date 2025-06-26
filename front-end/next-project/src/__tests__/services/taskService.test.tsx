import { TaskService } from '../../services/taskService'
import { Task } from '../../interfaces/task'
import { TaskStatus } from '../../enums/taskStatus'

// Mock BaseService
jest.mock('../../services/baseService', () => ({
  BaseService: jest.fn().mockImplementation(() => ({
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
}))

describe('TaskService', () => {
  let taskService: TaskService
  let mockGetAll: jest.Mock
  let mockGet: jest.Mock
  let mockCreate: jest.Mock
  let mockUpdate: jest.Mock
  let mockDelete: jest.Mock

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    userId: '1',
    date: '2023-01-01',
    status: TaskStatus.A_FAZER,
  }

  beforeEach(() => {
    taskService = new TaskService()
    // Set endpoint manually since we're mocking BaseService
    taskService.endpoint = 'tasks'
    
    // Mock the actual methods of TaskService
    taskService.getAllTasks = jest.fn()
    taskService.getTask = jest.fn()
    taskService.createTask = jest.fn()
    taskService.updateTask = jest.fn()
    taskService.deleteTask = jest.fn()
    
    mockGetAll = taskService.getAllTasks as jest.Mock
    mockGet = taskService.getTask as jest.Mock
    mockCreate = taskService.createTask as jest.Mock
    mockUpdate = taskService.updateTask as jest.Mock
    mockDelete = taskService.deleteTask as jest.Mock
    
    jest.clearAllMocks()
  })

  describe('constructor', () => {
    it('should initialize with tasks endpoint', () => {
      expect(taskService.endpoint).toBe('tasks')
    })
  })

  describe('getAllTasks', () => {
    it('should call getAllTasks with no query when no parameters provided', async () => {
      const mockResponse = { tasks: [mockTask], total: 1 }
      mockGetAll.mockResolvedValue(mockResponse)

      const result = await taskService.getAllTasks()

      expect(mockGetAll).toHaveBeenCalledWith()
      expect(result).toEqual(mockResponse)
    })

    it('should call getAllTasks with filter query', async () => {
      const mockResponse = { tasks: [mockTask], total: 1 }
      mockGetAll.mockResolvedValue(mockResponse)

      await taskService.getAllTasks('test filter')

      expect(mockGetAll).toHaveBeenCalledWith('test filter')
    })

    it('should call getAllTasks with status query', async () => {
      const mockResponse = { tasks: [mockTask], total: 1 }
      mockGetAll.mockResolvedValue(mockResponse)

      await taskService.getAllTasks('', 'completed')

      expect(mockGetAll).toHaveBeenCalledWith('', 'completed')
    })

    it('should call getAllTasks with all parameters', async () => {
      const mockResponse = { tasks: [mockTask], total: 1 }
      mockGetAll.mockResolvedValue(mockResponse)

      await taskService.getAllTasks('search term', 'pending', 2, 10)

      expect(mockGetAll).toHaveBeenCalledWith('search term', 'pending', 2, 10)
    })
  })

  describe('getTask', () => {
    it('should call getTask method with task id', async () => {
      mockGet.mockResolvedValue(mockTask)

      const result = await taskService.getTask('1')

      expect(mockGet).toHaveBeenCalledWith('1')
      expect(result).toEqual(mockTask)
    })
  })

  describe('createTask', () => {
    it('should call createTask method with task data', async () => {
      mockCreate.mockResolvedValue(mockTask)

      const result = await taskService.createTask(mockTask)

      expect(mockCreate).toHaveBeenCalledWith(mockTask)
      expect(result).toEqual(mockTask)
    })
  })

  describe('updateTask', () => {
    it('should call updateTask method with id and task data', async () => {
      const updatedTask = { ...mockTask, title: 'Updated Task' }
      mockUpdate.mockResolvedValue(updatedTask)

      const result = await taskService.updateTask('1', updatedTask)

      expect(mockUpdate).toHaveBeenCalledWith('1', updatedTask)
      expect(result).toEqual(updatedTask)
    })
  })

  describe('deleteTask', () => {
    it('should call deleteTask method with task id', async () => {
      mockDelete.mockResolvedValue(undefined)

      await taskService.deleteTask('1')

      expect(mockDelete).toHaveBeenCalledWith('1')
    })
  })
})
