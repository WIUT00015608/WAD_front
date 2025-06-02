import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryModule } from '../../core/models/category/category.module';
import { CategoryService } from '../../core/services/category.service';
import { ContactModule } from '../../core/models/contact/contact.module';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrls: ['./category-detail.component.scss']
})
export class CategoryDetailComponent {
  category: CategoryModule | null = null;
  loading = false;
  error: string | null = null;
  categoryId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.categoryId = +params['id'];
      if (this.categoryId) {
        this.loadCategory();
      }
    });
  }

  loadCategory(): void {
    this.loading = true;
    this.error = null;

    this.categoryService.getCategory(this.categoryId).subscribe({
      next: (category) => {
        this.category = category;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  onEditCategory(): void {
    this.router.navigate(['/categories', this.categoryId, 'edit']);
  }

  onDeleteCategory(): void {
    if (this.category && confirm(`Are you sure you want to delete "${this.category.name}"?`)) {
      this.categoryService.deleteCategory(this.categoryId).subscribe({
        next: () => {
          this.router.navigate(['/categories']);
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }

  onAddContact(): void {
    this.router.navigate(['/contacts/new'], { 
      queryParams: { categoryId: this.categoryId } 
    });
  }

  onEditContact(contactId: number): void {
    this.router.navigate(['/contacts', contactId, 'edit']);
  }

  onDeleteContact(contact: ContactModule): void {
    if (confirm(`Are you sure you want to delete "${contact.firstName} ${contact.lastName}"?`)) {
      // You'll need to implement contact deletion in ContactService
      // this.contactService.deleteContact(contact.id!).subscribe({...});
      console.log('Delete contact:', contact);
    }
  }

  onBackToList(): void {
    this.router.navigate(['/categories']);
  }
}
