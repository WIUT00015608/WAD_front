import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { CategoryModule } from '../models/category/category.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private endpoint = 'Category';

  constructor(private apiService: ApiService) { }

  getCategories(): Observable<CategoryModule[]> {
    return this.apiService.get<CategoryModule[]>(this.endpoint);
  }

  getCategory(id: number): Observable<CategoryModule> {
    return this.apiService.get<CategoryModule>(`${this.endpoint}/${id}`);
  }

  createCategory(category: CategoryModule): Observable<CategoryModule> {
    return this.apiService.post<CategoryModule>(this.endpoint, category);
  }

  updateCategory(id: number, category: CategoryModule): Observable<CategoryModule> {
    return this.apiService.put<CategoryModule>(`${this.endpoint}/${id}`, category);
  }

  deleteCategory(id: number): Observable<any> {
    return this.apiService.delete(`${this.endpoint}/${id}`);
  }
}
