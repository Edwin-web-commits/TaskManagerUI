import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { shareReplay, catchError } from 'rxjs/operators';
import { Task } from '../models/task.model';
import { environment } from '../../../environment/environment';
import { CreateTask } from '../models/createTask.model';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTasks(completed: boolean | null = null): Observable<Task[]> {

    let params = new HttpParams();
    if (completed !== null) params = params.set('completed', completed.toString());

    const obs = this.http.get<any>(this.base, { params });
    return obs;
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.base}/${id}`);
  }

  createTask(task: Partial<CreateTask>) {
    return this.http.post<Task>(this.base, task);
  }

  updateTask(id: number, task: CreateTask) {
    return this.http.put<void>(`${this.base}/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
