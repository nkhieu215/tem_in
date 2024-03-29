import dayjs from 'dayjs/esm';
import { FormBuilder } from '@angular/forms';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { Component, Input, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse, HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { ILenhSanXuat } from '../lenh-san-xuat.model';

import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/config/pagination.constants';
import { LenhSanXuatService } from '../service/lenh-san-xuat.service';
import { LenhSanXuatDeleteDialogComponent } from '../delete/lenh-san-xuat-delete-dialog.component';
import { result } from 'cypress/types/lodash';

@Component({
  selector: 'jhi-lenh-san-xuat',
  templateUrl: './lenh-san-xuat.component.html',
  styleUrls: ['./lenh-san-xuat.component.css'],
})
export class LenhSanXuatComponent implements OnInit {
  resourceUrl = this.applicationConfigService.getEndpointFor('api/lenh-san-xuat');
  maLenhSanXuatResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/ma-lenh-san-xuat');
  versionResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/version');
  sapCodetResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/sap-code');
  sapNameResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/sap-name');
  workOrderCodeResourceUrl = this.applicationConfigService.getEndpointFor('api/lenhsx/work-order-code');

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

  lenhSanXuats?: ILenhSanXuat[];
  lenhSanXuatGoc?: ILenhSanXuat[];
  isLoading = false;
  totalItems = 0;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  predicate!: string;
  ascending!: boolean;
  ngbPaginationPage = 1;

  maxResultToShow = 10;
  showingResults = 10;
  currentPage = 1;
  startIndex = 0;

  @Input() itemPerPage = 10;

  @Input() maLenhSanXuat = '';
  @Input() version = '';
  @Input() sapCode = '';
  @Input() sapName = '';
  @Input() workOrderCode = '';
  @Input() storageCode = '';
  @Input() createBy = '';
  @Input() trangThai = '';
  @Input() entryTime = '';
  @Input() timeUpdate = '';

  searchResult: ILenhSanXuat[] = [];
  // khởi tạo danh sách gợi ý
  listOfMaLenhSanXuat: string[] = [];
  listOfSapCode: string[] = [];
  listOfSapName: string[] = [];
  listOfWorkOrderCode: string[] = [];
  listOfVersion: string[] = [];
  resultSearchDateTime = [];

  constructor(
    protected lenhSanXuatService: LenhSanXuatService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected formBuilder: FormBuilder
  ) { }

  loadPage(page?: number, dontNavigate?: boolean): void {
    this.isLoading = true;
    const pageToLoad: number = page ?? this.page ?? 1;

    this.lenhSanXuatService
      .query({
        page: pageToLoad - 1,
        size: this.itemsPerPage,
      })
      .subscribe({
        next: (res: HttpResponse<ILenhSanXuat[]>) => {
          this.isLoading = false;
          this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
        },
        error: () => {
          this.isLoading = false;
          this.onError();
        },
      });
  }

  ngOnInit(): void {
    this.getLenhSanXuatList();
    this.createListOfMaLenhSanXuat();
    this.createListOfSapCode();
    this.createListOfSapName();
    this.createListOfVersion();
    this.createListOfWordOrderCode();
  }

  getLenhSanXuatList(): void {
    this.http.get<any>(this.resourceUrl).subscribe(res => {
      this.lenhSanXuats = res;
      this.lenhSanXuatGoc = res;
      if (this.lenhSanXuats) {
        this.lenhSanXuats.sort((a, b) => {
          if (
            a.entryTime !== undefined &&
            a.entryTime !== null &&
            b.entryTime !== undefined &&
            b.entryTime !== null &&
            a.trangThai !== undefined &&
            a.trangThai !== null &&
            b.trangThai !== undefined &&
            b.trangThai !== null
          ) {
            return (
              a.trangThai.localeCompare(b.trangThai) ||
              <any>new Date(dayjs(b.entryTime).format('MM/DD/YYYY HH:mm:ss')) -
              <any>new Date(dayjs(a.entryTime).format('MM/DD/YYYY HH:mm:ss'))
            );
          }
          return 0;
        });
      }
    });
  }
  reloadPage(): void {
    window.location.reload();
  }
  trackId(_index: number, item: ILenhSanXuat): number {
    return item.id!;
  }
  //============================ api lấy danh sách gợi tý từ Backend =====================
  createListOfMaLenhSanXuat(): void {
    this.http.get<any>(this.maLenhSanXuatResourceUrl).subscribe(res => {
      this.listOfMaLenhSanXuat = res;
      // console.log(res);
    });
  }
  createListOfSapCode(): void {
    this.http.get<any>(this.sapCodetResourceUrl).subscribe(res => {
      this.listOfSapCode = res;
      // console.log('sap code', res);
    });
  }
  createListOfSapName(): void {
    this.http.get<any>(this.sapNameResourceUrl).subscribe(res => {
      this.listOfSapName = res;
      // console.log('sap name', res);
    });
  }
  createListOfWordOrderCode(): void {
    this.http.get<any>(this.workOrderCodeResourceUrl).subscribe(res => {
      this.listOfWorkOrderCode = res;
      // console.log('Work order code', res);
    });
  }
  createListOfVersion(): void {
    this.http.get<any>(this.versionResourceUrl).subscribe(res => {
      this.listOfVersion = res;
      // console.log('version', res);
    });
  }
  delete(lenhSanXuat: ILenhSanXuat): void {
    const modalRef = this.modalService.open(LenhSanXuatDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.lenhSanXuat = lenhSanXuat;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadPage();
      }
    });
  }

  timKiemTem(data: any, page?: number, dontNavigate?: boolean): void {
    const pageToLoad: number = page ?? this.page ?? 1;
    this.lenhSanXuats = [];
    this.http.post<any>(this.resourceUrl, data).subscribe(res => {
      this.lenhSanXuats = res;
      this.onSuccess(res.lenhSanXuats, res.headers, pageToLoad, !dontNavigate);
    });
  }
  // =========================================== Tim kiem ============================================
  //tim kiem theo ma lenh san xuat
  timKiemTheoMaLenhSanXuat(): void {
    if (this.maLenhSanXuat === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          console.log({ a: a.maLenhSanXuat, b: this.maLenhSanXuat });
          if (a.maLenhSanXuat) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              if (this.workOrderCode !== '') {
                return (
                  dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                  a.maLenhSanXuat === this.maLenhSanXuat &&
                  a.workOrderCode === this.workOrderCode
                );
              }
              return (
                dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                a.maLenhSanXuat === this.maLenhSanXuat
              );
            } else if (this.timeUpdate !== '') {
              if (this.workOrderCode !== '') {
                return (
                  dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                  a.maLenhSanXuat === this.maLenhSanXuat &&
                  a.workOrderCode === this.workOrderCode
                );
              }
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
                a.maLenhSanXuat === this.maLenhSanXuat
              );
            } else {
              if (this.workOrderCode !== '') {
                return a.maLenhSanXuat === this.maLenhSanXuat && a.workOrderCode === this.workOrderCode;
              }
              return a.maLenhSanXuat === this.maLenhSanXuat;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo sap code
  timKiemTheoSapCode(): void {
    if (this.sapCode === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.sapCode) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.sapCode === this.sapCode;
            } else if (this.timeUpdate !== '') {
              return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.sapCode === this.sapCode;
            } else {
              return a.sapCode === this.sapCode;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo sap name
  timKiemTheoSapName(): void {
    if (this.sapName === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.sapName) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.sapName === this.sapName;
            } else if (this.timeUpdate !== '') {
              return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.sapName === this.sapName;
            } else {
              return a.sapName === this.sapName;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo workordercode
  timKiemTheoWorkOrderCode(): void {
    if (this.workOrderCode === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.workOrderCode) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return (
                dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                a.workOrderCode === this.workOrderCode
              );
            } else if (this.timeUpdate !== '') {
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
                a.workOrderCode === this.workOrderCode
              );
            } else {
              return a.workOrderCode === this.workOrderCode;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo Version
  timKiemTheoVersion(): void {
    if (this.version === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.version) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.version === this.version;
            } else if (this.timeUpdate !== '') {
              return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.version === this.version;
            } else {
              return a.version === this.version;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo trường storage code
  timKiemTheoStorageCode(): void {
    if (this.storageCode === '') {
      this.getLenhSanXuatList();
    } else {
      this.lenhSanXuats = this.lenhSanXuatGoc;
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.storageCode) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return (
                dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.storageCode === this.storageCode
              );
            } else if (this.timeUpdate !== '') {
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
                a.storageCode === this.storageCode
              );
            } else {
              return a.storageCode === this.storageCode;
            }
          }
          return 0;
        });
      }
    }
  }
  //tim kiem theo trường create by
  timKiemTheoCreateBy(): void {
    this.lenhSanXuats = this.lenhSanXuatGoc;
    if (this.createBy === '') {
      this.getLenhSanXuatList();
    } else {
      if (this.lenhSanXuats) {
        this.lenhSanXuats = this.lenhSanXuats.filter(a => {
          if (a.createBy) {
            //Tìm cùng ngày intem và ngày cập nhật
            if (this.entryTime !== '') {
              return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.createBy === this.createBy;
            } else if (this.timeUpdate !== '') {
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.createBy === this.createBy
              );
            } else {
              return a.createBy === this.createBy;
            }
          }
          return 0;
        });
      }
    }
  }
  // tim kiem theo ngay
  formatNgbDate(): void {
    this.lenhSanXuats = this.lenhSanXuatGoc;
    // this.resultSearchDateTime = [];
    if (this.lenhSanXuats !== undefined) {
      this.lenhSanXuats = this.lenhSanXuats.filter(a => {
        //Tìm cùng 1 trường thông tin khác
        if (this.maLenhSanXuat !== '') {
          if (this.workOrderCode !== '') {
            return (
              dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
              a.maLenhSanXuat === this.maLenhSanXuat &&
              a.workOrderCode === this.workOrderCode
            );
          }
          return (
            dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.maLenhSanXuat === this.maLenhSanXuat
          );
        }
        if (this.sapCode !== '') {
          if (this.maLenhSanXuat !== '') {
            if (this.workOrderCode !== '') {
              return (
                dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                a.sapCode === this.sapCode &&
                a.maLenhSanXuat === this.maLenhSanXuat &&
                a.workOrderCode === this.workOrderCode
              );
            }
            return (
              dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
              a.sapCode === this.sapCode &&
              a.maLenhSanXuat === this.maLenhSanXuat
            );
          }
          return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.sapCode === this.sapCode;
        }
        if (this.sapName !== '') {
          if (this.maLenhSanXuat !== '') {
            if (this.workOrderCode !== '') {
              return (
                dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
                a.sapName === this.sapName &&
                a.maLenhSanXuat === this.maLenhSanXuat &&
                a.workOrderCode === this.workOrderCode
              );
            }
            return (
              dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') &&
              a.sapName === this.sapName &&
              a.maLenhSanXuat === this.maLenhSanXuat
            );
          }
          return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.sapName === this.sapName;
        }
        if (this.workOrderCode !== '') {
          return (
            dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY') && a.workOrderCode === this.workOrderCode
          );
        }
        if (this.entryTime !== '') {
          return dayjs(a.entryTime).format('DD/MM/YYYY') === dayjs(this.entryTime).format('DD/MM/YYYY');
        }
        return 0;
      });
    }
    if (this.lenhSanXuats?.length === 0) {
      this.alertTimeout('Không tìm thấy lệnh sản xuất', 2000);
      setTimeout(() => window.location.reload(), 2000);
    }
  }
  formatNgbDateUpdate(): void {
    this.lenhSanXuats = this.lenhSanXuatGoc;
    // this.resultSearchDateTime = [];
    if (this.lenhSanXuats !== undefined) {
      this.lenhSanXuats = this.lenhSanXuats.filter(a => {
        //Tìm cùng 1 trường thông tin khác
        if (this.maLenhSanXuat !== '') {
          if (this.workOrderCode !== '') {
            return (
              dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
              a.maLenhSanXuat === this.maLenhSanXuat &&
              a.workOrderCode === this.workOrderCode
            );
          }
          return (
            dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
            a.maLenhSanXuat === this.maLenhSanXuat
          );
        }
        if (this.sapCode !== '') {
          if (this.maLenhSanXuat !== '') {
            if (this.workOrderCode !== '') {
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
                a.sapCode === this.sapCode &&
                a.maLenhSanXuat === this.maLenhSanXuat &&
                a.workOrderCode === this.workOrderCode
              );
            }
            return (
              dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
              a.sapCode === this.sapCode &&
              a.maLenhSanXuat === this.maLenhSanXuat
            );
          }
          return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.sapCode === this.sapCode;
        }
        if (this.sapName !== '') {
          if (this.maLenhSanXuat !== '') {
            if (this.workOrderCode !== '') {
              return (
                dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
                a.sapName === this.sapName &&
                a.maLenhSanXuat === this.maLenhSanXuat &&
                a.workOrderCode === this.workOrderCode
              );
            }
            return (
              dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
              a.sapName === this.sapName &&
              a.maLenhSanXuat === this.maLenhSanXuat
            );
          }
          return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') && a.sapName === this.sapName;
        }
        if (this.workOrderCode !== '') {
          return (
            dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY') &&
            a.workOrderCode === this.workOrderCode
          );
        }
        if (this.timeUpdate !== '') {
          return dayjs(a.timeUpdate).format('DD/MM/YYYY') === dayjs(this.timeUpdate).format('DD/MM/YYYY');
        }
        return 0;
      });
    }
    if (this.lenhSanXuats?.length === 0) {
      this.alertTimeout('Không tìm thấy lệnh sản xuất', 2000);
      setTimeout(() => window.location.reload(), 2000);
      // window.location.reload();
    }
  }
  // sort(): string[] {
  //   const result = [this.predicate + ',' + (this.ascending ? ASC : DESC)];
  //   if (this.predicate !== 'id') {
  //     result.push('id');
  //   }
  //   return result;
  // }
  // pop up thông báo
  alertTimeout(mymsg: string, mymsecs: number): void {
    const myelement = document.createElement('div');
    myelement.setAttribute(
      'style',
      'background-color:white;color:Black; width: 300px;height: 70px;position: absolute;top:0;bottom:0;left:0;right:0;margin:auto;border: 1px solid black;font-family:arial;font-size:14px;display: flex; align-items: center; justify-content: center; text-align: center;border-radius:10px'
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

  onSuccess(data: ILenhSanXuat[] | null, headers: HttpHeaders, page: number, navigate: boolean): void {
    this.totalItems = Number(headers.get('X-Total-Count'));
    this.page = page;
    if (navigate) {
      this.router.navigate(['/lenh-san-xuat'], {
        queryParams: {
          page: this.page,
          size: this.itemsPerPage,
          sort: this.predicate + ',' + (this.ascending ? ASC : DESC),
        },
      });
    }
    this.lenhSanXuats = data ?? [];
    this.ngbPaginationPage = this.page;
  }

  onError(): void {
    this.ngbPaginationPage = this.page ?? 1;
  }
}
