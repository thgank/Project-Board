import { useContext } from 'react';
import { ProjectContext } from '../context/ProjectContext';

/**
 * Custom hook to manage project and task operations
 * Encapsulates all business logic and keeps components clean
 */
export function useProjectManager() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error('useProjectManager must be used within a ProjectProvider');
  }

  const { state, dispatch } = context;

  // Business logic methods
  const addProject = (name: string) => {
    if (!name.trim()) {
      throw new Error('Project name cannot be empty');
    }
    dispatch({ type: 'ADD_PROJECT', payload: { name } });
  };

  const deleteProject = (projectId: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: { projectId } });
  };

  const addTask = (projectId: string, title: string, description: string) => {
    if (!title.trim()) {
      throw new Error('Task title cannot be empty');
    }
    dispatch({
      type: 'ADD_TASK',
      payload: { projectId, title, description },
    });
  };

  const deleteTask = (projectId: string, taskId: string) => {
    dispatch({
      type: 'DELETE_TASK',
      payload: { projectId, taskId },
    });
  };

  const moveTask = (fromProjectId: string, toProjectId: string, taskId: string) => {
    if (fromProjectId === toProjectId) {
      return; // No need to move
    }
    dispatch({
      type: 'MOVE_TASK',
      payload: { fromProjectId, toProjectId, taskId },
    });
  };

  return {
    // State
    projects: state.projects,
    
    // Methods
    addProject,
    deleteProject,
    addTask,
    deleteTask,
    moveTask,
  };
}
