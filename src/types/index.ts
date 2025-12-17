// Types for the Project Board application

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
}

export interface ProjectState {
  projects: Project[];
}

// Action types
export type ProjectAction =
  | { type: 'ADD_PROJECT'; payload: { name: string } }
  | { type: 'DELETE_PROJECT'; payload: { projectId: string } }
  | { type: 'ADD_TASK'; payload: { projectId: string; title: string; description: string } }
  | { type: 'DELETE_TASK'; payload: { projectId: string; taskId: string } }
  | { type: 'MOVE_TASK'; payload: { fromProjectId: string; toProjectId: string; taskId: string } }
  | { type: 'LOAD_STATE'; payload: ProjectState };
