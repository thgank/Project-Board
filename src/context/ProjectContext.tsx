import React, { createContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ProjectState, ProjectAction } from '../types';
import { projectReducer, initialState } from './projectReducer';

// LocalStorage key
const STORAGE_KEY = 'project-board-state';

// Context type
interface ProjectContextType {
  state: ProjectState;
  dispatch: React.Dispatch<ProjectAction>;
}

// Create context with default values
export const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider props
interface ProjectProviderProps {
  children: ReactNode;
}

// Load state from LocalStorage
function loadStateFromStorage(): ProjectState {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load state from LocalStorage:', error);
  }
  return initialState;
}

// Save state to LocalStorage
function saveStateToStorage(state: ProjectState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state to LocalStorage:', error);
  }
}

// Provider component
export function ProjectProvider({ children }: ProjectProviderProps) {
  // Initialize state from LocalStorage
  const [state, dispatch] = useReducer(projectReducer, initialState, loadStateFromStorage);

  // Save state to LocalStorage whenever it changes
  useEffect(() => {
    saveStateToStorage(state);
  }, [state]);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}
