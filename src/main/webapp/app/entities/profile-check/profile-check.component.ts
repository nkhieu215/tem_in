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
  listOfProDuctPanigationURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/panigation');
  totalItemURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/total');
  predicate!: string;
  ascending!: boolean;
  page?: number;
  versions: any;
  product: any;
  @Input() productCode = '';
  @Input() productName = '';
  @Input() createdAt = null;
  @Input() updatedAt = '';
  @Input() username = '';
  @Input() productStatus = '';
  @Input() itemPerPage = 10;
  //phân trang
  pageNumber = 1;
  itemsPerPage = ITEMS_PER_PAGE;
  // thông tin phân trang
  totalData = 0;
  nextPageBtn = false;
  lastPageBtn = false;
  backPageBtn = true;
  firstPageBtn = true;
  //Dữ liệu tìm kiếm
  body: {
    productCode: string;
    productName: string;
    username: string;
    createdAt: string | null;
    itemPerPage: number;
    pageNumber: number;
  } = {
    productCode: '',
    productName: '',
    username: '',
    createdAt: null,
    itemPerPage: this.itemPerPage,
    pageNumber: this.pageNumber,
  };
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
  mappingBodySearchAndPagination(): void {
    this.body.createdAt = this.createdAt;
    this.body.productCode = this.productCode;
    this.body.productName = this.productName;
    this.body.username = this.username;
    this.body.itemPerPage = this.itemPerPage;
    this.body.pageNumber = this.pageNumber;
    // // console.log('body: ', this.body);
  }
  nextPage(): void {
    this.pageNumber++;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    if (this.pageNumber === Math.floor(this.totalData / this.itemPerPage) + 1) {
      this.nextPageBtn = true;
    }
    this.getProductList();
  }
  lastPage(): void {
    this.pageNumber = Math.floor(this.totalData / this.itemPerPage) + 1;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    this.lastPageBtn = true;
    this.nextPageBtn = true;
    this.getProductList();
  }
  backPage(): void {
    this.pageNumber--;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    if (this.pageNumber === 1) {
      this.backPageBtn = true;
      this.firstPageBtn = true;
    }
    this.getProductList();
  }
  firstPage(): void {
    this.pageNumber = 1;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    this.backPageBtn = true;
    this.firstPageBtn = true;
    this.getProductList();
  }
  findFucntion(): void {
    this.mappingBodySearchAndPagination();
    setTimeout(() => {
      this.getProductList();
      this.getTotalData();
    }, 100);
  }
  getTotalData(): void {
    this.http.post<any>(this.totalItemURL, this.body).subscribe(res => {
      this.totalData = res;
      if (this.totalData < this.itemPerPage) {
        this.nextPageBtn = true;
        this.lastPageBtn = true;
      } else {
        this.nextPageBtn = false;
        this.lastPageBtn = false;
      }
      // console.log('total data', res, Math.floor(this.totalData / this.itemPerPage));
    });
  }
  getProductList(): void {
    this.http.post<any>(this.listOfProDuctPanigationURL, this.body).subscribe(res => {
      this.listOfProduct = res;
      console.log('tesst 1: ', this.pageNumber, res);
      setTimeout(() => {
        this.http.post<any>(this.totalItemURL, this.body).subscribe(res1 => {
          console.log('tongsoluong', res1);
          this.totalData = res1;
        });
      }, 500);
    });
  }
  ngOnInit(): void {
    this.getProductList();
    // this.http.get<any>(this.listOfProDuctURL).subscribe(res => {
    //   this.listOfProduct = res;
    //   console.log('thong tin chung', res);
    //   // console.log(res);
    // });
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
