import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ContactModule { 
  id?: number;
  firstName!: string;
  lastName!: string;
  email!: string;
  phone!: string;
  address!: string;
  createdDate?: string;
  updatedDate?: string;
  categoryId!: number;
}
