import dayjs from 'dayjs/esm';
import { ILenhSanXuat } from 'app/entities/lenh-san-xuat/lenh-san-xuat.model';
import { FormBuilder } from '@angular/forms';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component, OnInit, Input } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IChiTietLenhSanXuat } from '../chi-tiet-lenh-san-xuat.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { ChiTietLenhSanXuatService } from '../service/chi-tiet-lenh-san-xuat.service';
import { ChiTietLenhSanXuatDeleteDialogComponent } from '../delete/chi-tiet-lenh-san-xuat-delete-dialog.component';
import { doc } from 'prettier';

@Component({
  selector: 'jhi-chi-tiet-lenh-san-xuat',
  templateUrl: './chi-tiet-lenh-san-xuat.component.html',
  styleUrls: ['./chi-tiet-lenh-san-xuat.component.css'],
})
export class ChiTietLenhSanXuatComponent implements OnInit {
  resourceUrlApprove = this.applicationConfigService.getEndpointFor('api/quan-ly-phe-duyet');
  totalDataUrl = this.applicationConfigService.getEndpointFor('api/quan-ly-phe-duyet/totaldata');
  searchUrlApprove = this.applicationConfigService.getEndpointFor('api/lenh-san-xuat');
  maLenhSanXuatResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/ma-lenh-san-xuat');
  versionResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/version');
  sapCodetResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/sap-code');
  sapNameResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/sap-name');
  workOrderCodeResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/work-order-code');
  getLenhSanXuatTongSoLuongUrl = this.applicationConfigService.getEndpointFor('api/lenh-san-xuat/tong-so-luong');
  formSearch = this.formBuilder.group({
    maLenhSanXuat: '',
    sapCode: '',
    sapName: '',
    workOrderCode: '',
    version: '',
    storageCode: '',
    createBy: '',
    trangThai: '',
  });
  // thông tin phân trang
  totalData = 0;
  nextPageBtn = false;
  lastPageBtn = false;
  backPageBtn = true;
  firstPageBtn = true;
  @Input() itemPerPage = 10;
  @Input() pageNumber = 1;
  @Input() maLenhSanXuat = '';
  @Input() sapCode = '';
  @Input() sapName = '';
  @Input() workOrderCode = '';
  @Input() version = '';
  @Input() storageCode = '';
  @Input() createBy = '';
  @Input() trangThai = '';
  @Input() entryTime = null;
  @Input() timeUpdate = null;
  // body tim kiem + pagination
  body: {
    maLenhSanXuat: string;
    sapCode: string;
    sapName: string;
    workOrderCode: string;
    version: string;
    storageCode: string;
    createBy: string;
    trangThai: string;
    entryTime: string | null;
    timeUpdate: string | null;
    itemPerPage: number;
    pageNumber: number;
  } = {
    maLenhSanXuat: '',
    sapCode: '',
    sapName: '',
    workOrderCode: '',
    version: '',
    storageCode: '',
    createBy: '',
    trangThai: '',
    entryTime: null,
    timeUpdate: null,
    itemPerPage: this.itemPerPage,
    pageNumber: this.pageNumber,
  };
  lenhSanXuats?: ILenhSanXuat[];
  lenhSanXuatGoc?: ILenhSanXuat[];
  listTongSoLuong: any[] = [];
  // khởi tạo danh sách gợi ý
  listOfMaLenhSanXuat: string[] = [];
  listOfSapCode: string[] = [];
  listOfSapName: string[] = [];
  listOfWorkOrderCode: string[] = [];
  listOfVersion: string[] = [];
  chiTietLenhSanXuats?: IChiTietLenhSanXuat[];

