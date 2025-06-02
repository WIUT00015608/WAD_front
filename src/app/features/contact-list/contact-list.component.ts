import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ContactModule } from '../../core/models/contact/contact.module';
import { ContactService } from '../../core/services/contact.service';
import { CategoryService } from '../../core/services/category.service';
import { CategoryModule } from '../../core/models/category/category.module';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss']
})
export class ContactListComponent {
  contacts: ContactModule[] = [];
  categories: CategoryModule[] = [];
  filteredContacts: ContactModule[] = [];
  loading = false;
  error: string | null = null;
  
  // Search and filter properties
  searchTerm = '';
  selectedCategoryId: number | null = null;
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  constructor(
    private contactService: ContactService,
    private categoryService: CategoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadContacts();
    this.loadCategories();
  }

  loadContacts(): void {
    this.loading = true;
    this.error = null;
    
    this.contactService.getContacts().subscribe({
      next: (contacts) => {
        this.contacts = contacts;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.contacts];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const search = this.searchTerm.toLowerCase();
      filtered = filtered.filter(contact => 
        contact.firstName.toLowerCase().includes(search) ||
        contact.lastName.toLowerCase().includes(search) ||
        contact.email.toLowerCase().includes(search) ||
        contact.phone.includes(search) ||
        contact.address.toLowerCase().includes(search)
      );
    }

    // Apply category filter
    if (this.selectedCategoryId) {
      filtered = filtered.filter(contact => contact.categoryId === this.selectedCategoryId);
    }

    this.filteredContacts = filtered;
    this.totalPages = Math.ceil(this.filteredContacts.length / this.itemsPerPage);
    this.currentPage = 1; // Reset to first page when filters change
  }

  onSearch(): void {
    this.applyFilters();
  }

  onCategoryFilter(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = null;
    this.applyFilters();
  }

  getPaginatedContacts(): ContactModule[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredContacts.slice(startIndex, endIndex);
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  onViewContact(contactId: number): void {
    this.router.navigate(['/contacts', contactId]);
  }

  onEditContact(contactId: number): void {
    this.router.navigate(['/contacts', contactId, 'edit']);
  }

  onDeleteContact(contact: ContactModule): void {
    if (confirm(`Are you sure you want to delete "${contact.firstName} ${contact.lastName}"?`)) {
      this.contactService.deleteContact(contact.id!).subscribe({
        next: () => {
          this.loadContacts(); // Refresh the list
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }

  onCreateContact(): void {
    this.router.navigate(['/contacts/new']);
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  }

  getPageNumbers(): number[] {
    const pages = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }
}
