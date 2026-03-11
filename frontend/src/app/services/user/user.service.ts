import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;          // Opcional si es autoincremental
  name: string;
  lastName: string;
  document: number;
  userName: string;
  email: string;
  password: string;
  role: string;
  status: boolean;
  phone?: number;
  createdAt?: string
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Ajustado al puerto 8080 que vimos en tu consola
  private apiUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) { }
// El método dice: " devolver una lista de usuarios cuando el backend responda"
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}