import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { sharedImports } from '../../shared/sharedImports';

@Component({
  standalone: true,
  selector: 'app-task-form',
  templateUrl: './taskform.component.html',
  styleUrls: ['./taskform.component.scss'],
  imports: [sharedImports]
})
export class TaskFormComponent {
  form: FormGroup;
  mode: 'create'|'edit';
  task?: Task;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mode = data.mode;
    this.task = data.task;
    this.form = this.fb.group({
      title: [this.task?.title ?? '', [Validators.required, Validators.maxLength(250)]],
      description: [this.task?.description ?? ''],
      isCompleted: [this.task?.isCompleted ?? false]
    });
  }

  save() {
    if (this.form.invalid) return;
    this.saving = true;
    const val = this.form.value;
    if (this.mode === 'create') {
      this.taskService.createTask({ title: val.title, description: val.description, isCompleted: val.isCompleted }).subscribe({
        next: () => { this.saving = false; this.dialogRef.close(true); },
        error: () => { this.saving = false; this.dialogRef.close(false); }
      });
    } else {
      const updated: Task = { ...(this.task as Task), ...val };
      this.taskService.updateTask(updated.id,updated).subscribe({
        next: () => { this.saving = false; this.dialogRef.close(true); },
        error: () => { this.saving = false; this.dialogRef.close(false); }
      });
    }
  }

  close() { this.dialogRef.close(false); }
}
