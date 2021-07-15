import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const BASE_URL= environment.url;
@Injectable({
  providedIn: 'root'
})
export class UserService {


  private typeModalSource:any;
  public typeModalObserve:Observable<Boolean>;

  constructor( private httpClient:HttpClient) {

      this.typeModalSource = new BehaviorSubject({});
      this.typeModalObserve = this.typeModalSource.asObservable();

  }

    public triggerAfterTypeAdd():void {
      this.typeModalSource.next(true);
    }

  addUser(userData:any):Observable<any>{

    return this.httpClient.post(`${BASE_URL}/api/user`,userData);

  }

  editUser(data:any):Observable<any>{
    return this.httpClient.put(`${BASE_URL}/api/user`,data);

  }

  deleteUser(id:number):Observable<any>{
    return this.httpClient.delete(`${BASE_URL}/api/user/${id}`)
  }
  getUserList():Observable<any>{
    return this.httpClient.get(`${BASE_URL}/api/user`);

  }
}