  chiTietLenhSanXuatSort?: IChiTietLenhSanXuat[] = [];

  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  constructor(
    protected chiTietLenhSanXuatService: ChiTietLenhSanXuatService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected formBuilder: FormBuilder,
    protected http: HttpClient
  ) {}
  // Thay đổi background color ứng với mỗi trạng thái
  changeColor(): void {
    for (let i = 0; i < this.lenhSanXuats!.length; i++) {
      const item = this.lenhSanXuats![i].id!.toString();
      if (this.lenhSanXuats![i].groupName?.includes('TC01') === true) {
        document.getElementById(item)!.style.backgroundColor = '#FF9900';
      } else if (this.lenhSanXuats![i].groupName?.includes('SMT01') === true) {
        document.getElementById(item)!.style.backgroundColor = '#00CCFF';
      } else if (this.lenhSanXuats![i].groupName?.includes('SMT02') === true) {
        // // console.log('tesst', this.lenhSanXuats![i].groupName?.includes('SMT02'));
        document.getElementById(item)!.style.backgroundColor = '#00CC00';
      }
      if (this.lenhSanXuats![i].trangThai === 'Chờ duyệt') {
        document.getElementById(i.toString())!.style.backgroundColor = '#FFFF33';
      } else if (this.lenhSanXuats![i].trangThai === 'Đã phê duyệt') {
        document.getElementById(i.toString())!.style.backgroundColor = '#00FF00';
      } else if (this.lenhSanXuats![i].trangThai === 'Sản xuất hủy') {
        document.getElementById(i.toString())!.style.backgroundColor = '#EE0000';
        document.getElementById(i.toString())!.style.color = '#fff';
      } else if (this.lenhSanXuats![i].trangThai === 'Kho hủy') {
        document.getElementById(i.toString())!.style.backgroundColor = '#DD0000';
        document.getElementById(i.toString())!.style.color = '#fff';
      } else if (this.lenhSanXuats![i].trangThai === 'Bản nháp') {
        document.getElementById(i.toString())!.style.backgroundColor = '#00FFFF';
      } else if (this.lenhSanXuats![i].trangThai === 'Từ chối') {
        document.getElementById(i.toString())!.style.backgroundColor = '#FFCC00';
      }
    }
  }
  mappingBodySearchAndPagination(): void {
    this.body.maLenhSanXuat = this.maLenhSanXuat;
    this.body.sapCode = this.sapCode;
    this.body.sapName = this.sapName;
    this.body.workOrderCode = this.workOrderCode;
    this.body.version = this.version;
    this.body.storageCode = this.storageCode;
    this.body.createBy = this.createBy;
    this.body.entryTime = this.entryTime;
    this.body.timeUpdate = this.timeUpdate;
    this.body.itemPerPage = this.itemPerPage;
    this.body.pageNumber = this.pageNumber;
    this.body.trangThai = this.trangThai;
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
    this.getLenhSanXuatList();
  }
  lastPage(): void {
    this.pageNumber = Math.floor(this.totalData / this.itemPerPage) + 1;
    this.mappingBodySearchAndPagination();
    this.backPageBtn = false;
    this.firstPageBtn = false;
    this.lastPageBtn = true;
    this.nextPageBtn = true;
    this.getLenhSanXuatList();
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
    this.getLenhSanXuatList();
  }
  firstPage(): void {
    this.pageNumber = 1;
    this.mappingBodySearchAndPagination();
    this.nextPageBtn = false;
    this.lastPageBtn = false;
    this.backPageBtn = true;
    this.firstPageBtn = true;
    this.getLenhSanXuatList();
  }
  findFucntion(): void {
    this.mappingBodySearchAndPagination();
    setTimeout(() => {
      this.getLenhSanXuatList();
      this.getTotalData();
    }, 100);
  }
  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.chiTietLenhSanXuatService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
        sort: this.sort(),
      })
      .subscribe({
        next: (res: HttpResponse<IChiTietLenhSanXuat[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }
  getTotalData(): void {
    this.http.post<any>(this.totalDataUrl, this.body).subscribe(res => {
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
  ngOnInit(): void {
    // // console.log(this.body);
    // this.http.post<any>(this.resourceUrlApprove, this.body).subscribe(res => {
    //   this.lenhSanXuats = res;
    //   // console.log('test', this.lenhSanXuats);
    //   // if (this.lenhSanXuats) {
    //   //   this.lenhSanXuats.sort((a, b) => {
    //   //     if (
    //   //       a.entryTime !== undefined &&
    //   //       a.entryTime !== null &&
    //   //       b.entryTime !== undefined &&
    //   //       b.entryTime !== null &&
    //   //       a.trangThai !== undefined &&
    //   //       a.trangThai !== null &&
    //   //       b.trangThai !== undefined &&
    //   //       b.trangThai !== null
    //   //     ) {
    //   //       return (
    //   //         a.trangThai.localeCompare(b.trangThai) ||
    //   //         <any>new Date(dayjs(b.entryTime).format('MM/DD/YYYY HH:mm:ss')) -
    //   //         <any>new Date(dayjs(a.entryTime).format('MM/DD/YYYY HH:mm:ss'))
    //   //       );
    //   //     }
    //   //     return 0;
    //   //   });
    //   // }
    // });
    this.getTotalData();
    this.getLenhSanXuatList();
    this.createListOfMaLenhSanXuat();
    this.createListOfSapCode();
    this.createListOfSapName();
    this.createListOfVersion();
    this.createListOfWordOrderCode();
    // setTimeout(() => {
    //   this.changeColor();
    // }, 500)
  }
  reloadPage(): void {
    window.location.reload();
  }
  getLenhSanXuatList(): void {
    this.http.post<any>(this.resourceUrlApprove, this.body).subscribe(res => {
      this.lenhSanXuats = res;
      // // console.log('tesst 1: ', this.pageNumber, res);
      setTimeout(() => {
        this.http.post<any>(this.getLenhSanXuatTongSoLuongUrl, this.lenhSanXuats).subscribe(res1 => {
          console.log('tongsoluong', this.lenhSanXuats);
          for (let i = 0; i < this.lenhSanXuats!.length; i++) {
            this.lenhSanXuats![i].totalQuantity = res1[i].tongSoLuong;
          }
        });
        this.changeColor();
      }, 500);
    });
  }

  trackId(_index: number, item: ILenhSanXuat): number {
    return item.id!;
  }

  delete(chiTietLenhSanXuat: IChiTietLenhSanXuat): void {
    const modalRef = this.modalService.open(ChiTietLenhSanXuatDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.chiTietLenhSanXuat = chiTietLenhSanXuat;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }
  //============================ api lấy danh sách gợi tý từ Backend =====================
  createListOfMaLenhSanXuat(): void {
    this.http.get<any>(this.maLenhSanXuatResourceUrl).subscribe(res => {
      this.listOfMaLenhSanXuat = res;
      // // console.log(res);
    });
  }
  createListOfSapCode(): void {
    this.http.get<any>(this.sapCodetResourceUrl).subscribe(res => {
      this.listOfSapCode = res;
      // // console.log('sap code', res);
    });
  }
  createListOfSapName(): void {
    this.http.get<any>(this.sapNameResourceUrl).subscribe(res => {
      this.listOfSapName = res;
      // // console.log('sap name', res);
    });
  }
  createListOfWordOrderCode(): void {
    this.http.get<any>(this.workOrderCodeResourceUrl).subscribe(res => {
      this.listOfWorkOrderCode = res;
      // // console.log('Work order code', res);
    });
  }
  createListOfVersion(): void {
    this.http.get<any>(this.versionResourceUrl).subscribe(res => {
      this.listOfVersion = res;
      // // console.log('version', res);
    });
  }
  sort(): string[] {
    const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
  // pop up thông báo
  alertTimeout(mymsg: string, mymsecs: number): void {
    const myelement = document.createElement('div');
    myelement.setAttribute(
      'style',
      'background-color:white;color:Black; width: 300px;height: 70px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto;border: 1px solid black;font-family:arial;font-size:16px;display: flex; align-items: center; justify-content: center; text-align: center;border-radius:10px'
    );
    myelement.innerHTML = mymsg;
    setTimeout(function () {
      if (myelement.parentNode) {
        myelement.parentNode.removeChild(myelement);
      }
    }, mymsecs);
    document.body.appendChild(myelement);
  }
  handleNavigation(): void {
    combineLatest([this.activatedRoute.data, this.activatedRoute.queryParamMap]).subscribe(([data, params]) => {
      const page = params.get('page');
      const pageNumber = +(page ?? 1);
      const sort = (params.get(SORT) ?? data['defaultSort']).split(',');
      const predicate = sort[0];
      const ascending = sort[1] === ASC;
      if (pageNumber !== this.page || predicate !== this.predicate || ascending !== this.ascending) {
        this.predicate = predicate;
        this.ascending = ascending;
        this.loadPage(pageNumber, true);
      }
    });
  }

  onSuccess(data: IChiTietLenhSanXuat[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/chi-tiet-lenh-san-xuat'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.chiTietLenhSanXuats = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
