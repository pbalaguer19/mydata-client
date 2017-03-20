import { Injectable } from '@angular/core';
import { User } from '../login-basic/user';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

  constructor (private http: Http) {}


  getUser(uri: any) : Observable<Response> {
    return this.http.get(uri.href);
  }


  login(username: string, password: string): Observable<User> {
    const authorization = this.generateAuthorization(username, password);
    const headers = new Headers({ 'Authorization': authorization });
    const options = new RequestOptions({ headers: headers });

    return this.http.get(`${environment.API}/login`, options)
      .map((res: Response) => {
        const user: User = new User(res.json());
        user.authorization = authorization;
        user.password = password;
        return user;
      })
      .catch((error: any) => Observable.throw(error.json()));
  }

  generateAuthorization(username: string, password: string): string {
    return `Basic ${btoa(`${username}:${password}`)}`;
  }

  storeCurrentUser(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('currentUser') !== null;
  }

  getCurrentUser(): User {
    return new User(JSON.parse(localStorage.getItem('currentUser')));
  }
}

