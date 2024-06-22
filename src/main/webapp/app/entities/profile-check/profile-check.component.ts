import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-profile-check',
  templateUrl: './profile-check.component.html',
  styleUrls: ['./profile-check.component.scss'],
})
export class ProfileCheckComponent implements OnInit {
  listOfProDuctURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check');
  versionURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/versions');
  postVersionURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/create-version');
  listOfProDuctPanigationURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/panigation');
  totalItemURL = this.applicationConfigService.getEndpointFor('api/scan-profile-check/total');
  listOfGroupMachineURL = this.applicationConfigService.getEndpointFor('api/scan-group-machines');
  listOfMachineURL = this.applicationConfigService.getEndpointFor('api/scan-machines');
  // api them moi san pham
  addNewProductURL = this.applicationConfigService.getEndpointFor('api/scan-product');
  showProfileURL = this.applicationConfigService.getEndpointFor('api/profile-checks');
  insertProfileURL = this.applicationConfigService.getEndpointFor('api/profile-checks/insert');
  predicate!: string;
  ascending!: boolean;
  versions: any;
  product: any;
  productId = 0;
  groupId = 0;
  groupName = '';
  @Input() productCode = '';
  @Input() productName = '';
  @Input() createdAt = null;
  @Input() updatedAt = '';
  @Input() username = '';
  @Input() productStatus = '';
  @Input() itemPerPage = 10;
  //phân trang
  pageNumber = 1;
  itemsPerPage = 5;
  page?: number;
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
  listOfGroupMachine: any[] = [];
  listOfMachine: any[] = [
    { machineId: 1, machineName: 'machine1' },
    { machineId: 2, machineName: 'machine2' },
    { machineId: 3, machineName: 'machine3' },
  ];
  popupKhaiBaoProfile = false;
  popupConfirmSave = false;
  popupAddNewProduct = false;
  popupSaveThemMoiSanPham = false;
  popupSaveThemMoiThongTinSanPham = false;
  machines: any;
  version: any;
  versionId: any;
  account: any;
  //body profile check by version and product
  profileInfo: any;
  machineName: any;
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService
  ) {}
  trackId(_index: number, item: any): number {
    return item.id! as number;
  }
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
      this.lastPageBtn = true;
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
      for (let i = 0; i < this.listOfProduct.length; i++) {
        this.listOfProduct[i].productStatus = this.listOfProduct[i].productStatus === 1 ? 'Active' : 'Deactive';
      }
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
    console.log(this.listOfMachine);
    this.accountService.identity().subscribe(account => {
      this.account = account;
      // console.log('acc', this.account);
    });
    this.getProductList();
    this.getListGroupMachines();
  }
  getListGroupMachines(): void {
    this.http.get<any>(this.listOfGroupMachineURL).subscribe(res => {
      this.listOfGroupMachine = res;
      console.log('nhom may', this.listOfGroupMachine);
    });
  }
  openPopupKhaiBaoProfile(index: any, productId: any): void {
    this.popupKhaiBaoProfile = true;
    console.log('product', this.listOfProduct[index]);
    this.product = this.listOfProduct[index];
    // this.http.get<any>(`${this.listOfProDuctURL}/${productId as string}`).subscribe(res => {
    //   this.listOfMaMay = res;
    // });
    this.http.get<any>(`${this.showProfileURL}/${productId as string}`).subscribe(res => {
      this.listOfMaMay = res;
      console.log('product', res);
    });
    const item = sessionStorage.getItem('productId');
    this.http.get<any>(`${this.versionURL}/${productId as string}`).subscribe(resVer => {
      this.listOfVersion = resVer;
      console.log('version', resVer);
    });
  }

  closePopupKhaiBaoProfile(): void {
    this.popupKhaiBaoProfile = false;
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
  }

  closePopupConfirmSave(message: string): void {
    if (message === 'confirm') {
      this.popupConfirmSave = false;
      this.listOfMaMay = this.listOfMaMay.filter(item => item.checked === false);
      this.http.post<any>(this.insertProfileURL, this.listOfMaMay).subscribe();
      console.log(this.listOfMaMay);
    } else if (message === 'cancel') {
      this.popupConfirmSave = false;
    }
  }

  addRowListVersion(): void {
    const item = {
      versionId: null,
      groupId: 0,
      version: '1.1',
      productId: this.productId,
      create: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      username: this.account.login,
      versionStatus: 1,
    };
    this.listOfVersion = [item, ...this.listOfVersion];
    console.log('them dong', this.listOfVersion);
  }

  addRowProfileCheck(): void {
    if (this.listOfMaMay.length === 0) {
      const newRow = {
        version: this.version,
        checked: false,
        profileId: 0,
        machineId: 0,
        posotion: 0,
        checkValue: '',
        checkName: '',
        versionId: this.versionId,
        productId: this.productId,
        checkStatus: 'Active',
      };
      this.listOfMaMay = [newRow, ...this.listOfMaMay];
    } else {
      const newRow = {
        version: this.version,
        checked: false,
        profileId: this.listOfMaMay[this.listOfMaMay.length - 1].profileId++,
        machineId: 0,
        posotion: 0,
        checkValue: '',
        checkName: '',
        versionId: this.versionId,
        productId: this.productId,
        checkStatus: 'Active',
      };
      this.listOfMaMay = [newRow, ...this.listOfMaMay];
      // console.log('them dong 2', this.listOfMaMay);
      console.log(this.listOfMaMay);
    }
  }

  updateVersionProfile(): void {
    const item = sessionStorage.getItem('productId');
    this.http.get<any>(`${this.versionURL}/${item as string}`).subscribe(res => {
      this.listOfVersion = res;
      console.log('version', res);
    });
  }

  openPopupAddNewProduct(): void {
    this.listOfVersion = [];
    this.listOfMaMay = [];
    this.productCode = '';
    this.productName = '';
    this.popupAddNewProduct = true;
    const item = {
      versionId: null,
      groupId: 0,
      version: '1.1',
      productId: this.productId,
      create: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      username: this.account.login,
      versionStatus: 1,
    };
    this.listOfVersion = [item, ...this.listOfVersion];
  }

  closePopupAddNewProduct(): void {
    this.popupAddNewProduct = false;
  }
  addNewProduct(): void {
    const item = {
      productCode: this.productCode,
      productName: this.productName,
      productVersion: '1.1',
      createAt: formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US'),
      username: this.account.login,
      productStatus: 1,
    };
    this.http.post<any>(this.addNewProductURL, item).subscribe(res => {
      this.productId = res.productId;
      alert('thêm mới sản phẩm thành công');
      console.log('product id: ', this.productId);
    });
  }
  getGroupId(groupName: any, index: any): void {
    this.listOfVersion[index].groupId =
      this.listOfGroupMachine[this.listOfGroupMachine.findIndex(item => item.groupName === groupName)].groupId;
    // console.log("select group id: ", this.groupId)
    this.listOfVersion[index].productId = this.productId;
    this.groupId = this.listOfGroupMachine[this.listOfGroupMachine.findIndex(item => item.groupName === groupName)].groupId;
    console.log('list version: ', this.listOfVersion);

    //get danh sách các trạm ( thiết bị)
    this.http.get<any>(`${this.listOfMachineURL}/${this.groupId.toString()}`).subscribe(res1 => {
      console.log('list machine', res1);
      this.listOfMachine = res1;
    });
  }
  getListProfile(index: any): void {
    // thêm mới version
    this.http.post<any>(this.postVersionURL, this.listOfVersion[index]).subscribe(res => {
      this.profileInfo = res;
      console.log('them moi version: ', this.profileInfo);
      this.versionId = res.versionId;
      this.version = res.version;
      const item = { versionId: this.versionId, product: this.productId };
      this.http.post<any>(this.showProfileURL, item).subscribe(res1 => {
        this.listOfMaMay = res1;
        console.log('list profile', res1);
        if (this.listOfMaMay.length === 0) {
          const newRow = {
            version: this.version,
            checked: false,
            profileId: 0,
            machineId: 0,
            posotion: 0,
            checkValue: '',
            checkName: '',
            versionId: this.versionId,
            productId: this.productId,
            checkStatus: 'Active',
          };
          this.listOfMaMay = [newRow, ...this.listOfMaMay];
        }
      });
    });
  }
  // bắt sự kiện thay đổi tên trạm
  catchEventSetMachineName(machineName: any, profileId: any): void {
    this.listOfMaMay[this.listOfMaMay.findIndex(item => item.profileId === profileId)].machineId =
      this.listOfMachine[this.listOfMachine.findIndex(item => item.machineName === machineName)].machineId;
    console.log(this.listOfMaMay);
  }
  // Xóa thông tin profile thêm mới
  deleteProfileInfo(profileId: any): void {
    this.listOfMaMay = this.listOfMaMay.filter(item => item.profileId !== profileId);
    console.log(this.listOfMaMay);
  }
  getVersion(index: any): void {
    this.version = this.listOfVersion[index].version;
  }
}
