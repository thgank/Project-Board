import { useState } from 'react';
import { Card, Button, Input, Form, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Project as ProjectType } from '../types';
import { Task } from './Task';
import './Column.css';

interface ColumnProps {
  project: ProjectType;
  onAddTask: (title: string, description: string) => void;
  onDeleteTask: (taskId: string) => void;
}

/**
 * Presentational component for displaying a column with tasks
 * Contains minimal state for UI interactions only
 * Now supports drop zone for draggable tasks
 */
export function Column({ project, onAddTask, onDeleteTask }: ColumnProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [form] = Form.useForm();

  const { setNodeRef, isOver } = useDroppable({
    id: project.id,
  });

  const taskIds = project.tasks.map((task) => task.id);

  const handleAddTask = (values: { title: string; description: string }) => {
    onAddTask(values.title, values.description);
    form.resetFields();
    setIsAdding(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setIsAdding(false);
  };

  return (
    <div className="column">
      <Card
        title={
          <div className="column-header">
            <span className="column-title">{project.name}</span>
            <span className="task-count">{project.tasks.length}</span>
          </div>
        }
        className="column-card"
        extra={
          !isAdding && (
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setIsAdding(true)}
            >
              Добавить задачу
            </Button>
          )
        }
      >
        <div
          ref={setNodeRef}
          className={`column-content ${isOver ? 'column-content-over' : ''}`}
        >
          {isAdding && (
            <Card className="add-task-form" size="small">
              <Form form={form} onFinish={handleAddTask} layout="vertical">
                <Form.Item
                  name="title"
                  rules={[{ required: true, message: 'Пожалуйста введите заголовок задачи' }]}
                >
                  <Input placeholder="Заголовок задачи" autoFocus />
                </Form.Item>
                <Form.Item
                  name="description"
                  rules={[{ required: true, message: 'Пожалуйста введите описание задачи' }]}
                >
                  <Input.TextArea placeholder="Описание задачи" rows={3} />
                </Form.Item>
                <Form.Item style={{ marginBottom: 0 }}>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Добавить
                    </Button>
                    <Button onClick={handleCancel}>Отмена</Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}

          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {project.tasks.map((task) => (
              <Task
                key={task.id}
                task={task}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
          </SortableContext>

          {project.tasks.length === 0 && !isAdding && (
            <div className="empty-column">
              <p>Пока нет задач</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
