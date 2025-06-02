import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CategoryModule } from '../../core/models/category/category.module';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent {
  categories: CategoryModule[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = null;
    
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onViewCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId]);
  }

  onEditCategory(categoryId: number): void {
    this.router.navigate(['/categories', categoryId, 'edit']);
  }

  onDeleteCategory(category: CategoryModule): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id!).subscribe({
        next: () => {
          this.loadCategories(); // Refresh the list
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }

  onCreateCategory(): void {
    this.router.navigate(['/categories/new']);
  }
}
