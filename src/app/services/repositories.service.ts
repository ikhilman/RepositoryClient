import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepoResponse } from 'src/app/models/repoResponse'
import { environment } from 'src/environments/environment'
import { BookmarkAction } from '../models/enums';
import { IkeyValue } from '../models/iKeyValue';

@Injectable({
  providedIn: 'root'
})
export class RepositoriesService {

  constructor(
    private http: HttpClient
  ) { }

  getRepositories(value: string): Observable<RepoResponse> {
    return this.http.get<RepoResponse>(`${environment.repositoriesApi}repositories/repositories/?value=${value}`);
  }

  bookmarkRepository(id: number, token: string, action: BookmarkAction): Observable<void> {
    let headers = new HttpHeaders();
    headers = headers.append('authKey', token);
    return this.http
      .post<void>(`${environment.repositoriesApi}/Bookmark/BoookmarkRepository`,
        { id, action }, { headers });
  }

  getBookmarks(token: string): Observable<number[]> {
    let headers = new HttpHeaders();
    headers = headers.append('authKey', token);
    return this.http
      .get<number[]>(`${environment.repositoriesApi}/Bookmark/GetBookmarks`, { headers });
  }
}