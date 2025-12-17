import { useState } from 'react';
import { Card, Button, Modal, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task as TaskType } from '../types';
import './Task.css';

interface TaskProps {
  task: TaskType;
  onDelete: () => void;
}

/**
 * Presentational component for displaying a single task
 * Contains no business logic, only renders UI
 * Now supports drag and drop functionality - click to open, drag to move
 */
export function Task({ task, onDelete }: TaskProps) {
  const [clickStartTime, setClickStartTime] = useState(0);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const showDetails = () => {
    const clickDuration = Date.now() - clickStartTime;
    // If click was quick (less than 200ms), show details
    if (clickDuration < 200) {
      Modal.info({
        title: task.title,
        content: (
          <div>
            <p>{task.description}</p>
            <p style={{ color: '#888', fontSize: '12px', marginTop: '16px' }}>
              Created: {new Date(task.createdAt).toLocaleString()}
            </p>
          </div>
        ),
      });
    }
  };

  const handleMouseDown = () => {
    setClickStartTime(Date.now());
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseDown={handleMouseDown}
      onClick={showDetails}
    >
      <Card
        className="task-card"
        size="small"
        hoverable
        extra={
          <Popconfirm
            title="Удалить задачу?"
            description="Вы уверены, что хотите удалить эту задачу?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete();
            }}
            onCancel={(e) => e?.stopPropagation()}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        }
      >
        <h4 className="task-title">{task.title}</h4>
        <p className="task-description">{task.description}</p>
      </Card>
    </div>
  );
}
