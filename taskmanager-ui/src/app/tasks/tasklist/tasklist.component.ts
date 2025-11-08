import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../core/models/task.model';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-tasklist',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="task-list">
      <h2>Tasks</h2>
      <div class="task-items">
        @for (task of tasks; track task.id) {
          <div class="task-item" [class.completed]="task.isCompleted">
            <div class="task-content">
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
              <small>Created: {{ task.createdAt | date }}</small>
            </div>
            <div class="task-actions">
              <button (click)="toggleTaskCompletion(task)">
                {{ task.isCompleted ? 'Mark Incomplete' : 'Mark Complete' }}
              </button>
              <button (click)="editTask(task)">Edit</button>
              <button (click)="deleteTask(task)">Delete</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .task-list {
      padding: 1rem;
    }
    .task-item {
      border: 1px solid #ddd;
      margin-bottom: 1rem;
      padding: 1rem;
      border-radius: 4px;
    }
    .task-item.completed {
      background-color: #f8f9fa;
      opacity: 0.7;
    }
    .task-actions {
      margin-top: 1rem;
      display: flex;
      gap: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  toggleTaskCompletion(task: Task): void {
    if (task.id) {
      this.taskService.toggleTaskCompletion(task.id, task).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error toggling task:', error)
      });
    }
  }

  editTask(task: Task): void {
    // To be implemented with task form component
  }

  deleteTask(task: Task): void {
    if (task.id && confirm('Are you sure you want to delete this task?')) {
      this.taskService.deleteTask(task.id).subscribe({
        next: () => this.loadTasks(),
        error: (error) => console.error('Error deleting task:', error)
      });
    }
  }
}