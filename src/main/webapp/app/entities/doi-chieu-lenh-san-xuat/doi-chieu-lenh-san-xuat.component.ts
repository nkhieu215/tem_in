import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { ScanCheckComponent } from './scan-check.component';
import { SharedDataService } from './shared-data.service';

@Component({
  selector: 'jhi-doi-chieu-lenh-san-xuat',
  templateUrl: './doi-chieu-lenh-san-xuat.component.html',
  styleUrls: ['./doi-chieu-lenh-san-xuat.component.scss'],
})
export class DoiChieuLenhSanXuatComponent implements OnInit {
  doiChieuLenhSanXuatUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order/groupId');
  WorkOrderDetailUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order');
  tongHopURL = this.applicationConfigService.getEndpointFor('api/tong-hop');

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

  totalPass = 0;
  totalFail = 0;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    private sharedDataService: SharedDataService,
    protected scanCheck: ScanCheckComponent // private scanCheck: ScanCheckComponent
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
          item.trangThai = 'active';
        } else if (item.trangThai === 1) {
          item.trangThai = 'deactive';
        }
      });
      this.listOfLenhSanXuat = res;
      console.log('lsx', res);
      for (let i = 0; i < this.listOfLenhSanXuat.length; i++) {
        this.listOfLenhSanXuat[i].totalFail = 0;
        this.listOfLenhSanXuat[i].totalPass = 0;
        this.http.get<any>(`${this.tongHopURL}/${this.listOfLenhSanXuat[i].orderId as string}`).subscribe((res2: any[]) => {
          if (res2.length > 0) {
            for (let j = 0; j < res2.length; j++) {
              if (res2[j].result === 'NG') {
                this.listOfLenhSanXuat[i].totalFail = res2[j].recordValue;
              } else {
                this.listOfLenhSanXuat[i].totalPass = res2[j].recordValue;
              }
            }
          }
          // console.log('ng', this.listOfLenhSanXuat)
          // console.log('ng', res2)
        });
      }
    });
  }

  openPopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = true;
  }

  closePopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = false;
  }
  getWorkOrderDetail(id: any, groupId: any): any {
    console.log({ index: id, idgroup: groupId });
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
