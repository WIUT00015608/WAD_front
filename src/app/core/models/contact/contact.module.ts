import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
  //Student ID is 00015608
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
