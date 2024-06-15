import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ScanCheckComponent } from './scan-check.component';

@Component({
  selector: 'jhi-doi-chieu-lenh-san-xuat',
  templateUrl: './doi-chieu-lenh-san-xuat.component.html',
  styleUrls: ['./doi-chieu-lenh-san-xuat.component.scss'],
})
export class DoiChieuLenhSanXuatComponent implements OnInit {
  doiChieuLenhSanXuatUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order/groupId');
  WorkOrderDetailUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order');
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  doiChieuLenhSanXuats?: any[];

  popupChiTietThongTinScan = false;
  popupConfirmSave = false;

  @Input() workOrder = '';
  @Input() lot = '';
  @Input() machineId = '';
  @Input() productCode = '';
  @Input() productName = '';
  @Input() working = '';
  @Input() createdAt = '';
  @Input() position = '';
  @Input() checkValue = '';
  @Input() itemPerPage = 10;

  //list lenh san xuat
  listOfLenhSanXuat: any[] = [];
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient // private scanCheck: ScanCheckComponent
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
    this.http.get<any>(this.doiChieuLenhSanXuatUrl).subscribe(res => {
      res.forEach((item: { trangThai: string | number }) => {
        if (item.trangThai === 0) {
          item.trangThai = 'Waitting';
        } else if (item.trangThai === 1) {
          item.trangThai = 'Running';
        } else if (item.trangThai === 2) {
          item.trangThai = 'Finish';
        } else if (item.trangThai === 3) {
          item.trangThai = 'Paused';
        }
      });
      this.listOfLenhSanXuat = res;
      // console.log('lsx', res);
    });
  }

  openPopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = true;
  }

  closePopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = false;
  }
  getWorkOrderDetail(id: any, groupId: any): any {
    // console.log({ index: id, idgroup: groupId });
    sessionStorage.setItem('orderId', id);
    sessionStorage.setItem('groupId', groupId);
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
  }

  closePopupConfirmSave(): void {
    this.popupConfirmSave = false;
  }
}
