import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/allusers`);
  }

  addUser(user:any): Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/create-user`,user);
  }

  updateUser(id:any,user:any): Observable<any[]> {
    return this.http.put<any[]>(`${environment.apiUrl}/update-user/${id}`,user);
  }

  deleteUser(id:any): Observable<any[]> {
    return this.http.delete<any[]>(`${environment.apiUrl}/delete-user/${id}`);
  }

  checkEmailExists(email:any):Observable<any[]> {
    return this.http.post<any[]>(`${environment.apiUrl}/checkemailexists`,email);
  }
}
