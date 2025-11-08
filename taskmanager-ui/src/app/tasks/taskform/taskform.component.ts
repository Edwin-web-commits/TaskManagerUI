import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { sharedImports } from '../../shared/sharedImports';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    standalone: true,
    selector: 'app-task-form',
    templateUrl: './taskform.component.html',
    styleUrls: ['./taskform.component.scss'],
    imports: [sharedImports]
})
export class TaskFormComponent {
    form: FormGroup;
    mode: 'create' | 'edit';
    task?: Task;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private snack: MatSnackBar,
        private taskService: TaskService,
        private dialogRef: MatDialogRef<TaskFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.mode = data.mode;
        this.task = data.task;
        this.form = this.fb.group({
            title: [this.task?.title ?? '', [Validators.required, Validators.maxLength(70)]],
            description: [this.task?.description ?? '', [Validators.maxLength(250)]],
            isCompleted: [this.task?.isCompleted ?? false]
        });
    }

    save() {
        if (this.form.invalid) return;
        this.saving = true;
        const val = this.form.value;
        if (this.mode === 'create') {
            this.taskService.createTask({ title: val.title, description: val.description, isCompleted: val.isCompleted }).subscribe({
                next: () => { this.saving = false; this.dialogRef.close(true); this.snack.open('Task created successfully!', 'Close', { duration: 3000 }); },
                error: () => {
                    this.saving = false; this.dialogRef.close(false);
                    this.snack.open('Failed to create task. Please try again.', 'Close', {
                        duration: 4000,
                        panelClass: ['error-snack']
                    });
                }
            });
        } else {
            const updated: Task = { ...(this.task as Task), ...val };
            this.taskService.updateTask(updated.id, updated).subscribe({
                next: () => { this.saving = false; this.dialogRef.close(true); this.snack.open('Task updated!', 'Close', { duration: 3000 }); },
                error: () => {
                    this.saving = false; this.dialogRef.close(false);
                    this.snack.open('Failed to update task. Please try again.', 'Close', {
                        duration: 4000,
                        panelClass: ['error-snack']
                    });
                }
            });
        }
    }

    close() { this.dialogRef.close(false); }
}
