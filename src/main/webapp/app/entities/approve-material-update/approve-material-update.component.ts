import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { ChangeDetectionStrategy, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSort } from '@angular/material/sort';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface sumary_mode {
  value: string;
  name: string;
}
export interface ColumnConfig {
  name: string;
  matColumnDef: string;
  completed: boolean;
}
export interface columnSelectionGroup {
  name: string;
  completed: boolean;
  subtasks?: ColumnConfig[];
}
export interface FilterDialogData {
  columnName: string;
  currentValues: any[];
  selectedValues: any[];
}
@Component({
  selector: 'jhi-approve-material-update',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormBuilder],
  templateUrl: './approve-material-update.component.html',
  styleUrls: ['./approve-material-update.componennt.scss'],
})
export class ApproveMaterialUpdateComponent implements OnInit, AfterViewInit, OnDestroy {
  Title: any;

  ngOnInit(): void {
    const ThayTitle = 'default';
  }
  ngAfterViewInit(): void {
    const b = 'blo';
  }
  ngOnDestroy(): void {
    const c = 'clo';
  }
}
