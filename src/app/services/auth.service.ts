import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient
  ) { }

  authUser(userName: string, password: string): Observable<string> {
    return this.http
      .get<string>(`${environment.repositoriesApi}auth/auth/?userName=${userName}&password=${password}`);
  }
}
