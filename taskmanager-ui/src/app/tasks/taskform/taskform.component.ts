import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task } from '../../core/models/task.model';

@Component({
  selector: 'app-taskform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="task-form">
      <h2>{{ task ? 'Edit Task' : 'Create New Task' }}</h2>
      <form [formGroup]="taskForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            id="title" 
            type="text" 
            formControlName="title"
            placeholder="Enter task title"
          >
          @if (taskForm.get('title')?.invalid && taskForm.get('title')?.touched) {
            <small class="error">Title is required</small>
          }
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            formControlName="description"
            placeholder="Enter task description"
            rows="3"
          ></textarea>
        </div>

        <div class="form-actions">
          <button type="button" (click)="onCancel()">Cancel</button>
          <button type="submit" [disabled]="taskForm.invalid">
            {{ task ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .task-form {
      padding: 1rem;
      max-width: 500px;
      margin: 0 auto;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    label {
      display: block;
      margin-bottom: 0.5rem;
    }
    input, textarea {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .error {
      color: red;
      font-size: 0.875rem;
    }
    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button[type="submit"] {
      background-color: #007bff;
      color: white;
    }
    button[type="submit"]:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  `]
})
export class TaskFormComponent implements OnInit {
  @Input() task?: Task;
  @Output() save = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isCompleted: [false]
    });
  }

  ngOnInit(): void {
    if (this.task) {
      this.taskForm.patchValue(this.task);
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const task: Task = {
        ...this.task,
        ...formValue,
        id: this.task?.id
      };
      this.save.emit(task);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}