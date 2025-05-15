import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonalService {

  http = inject(HttpClient)

  getAll() {
    return this.http.get<any[]>(`${environment.apiUrl}/personal`)
  }
}
