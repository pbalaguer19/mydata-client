import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { AuthenticationBasicService } from '../login-basic/authentication-basic.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Schema } from './schema';
import { environment } from '../../environments/environment';

@Injectable()
export class SchemaService {

  constructor(private http: Http,
              private authentication: AuthenticationBasicService) {}

  // GET /schemas
  getAllSchemas(): Observable<Schema[]> {
    return this.http.get(`${environment.API}/schemas`)
      .map((res: Response) => res.json()._embedded.schemas.map(json => new Schema(json)))
      .catch((error: any) => Observable.throw(error.json()));
  }

  // GET /schemas/id
  getSchema(uri: string): Observable<Schema> {
    return this.http.get(`${environment.API}${uri}`)
      .map((res: Response) => new Schema(res.json()))
      .catch((error: any) => Observable.throw(error.json()));
  }

  // POST /schemas
  addSchema(schema: Schema): Observable<Schema> {
    const body = JSON.stringify(schema);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.authentication.getCurrentUser().authorization);
    const options = new RequestOptions({ headers: headers });

    return this.http.post(`${environment.API}/schemas`, body, options)
      .map((res: Response) => new Schema(res.json()))
      .catch((error: any) => Observable.throw(error.json()));
  }

  // GET /datasets/ + search/findByDescriptionContaining?description
  getSchemaByDescriptionWords(keyword: string): Observable<Schema[]> {
    return this.http.get(environment.API + '/schemas/search/findByDescription?description=' + keyword)
      .map((res: Response) => res.json()._embedded.datasets.map(json => new Schema(json)))
      .catch((error: any) => Observable.throw(error.json()));
  }
}
