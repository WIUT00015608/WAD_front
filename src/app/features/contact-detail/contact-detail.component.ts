import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContactModule } from '../../core/models/contact/contact.module';
import { CategoryModule } from '../../core/models/category/category.module';
import { ContactService } from '../../core/services/contact.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-contact-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent {
  contact: ContactModule | null = null;
  category: CategoryModule | null = null;
  loading = false;
  error: string | null = null;
  contactId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contactId = +params['id'];
      if (this.contactId) {
        this.loadContact();
      }
    });
  }

  loadContact(): void {
    this.loading = true;
    this.error = null;

    this.contactService.getContact(this.contactId).subscribe({
      next: (contact) => {
        this.contact = contact;
        this.loadCategory(contact.categoryId);
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
      }
    });
  }

  loadCategory(categoryId: number): void {
    this.categoryService.getCategory(categoryId).subscribe({
      next: (category) => {
        this.category = category;
      },
      error: (error) => {
        console.error('Error loading category:', error);
      }
    });
  }

  onEditContact(): void {
    this.router.navigate(['/contacts', this.contactId, 'edit']);
  }

  onDeleteContact(): void {
    if (this.contact && confirm(`Are you sure you want to delete "${this.contact.firstName} ${this.contact.lastName}"?`)) {
      this.contactService.deleteContact(this.contactId).subscribe({
        next: () => {
          this.router.navigate(['/contacts']);
        },
        error: (error) => {
          this.error = error;
        }
      });
    }
  }

  onBackToList(): void {
    this.router.navigate(['/contacts']);
  }

  onViewCategory(): void {
    if (this.contact?.categoryId) {
      this.router.navigate(['/categories', this.contact.categoryId]);
    }
  }

  getInitials(): string {
    if (this.contact) {
      return this.contact.firstName.charAt(0) + this.contact.lastName.charAt(0);
    }
    return '';
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // You could show a toast notification here
      console.log('Copied to clipboard:', text);
    });
  }

  callPhone(): void {
    if (this.contact?.phone) {
      window.location.href = `tel:${this.contact.phone}`;
    }
  }

  sendEmail(): void {
    if (this.contact?.email) {
      window.location.href = `mailto:${this.contact.email}`;
    }
  }

  openMaps(): void {
    if (this.contact?.address) {
      const encodedAddress = encodeURIComponent(this.contact.address);
      window.open(`https://maps.google.com?q=${encodedAddress}`, '_blank');
    }
  }
}
