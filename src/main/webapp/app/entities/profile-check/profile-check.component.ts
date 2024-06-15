import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-profile-check',
  templateUrl: './profile-check.component.html',
  styleUrls: ['./profile-check.component.scss'],
})
export class ProfileCheckComponent implements OnInit {
  listOfProDuctURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check');
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  @Input() productCode = '';
  @Input() productName = '';
  @Input() createdAt = '';
  @Input() updatedAt = '';
  @Input() username = '';
  @Input() productStatus = '';
  @Input() itemPerPage = 10;

  // list product
  listOfProduct: any[] = [];
  listOfNhomMayVersion: any[] = [];
  listOfMaMay: any[] = [];
  listInfoMachineAdd: any[] = [];
  popupKhaiBaoProfile = false;
  popupConfirmSave = false;
  machines: any;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    // this.isLoading = true;
    // const pageToLoad: number = page ?? this.page ?? 1;
    // this.lenhSanXuatService
    //   .query({
    //     page: pageToLoad - 1,
    //     size: this.itemsPerPage,
    //   })
    //   .subscribe({
    //     next: (res: HttpResponse<ILenhSanXuat[]>) => {
    //       this.isLoading = false;
    //       this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
    //     },
    //     error: () => {
    //       this.isLoading = false;
    //       this.onError();
    //     },
    //   });
  }

  ngOnInit(): void {
    this.http.get<any>(this.listOfProDuctURL).subscribe(res => {
      this.listOfProduct = res;
      // console.log(res);
    });
  }

  openPopupKhaiBaoProfile(index: any, id: any): void {
    this.popupKhaiBaoProfile = true;
    this.machines = this.listOfMaMay[index];
    this.http.get<any>(`${this.listOfProDuctURL}/${id as string}`).subscribe(res => {
      this.listOfMaMay = res;
    });
    // console.log('machine', this.machines);
  }

  closePopupKhaiBaoProfile(): void {
    this.popupKhaiBaoProfile = false;
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
    this.http.post<any>(this.listOfProDuctURL, this.listInfoMachineAdd).subscribe(() => {
      // console.log('post profile', this.listInfoMachineAdd);
    });
    this.http.put<any>(this.listOfProDuctURL, this.listInfoMachineAdd).subscribe(() => {
      // console.log('put profile', this.listInfoMachineAdd);
    });
  }

  closePopupConfirmSave(): void {
    this.popupConfirmSave = false;
  }

  addRowGroupMachine(): void {
    const newRow = {
      id: 0,
      productVersion: null,
      groupName: null,
    };
    this.listOfNhomMayVersion = [...this.listOfNhomMayVersion, newRow];
    // console.log('them dong', this.listOfNhomMayVersion);
  }

  addRowChiTietMay(): void {
    const newRow = {
      id: 0,
      machineId: '',
      posotion: '',
      recordValue: '',
      checkName: '',
      checkStatus: '',
    };
    this.listOfMaMay = [...this.listOfMaMay, newRow];
    // console.log('them dong 2', this.listOfMaMay);
  }
}
