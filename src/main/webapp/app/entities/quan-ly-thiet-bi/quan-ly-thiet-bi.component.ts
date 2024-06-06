import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-quan-ly-thiet-bi',
  templateUrl: './quan-ly-thiet-bi.component.html',
  styleUrls: ['./quan-ly-thiet-bi.component.scss'],
})
export class QuanLyThietBiComponent implements OnInit {
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  popupNhomThietBi = false;
  popupThemMoiThietBi = false;
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

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder
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
}
