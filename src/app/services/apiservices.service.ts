import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiservicesService {
  public baseUrl: any = environment.api_url;

  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      authorization: '',
      "Access-Control-Allow-Origin": "*"
    }),
  };

  public getHttpData(url: any): Observable<any> {
    return this.http.get<any>(this.baseUrl + url, this.httpOptions).pipe(
      catchError((error) => {
        // this.openSnackBar();
        console.log('error --->', error);
        return throwError(() => error.error);
      })
    );;
  }

  public getHttpDataPost(url: any, body: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + url, JSON.stringify(body), this.httpOptions).pipe(
      catchError((error) => {
        // this.openSnackBar();
            console.log("this is login error",error);
            
        return throwError(()=>error.error);
      })
    )
  }

  public getHttpDataWithoutBaseUrl(url: any): Observable<any> {
    return this.http.get<any>(url).pipe(
      catchError((error) => {
        // this.openSnackBar();
        console.log('error --->', error);
        return throwError(() => new Error(error));
      })
    );;
  }

}
