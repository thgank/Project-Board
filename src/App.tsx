import { Layout, Typography } from 'antd';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { useProjectManager } from './hooks/useProjectManager';
import { Column } from './components/Column';
import type { Task as TaskType } from './types';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

/**
 * Main application component
 * Uses custom hook for business logic and renders presentational components
 * Manages drag and drop functionality for tasks
 */
function App() {
  const { projects, addTask, deleteTask, moveTask } = useProjectManager();
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Find the task being dragged
    for (const project of projects) {
      const task = project.tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveTask(task);
        break;
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveTask(null);

    if (!over) {
      // If dropped outside of a droppable area, do nothing (keep task in place)
      return;
    }

    const taskId = active.id as string;
    const targetProjectId = over.id as string;

    // Find source project
    const sourceProject = projects.find((p) =>
      p.tasks.some((t) => t.id === taskId)
    );

    if (sourceProject && sourceProject.id !== targetProjectId) {
      moveTask(sourceProject.id, targetProjectId, taskId);
    }
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Project Board
        </Title>
      </Header>
      <Content className="app-content">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="board-container">
            {projects.map((project) => (
              <Column
                key={project.id}
                project={project}
                onAddTask={(title, description) => addTask(project.id, title, description)}
                onDeleteTask={(taskId) => deleteTask(project.id, taskId)}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="drag-overlay">
                <h4>{activeTask.title}</h4>
                <p>{activeTask.description}</p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </Content>
    </Layout>
  );
}

export default App;
