import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-doi-chieu-lenh-san-xuat',
  templateUrl: './doi-chieu-lenh-san-xuat.component.html',
  styleUrls: ['./doi-chieu-lenh-san-xuat.component.scss'],
})
export class DoiChieuLenhSanXuatComponent implements OnInit {
  doiChieuLenhSanXuatUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order/groupId');
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;
  doiChieuLenhSanXuats?: any[];

  popupChiTietThongTinScan = false;

  @Input() workOrder = '';
  @Input() lot = '';
  @Input() machineId = '';
  @Input() productCode = '';
  @Input() productName = '';
  @Input() working = '';
  @Input() createdAt = '';
  @Input() position = '';
  @Input() checkValue = '';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected applicationConfigService: ApplicationConfigService
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
    setInterval(() => {
      console.log('ressss');
    }, 1000);
  }

  openPopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = true;
  }

  closePopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = false;
  }
}
