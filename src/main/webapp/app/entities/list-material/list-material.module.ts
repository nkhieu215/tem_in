import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListMaterialComponent } from './list/list-material.component';
import { ListMaterialUpdateComponent } from './update/list-material-update.component';
import { ListMaterialRoutingModule } from './route/list-material-routing.module';
// import { ApolloModule } from 'apollo-angular';
import { HttpClientModule } from '@angular/common/http';
import { ListMaterialService } from './services/list-material.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatMenuModule,
    // ApolloModule,
    HttpClientModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatPaginatorModule,
    ListMaterialRoutingModule,
    SharedModule,
  ],

  declarations: [ListMaterialComponent, ListMaterialUpdateComponent],

  exports: [ListMaterialComponent, ListMaterialUpdateComponent],
})
export class ListMaterialModule {}
