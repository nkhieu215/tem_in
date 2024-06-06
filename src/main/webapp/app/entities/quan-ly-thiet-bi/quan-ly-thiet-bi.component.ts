import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-quan-ly-thiet-bi',
  templateUrl: './quan-ly-thiet-bi.component.html',
  styleUrls: ['./quan-ly-thiet-bi.component.scss'],
})
export class QuanLyThietBiComponent implements OnInit {
  listOfGroupMachineURL = this.applicationConfigService.getEndpointFor('api/scan-group-machines');

  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  popupNhomThietBi = false;
  popupThemMoiThietBi = false;
  popupConfirmSave = false;
  popupConfirmSave2 = false;
  popupConfirmSave3 = false;

  // formSearch = this.formBuilder.group({
  //   groupName: '',
  //   createedAt: '',
  //   updatedAt: '',
  //   username: '',
  //   groupStatus: '',
  // });

  @Input() groupName = '';
  @Input() createdAt = '';
  @Input() updatedAt = '';
  @Input() userName = '';
  @Input() groupStatus = '';
  @Input() machineId = '';
  @Input() machineName = '';
  // quản lý thiết bị
  listOfGroupMachine: any[] = [];
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
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
    this.http.get<any>(this.listOfGroupMachineURL).subscribe(res => {
      this.listOfGroupMachine = res;
      console.log('TB', res);
    });
  }

  openPopupNhomThietBi(): void {
    this.popupNhomThietBi = true;
  }

  closePopupNhomThietBi(): void {
    this.popupNhomThietBi = false;
  }

  openPopupThemMoiThietBi(): void {
    this.popupThemMoiThietBi = true;
  }

  closePopupThemMoiThietBi(): void {
    this.popupThemMoiThietBi = false;
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
  }

  closePopupConfirmSave(): void {
    this.popupConfirmSave = false;
  }

  openPopupConfirmSave2(): void {
    this.popupConfirmSave2 = true;
  }

  closePopupConfirmSave2(): void {
    this.popupConfirmSave2 = false;
  }

  openPopupConfirmSave3(): void {
    this.popupConfirmSave2 = true;
  }

  closePopupConfirmSave3(): void {
    this.popupConfirmSave2 = false;
  }
}
