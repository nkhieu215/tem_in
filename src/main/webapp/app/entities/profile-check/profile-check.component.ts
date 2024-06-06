import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-profile-check',
  templateUrl: './profile-check.component.html',
  styleUrls: ['./profile-check.component.scss'],
})
export class ProfileCheckComponent implements OnInit {
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  @Input() productCode = '';
  @Input() productName = '';
  @Input() createdAt = '';
  @Input() updatedAt = '';
  @Input() username = '';
  @Input() productStatus = '';

  popupKhaiBaoProfile = false;

  constructor(protected activatedRoute: ActivatedRoute, protected router: Router, protected modalService: NgbModal) {}

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

  openPopupKhaiBaoProfile(): void {
    this.popupKhaiBaoProfile = true;
  }

  closePopupKhaiBaoProfile(): void {
    this.popupKhaiBaoProfile = false;
  }
}