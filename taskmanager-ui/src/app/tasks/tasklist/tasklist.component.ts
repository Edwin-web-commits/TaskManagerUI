import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { Task } from '../../core/models/task.model';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormComponent } from '../taskform/taskform.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PageEvent } from '@angular/material/paginator';
import { sharedImports } from '../../shared/sharedImports';

@Component({
  standalone: true,
  selector: 'app-task-list',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.scss'],
  imports: [sharedImports]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  loading = false;
  filter: 'all' | 'pending' | 'completed' = 'all';
  page = 1;
  pageSize = 5;
  total = 0;

  constructor(private taskService: TaskService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    const completed = this.filter === 'all' ? null : (this.filter === 'completed');
    this.taskService.getTasks(completed).subscribe({
      next: (res) => {
        this.tasks = res;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        console.error(err)
    }
    });
  }

  changeFilter(f: 'all'|'pending'|'completed') {
    debugger
    this.filter = f;
    this.page = 1;
    this.load();
  }

  openNew() {
    const ref = this.dialog.open(TaskFormComponent, { width: '520px', data: { mode: 'create' } });
    ref.afterClosed().subscribe(v => { if (v) this.load(); });
  }

  openEdit(task: Task) {
    const ref = this.dialog.open(TaskFormComponent, { width: '520px', data: { mode: 'edit', task } });
    ref.afterClosed().subscribe(v => { if (v) this.load(); });
  }

  toggleComplete(task: Task) {
    debugger
    const updated = { ...task, isCompleted: !task.isCompleted };
    this.taskService.updateTask(task.id, updated).subscribe(() => this.load());
  }

  confirmDelete(task: Task) {
    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data: { title: 'Delete task', message: 'Are you sure you want to delete this task?' } });
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id!).subscribe(() => this.load());
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.load();
  }
}
