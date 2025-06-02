import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryModule } from '../../core/models/category/category.module';
import { ContactModule } from '../../core/models/contact/contact.module';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent {
  contactForm: FormGroup;
  categories: CategoryModule[] = [];
  isEditMode = false;
  contactId: number = 0;
  loading = false;
  saving = false;
  error: string | null = null;
  contact: ContactModule | null = null;
  preselectedCategoryId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private categoryService: CategoryService
  ) {
    this.contactForm = this.createForm();
  }

  ngOnInit(): void {
    // Check for preselected category from query params
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['categoryId']) {
        this.preselectedCategoryId = +queryParams['categoryId'];
      }
    });

    // Check if we're in edit mode
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.contactId = +params['id'];
        this.loadContact();
      } else if (this.preselectedCategoryId) {
        // Set the category if coming from category detail page
        this.contactForm.patchValue({ categoryId: this.preselectedCategoryId });
      }
    });

    this.loadCategories();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      phone: ['', [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)]],
      address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      categoryId: ['', [Validators.required]]
    });
  }

  loadContact(): void {
    this.loading = true;
    this.error = null;

    this.contactService.getContact(this.contactId).subscribe({
      next: (contact) => {
        this.contact = contact;
        this.contactForm.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email,
          phone: contact.phone,
          address: contact.address,
          categoryId: contact.categoryId
        });
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

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.saving = true;
      this.error = null;

      const contactData: ContactModule = {
        ...this.contactForm.value,
        categoryId: +this.contactForm.value.categoryId
      };

      if (this.isEditMode && this.contactId) {
        contactData.id = this.contactId;
        this.updateContact(contactData);
      } else {
        this.createContact(contactData);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  createContact(contact: ContactModule): void {
    this.contactService.createContact(contact).subscribe({
      next: (createdContact) => {
        this.saving = false;
        this.router.navigate(['/contacts', createdContact.id]);
      },
      error: (error) => {
        this.error = error;
        this.saving = false;
      }
    });
  }

  updateContact(contact: ContactModule): void {
    this.contactService.updateContact(this.contactId, contact).subscribe({
      next: (updatedContact) => {
        this.saving = false;
        this.router.navigate(['/contacts', updatedContact.id]);
      },
      error: (error) => {
        this.error = error;
        this.saving = false;
      }
    });
  }

  onCancel(): void {
    if (this.isEditMode && this.contactId) {
      this.router.navigate(['/contacts', this.contactId]);
    } else {
      this.router.navigate(['/contacts']);
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        if (fieldName === 'phone') {
          return 'Please enter a valid phone number';
        }
      }
      if (field.errors['minlength']) {
        return `${this.getFieldDisplayName(fieldName)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${this.getFieldDisplayName(fieldName)} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      categoryId: 'Category'
    };
    return displayNames[fieldName] || fieldName;
  }
}
