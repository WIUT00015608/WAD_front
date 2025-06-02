import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ContactModule } from '../models/contact/contact.module';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  private endpoint = 'Contact'; // Adjust based on your API

  constructor(private apiService: ApiService) { }

  getContacts(): Observable<ContactModule[]> {
    return this.apiService.get<ContactModule[]>(this.endpoint);
  }

  getContact(id: number): Observable<ContactModule> {
    return this.apiService.get<ContactModule>(`${this.endpoint}/${id}`);
  }

  getContactsByCategory(categoryId: number): Observable<ContactModule[]> {
    return this.apiService.get<ContactModule[]>(`${this.endpoint}/category/${categoryId}`);
  }

  createContact(contact: ContactModule): Observable<ContactModule> {
    return this.apiService.post<ContactModule>(this.endpoint, contact);
  }

  updateContact(id: number, contact: ContactModule): Observable<ContactModule> {
    return this.apiService.put<ContactModule>(`${this.endpoint}/${id}`, contact);
  }

  deleteContact(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
