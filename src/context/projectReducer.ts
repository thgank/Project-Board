import type { ProjectState, ProjectAction } from '../types';

// Initial state with sample data
export const initialState: ProjectState = {
  projects: [
    {
      id: 'p1',
      name: 'To Do',
      tasks: [
        {
          id: 't1',
          title: 'Задизайнить то, задизайнить это',
          description: 'Напилить вайрфейрмов для лэндинга',
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: 'p2',
      name: 'In Progress',
      tasks: [
        {
          id: 't2',
          title: 'Реализовать аутентификацию',
          description: 'Добавить вход и регистрацию пользователей',
          createdAt: Date.now(),
        },
      ],
    },
    {
      id: 'p3',
      name: 'Done',
      tasks: [],
    },
  ],
};

// Reducer function with immutable state updates
export function projectReducer(state: ProjectState, action: ProjectAction): ProjectState {
  switch (action.type) {
    case 'ADD_PROJECT': {
      const newProject = {
        id: `p${Date.now()}`,
        name: action.payload.name,
        tasks: [],
      };
      return {
        ...state,
        projects: [...state.projects, newProject],
      };
    }

    case 'DELETE_PROJECT': {
      return {
        ...state,
        projects: state.projects.filter((project) => project.id !== action.payload.projectId),
      };
    }

    case 'ADD_TASK': {
      const newTask = {
        id: `t${Date.now()}`,
        title: action.payload.title,
        description: action.payload.description,
        createdAt: Date.now(),
      };

      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.projectId
            ? { ...project, tasks: [...project.tasks, newTask] }
            : project
        ),
      };
    }

    case 'DELETE_TASK': {
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === action.payload.projectId
            ? {
                ...project,
                tasks: project.tasks.filter((task) => task.id !== action.payload.taskId),
              }
            : project
        ),
      };
    }

    case 'MOVE_TASK': {
      const { fromProjectId, toProjectId, taskId } = action.payload;
      
      // Find the task to move
      const sourceProject = state.projects.find((p) => p.id === fromProjectId);
      const taskToMove = sourceProject?.tasks.find((t) => t.id === taskId);

      if (!taskToMove) {
        return state;
      }

      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === fromProjectId) {
            // Remove task from source project
            return {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            };
          } else if (project.id === toProjectId) {
            // Add task to destination project
            return {
              ...project,
              tasks: [...project.tasks, taskToMove],
            };
          }
          return project;
        }),
      };
    }

    case 'LOAD_STATE': {
      return action.payload;
    }

    default:
      return state;
  }
}
