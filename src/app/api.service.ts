import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://data.nasa.gov/resource/b67r-rgxc.json'; // Ensure this is the correct endpoint.
  private jsonUrl = 'assets/data.json'; 

  constructor(private http: HttpClient) { }

  getNearEarthComets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl); // Adjust this based on the actual endpoint for comets.
  }
  getPlanets(): Observable<any> {
    return this.http.get(this.jsonUrl);
  }

}
