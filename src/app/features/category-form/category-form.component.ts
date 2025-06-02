import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryModule } from '../../core/models/category/category.module';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  isEditMode = false;
  categoryId: number = 0;
  loading = false;
  saving = false;
  error: string | null = null;
  category: CategoryModule | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.categoryId = +params['id'];
        this.loadCategory();
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(500)]]
    });
  }

  loadCategory(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.categoryForm.patchValue({
          name: category.name,
          description: category.description
        });
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.categoryForm.valid) {
      this.saving = true;
      this.error = null;

      const categoryData: CategoryModule = {
        ...this.categoryForm.value
      };

      if (this.isEditMode && this.categoryId) {
        categoryData.id = this.categoryId;
        this.updateCategory(categoryData);
      } else {
        this.createCategory(categoryData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createCategory(category: CategoryModule): void {
    this.categoryService.createCategory(category).subscribe({
      next: (createdCategory) => {
        this.saving = false;
        this.router.navigate(['/categories', createdCategory.id]);
      },
      error: (error) => {
        this.error = error;
        this.saving = false;
      }
    });
  }

  updateCategory(category: CategoryModule): void {
    this.categoryService.updateCategory(this.categoryId, category).subscribe({
      next: (updatedCategory) => {
        this.saving = false;
        this.router.navigate(['/categories', updatedCategory.id]);
      },
      error: (error) => {
        this.error = error;
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.categoryId) {
      this.router.navigate(['/categories', this.categoryId]);
    } else {
      this.router.navigate(['/categories']);
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.categoryForm.controls).forEach(key => {
      const control = this.categoryForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.categoryForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
