import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactModule } from '../contact/contact.module'; // Adjust the import path as necessary
// import { Contact } from '../contact/contact.model'; // Adjust the path if needed

//Student ID is 00015608

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CategoryModule { 
  id?: number;
  name?: string;
  description?: string;
  createdDate?: string;
  contacts?: ContactModule[];
}
