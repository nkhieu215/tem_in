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
  versionURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/versions');

  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  versions: any;
  product: any;
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
  listOfVersion: any[] = [];
  popupKhaiBaoProfile = false;
  popupConfirmSave = false;
  machines: any;
  version: any;

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
      console.log('thong tin chung', res);
      // console.log(res);
    });
  }

  openPopupKhaiBaoProfile(index: any, groupId: any): void {
    this.popupKhaiBaoProfile = true;
    console.log('product', this.listOfProduct[index]);
    this.product = this.listOfProduct[index];
    // this.productCode = this.listOfProduct[index].productCode;
    // this.productName = this.listOfProduct[index].productName;
    // this.versions = this.listOfProduct[index].productVersion;
    // this.machines = this.listOfMaMay[index];
    this.http.get<any>(`${this.listOfProDuctURL}/${groupId as string}`).subscribe(res => {
      this.listOfMaMay = res;
    });

    const item = sessionStorage.getItem('productId');
    this.http.get<any>(`${this.versionURL}/${groupId as string}`).subscribe(resVer => {
      this.listOfVersion = resVer;
      console.log('version', resVer);
    });

    console.log('machine', this.machines);
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
      version: null,
      groupName: null,
    };
    this.listOfVersion = [...this.listOfVersion, newRow];
    console.log('them dong', this.listOfVersion);
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

  updateVersionProfile(): void {
    const item = sessionStorage.getItem('productId');
    this.http.get<any>(`${this.versionURL}/${item as string}`).subscribe(res => {
      this.listOfVersion = res;
      console.log('version', res);
    });
  }

  // updateChiTietMay(): void {

  // }
}
