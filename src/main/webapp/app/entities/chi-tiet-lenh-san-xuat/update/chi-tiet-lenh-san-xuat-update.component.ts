import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import dayjs from 'dayjs/esm';
import { ApplicationConfigService } from './../../../core/config/application-config.service';
import { Component, Input, OnInit } from '@angular/core';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IChiTietLenhSanXuat } from '../chi-tiet-lenh-san-xuat.model';
import { ChiTietLenhSanXuatService } from '../service/chi-tiet-lenh-san-xuat.service';
import { ILenhSanXuat, LenhSanXuat } from 'app/entities/lenh-san-xuat/lenh-san-xuat.model';
import { LenhSanXuatService } from 'app/entities/lenh-san-xuat/service/lenh-san-xuat.service';
import { AccountService } from 'app/core/auth/account.service';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-chi-tiet-lenh-san-xuat-update',
  templateUrl: './chi-tiet-lenh-san-xuat-update.component.html',
  styleUrls: ['./chi-tiet-lenh-san-xuat-update.component.css'],
})
export class ChiTietLenhSanXuatUpdateComponent implements OnInit {
  resourceUrl = this.applicationConfigService.getEndpointFor('/api/chi-tiet-lenh-san-xuat');
  resourceUrlUpdate = this.applicationConfigService.getEndpointFor('/api/chi-tiet-lenh-san-xuat/update');
  selectedAllResult?: boolean;
  selectedAll = 1;
  checkedList: any;
  @Input() selectedItems: { checked: string }[] = [];
  @Input() storageUnit = '';

  @Input() itemPerPage = 10;
  @Input() itemPerPage2 = 10;

  page?: number;
  page2?: number;

  showScanInput = false;

  sum = 0;

  isSaving = false;
  predicate!: string;
  ascending!: boolean;

  @Input() reelID = '';

  selectedStatus = '';

  changeStatus: {
    id: number;
    totalQuantity: string;
    timeUpdate: dayjs.Dayjs;
    trangThai: string;
  } = { id: 0, totalQuantity: '', timeUpdate: dayjs().startOf('second'), trangThai: '' };

  chiTietLenhSanXuats: IChiTietLenhSanXuat[] = [];
  //tạo danh sách lệnh sản xuất ở trạng thái active
  chiTietLenhSanXuatActive: IChiTietLenhSanXuat[] = [];
  //tạo danh sách lệnh sản xuất không có trong danh sách
  chiTietLenhSanXuatNotList: IChiTietLenhSanXuat[] = [];
  // tạo biến lưu trữ giá trị scan
  @Input() scanResults = '';
  // tạo biến check sự tồn tại trong danh sách
  isExisted = false;
  scanValue: IChiTietLenhSanXuat = {
    id: 0,
    reelID: 'null',
    partNumber: 'null',
    vendor: 'null',
    lot: 'null',
    userData1: 'null',
    userData2: 'null',
    userData3: 'null',
    userData4: 'null',
    userData5: 0,
    initialQuantity: 0,
    msdLevel: '',
    msdInitialFloorTime: '',
    msdBagSealDate: '',
    marketUsage: '',
    quantityOverride: 0,
    shelfTime: '',
    spMaterialName: '',
    warningLimit: '',
    maximumLimit: '',
    comments: '',
    warmupTime: '',
    storageUnit: 'null',
    subStorageUnit: '',
    locationOverride: '',
    expirationDate: 'null',
    manufacturingDate: 'null',
    partClass: '',
    sapCode: 'null',
    trangThai: 'Inactive',
    checked: 1,
  };
  lenhSanXuatsSharedCollection: ILenhSanXuat[] = [];
  scanResult = this.fb.group({
    result: [],
  });

  countScan = 0;
  tienDoScan = 0;
  resultScanPerCent = '';

  editForm = this.fb.group({
    id: [],
    maLenhSanXuat: [null, [Validators.required]],
    sapCode: [],
    sapName: [],
    workOrderCode: [],
    version: [],
    storageCode: [],
    totalQuantity: [],
    createBy: [],
    entryTime: [],
    timeUpdate: [],
    trangThai: [],
    comment: [],
  });

  initialQuantity: any;
  account: Account | null = null;
  constructor(
    protected chiTietLenhSanXuatService: ChiTietLenhSanXuatService,
    protected lenhSanXuatService: LenhSanXuatService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
    });
    // bắt sự kiện scan
    this.scanResult.valueChanges.subscribe(data => {
      console.log('data: ');
    });

    this.activatedRoute.data.subscribe(({ lenhSanXuat }) => {
      console.log('test: ');

      const today = dayjs().startOf('second');
      lenhSanXuat.timeUpdate = today;

      this.changeStatus.id = lenhSanXuat.id;
      this.changeStatus.totalQuantity = lenhSanXuat.totalQuantity;
      // console.log(this.changeStatus);
      this.http.get<any>(`${this.resourceUrl}/${lenhSanXuat.id as number}`).subscribe(res => {
        this.chiTietLenhSanXuats = res;
        // console.log('chi tiet: ', this.chiTietLenhSanXuats);
        //lấy danh sách chi tiết lsx ở trạng thái active
        this.chiTietLenhSanXuatActive = this.chiTietLenhSanXuats.filter(a => a.trangThai === 'Active');
        this.itemPerPage = this.chiTietLenhSanXuatActive.length;
        // sắp xếp danh sách
        this.chiTietLenhSanXuatActive.sort(function (a, b) {
          if (a.checked !== undefined && a.checked !== null && b.checked !== undefined && b.checked !== null) {
            return a.checked - b.checked;
          }
          return 0;
        });
        //lấy danh sách chi tiết lsx không có trong danh sách
        this.chiTietLenhSanXuatNotList = this.chiTietLenhSanXuats.filter(a => a.trangThai === 'not list');
      });
      this.updateForm(lenhSanXuat);
      // this.loadRelationshipsOptions();
    });
  }
  //cập nhật từng mã kho panacim
  test(test: string): void {
    test = '';
    console.log('test:', test);
  }
  //Cập nhật tất cả mã kho panacim
  changeAllStorageUnit(): void {
    this.storageUnit = this.storageUnit.slice(2);
    // console.log("test: ", this.storageUnit)
    for (let i = 0; i < this.chiTietLenhSanXuats.length; i++) {
      const item = this.storageUnit;
      this.chiTietLenhSanXuats[i].storageUnit = item;
    }
    this.storageUnit = '';
  }

  onCheckUnCheckSelectAll(): void {
    if (this.selectedAllResult === true) {
      this.selectedAll = 1;
      for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
        if (this.chiTietLenhSanXuatActive[i].trangThai === 'Active') {
          this.chiTietLenhSanXuatActive[i].checked = this.selectedAll;
        } else {
          this.chiTietLenhSanXuatActive[i].checked = 0;
        }
      }
    } else {
      this.selectedAll = 0;
      for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
        this.chiTietLenhSanXuatActive[i].checked = this.selectedAll;
      }
    }
    // // duyet qua mang chiTietLenhSanXuatActive va cap nhat checked cua moi ptu trong mang checkedList dua tren onSelected()
    // for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
    //   this.chiTietLenhSanXuatActive[i].checked = this.selectedAll;
    // }
    // sau khi cap nhat checkedList goi ham getCheckItemList
    // this.getCheckItemList();
  }

  onCheckAll(): void {
    this.selectedAll = 1;
    for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
      if (this.chiTietLenhSanXuatActive[i].trangThai === 'Active') {
        this.chiTietLenhSanXuatActive[i].checked = this.selectedAll;
      } else {
        this.chiTietLenhSanXuatActive[i].checked = 0;
      }
    }
  }

  onUnCheckAll(): void {
    this.selectedAll = 0;
    for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
      this.chiTietLenhSanXuatActive[i].checked = this.selectedAll;
    }
  }
  // check tung tem 1
  onSelected(id: number, checker: boolean): void {
    //gán giá trị cho các phần tử đã chọn
    for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
      if (i === id) {
        if (checker === true) {
          this.chiTietLenhSanXuatActive[i].checked = 1;
        } else {
          this.chiTietLenhSanXuatActive[i].checked = 0;
        }
      }
    }
    console.log('id: ', id);
    console.log('check: ', checker);
    console.log(this.chiTietLenhSanXuats);
  }

  // cap nhat vao mang checkedList cac ptu chiTietLenhSanXuatActive co thuoc tinh checked
  // duyet qua mang chiTietLenhSanXuatActive, neu 1 ptu duoc chon se them vao checkedList
  getCheckItemList(): void {
    this.checkedList = [];
    for (let i = 0; i < this.chiTietLenhSanXuatActive.length; i++) {
      if (this.chiTietLenhSanXuatActive[i].checked) {
        this.checkedList.push(this.chiTietLenhSanXuatActive[i]);
      }
    }
  }

  previousState(): void {
    window.history.back();
  }

  changeQuantity(): void {
    this.sum = 0;
    for (let i = 0; i < this.chiTietLenhSanXuats.length; i++) {
      if (this.chiTietLenhSanXuats[i].trangThai === 'Active') {
        const result = this.chiTietLenhSanXuats[i].initialQuantity;
        if (result) {
          this.sum += Number(result);
        }
      }
    }
    this.editForm.patchValue({
      totalQuantity: this.sum,
    });
  }

  // ================================  các button ======================================================
  pheDuyetTem(): void {
    this.editForm.patchValue({
      trangThai: 'Đã phê duyệt',
    });
    const lenhSanXuat = this.createFromForm();
    this.lenhSanXuatService.update(lenhSanXuat).subscribe(() => {
      this.http.put<any>(`${this.resourceUrlUpdate}/${this.editForm.get(['id'])!.value as number}`, this.chiTietLenhSanXuats).subscribe();
      alert('Phê duyệt thành công');
      this.previousState();
    });
  }

  khoHuyStatus(): void {
    this.editForm.patchValue({
      trangThai: 'Kho hủy',
    });
    const lenhSanXuat = this.createFromForm();
    this.lenhSanXuatService.update(lenhSanXuat).subscribe(() => {
      this.http.put<any>(`${this.resourceUrlUpdate}/${this.editForm.get(['id'])!.value as number}`, this.chiTietLenhSanXuats).subscribe();
      alert('Kho hủy thành công');
      this.previousState();
    });
  }

  khoTuChoiStatus(): void {
    this.editForm.patchValue({
      trangThai: 'Từ chối',
    });
    const lenhSanXuat = this.createFromForm();
    this.lenhSanXuatService.update(lenhSanXuat).subscribe(() => {
      this.http.put<any>(`${this.resourceUrlUpdate}/${this.editForm.get(['id'])!.value as number}`, this.chiTietLenhSanXuats).subscribe();
      alert('Từ chối thành công');
      this.previousState();
    });
  }
  //================================ chức năng scan mã kho panacim =========================================
  setStorageUnit(storageUnit: string): void {
    storageUnit = storageUnit.slice(2);
    console.log('test: ', storageUnit);
  }

  save(): void {
    this.isSaving = true;
    const lenhSanXuat = this.createFromForm();
    if (lenhSanXuat.id !== undefined) {
      this.subscribeToSaveResponse(this.lenhSanXuatService.update(lenhSanXuat));
      this.http
        .put<any>(`${this.resourceUrlUpdate}/${this.editForm.get(['id'])!.value as number}`, this.chiTietLenhSanXuats)
        .subscribe(() => {
          alert('cập nhật chi tiết lệnh sản xuất thành công!');
          window.location.reload();
        });
    } else {
      this.subscribeToSaveResponse(this.lenhSanXuatService.create(lenhSanXuat));
    }
  }

  trackLenhSanXuatById(_index: number, item: ILenhSanXuat): number {
    return item.id!;
  }

  trackId(_index: number, item: IChiTietLenhSanXuat): number {
    return item.id!;
  }

  subscribeToSaveResponse(result: Observable<HttpResponse<ILenhSanXuat>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  onSaveSuccess(): void {
    // this.previousState();
  }

  onSaveError(): void {
    // Api for inheritance.
  }

  onSaveFinalize(): void {
    this.isSaving = false;
  }

  updateForm(lenhSanXuat: ILenhSanXuat): void {
    this.editForm.patchValue({
      id: lenhSanXuat.id,
      maLenhSanXuat: lenhSanXuat.maLenhSanXuat,
      sapCode: lenhSanXuat.sapCode,
      sapName: lenhSanXuat.sapName,
      workOrderCode: lenhSanXuat.workOrderCode,
      version: lenhSanXuat.version,
      storageCode: lenhSanXuat.storageCode,
      totalQuantity: lenhSanXuat.totalQuantity,
      createBy: lenhSanXuat.createBy,
      entryTime: lenhSanXuat.entryTime ? lenhSanXuat.entryTime.format(DATE_TIME_FORMAT) : null,
      timeUpdate: lenhSanXuat.timeUpdate ? lenhSanXuat.timeUpdate.format(DATE_TIME_FORMAT) : null,
      trangThai: lenhSanXuat.trangThai,
      comment: lenhSanXuat.comment,
    });
  }
  // chuyển hướng con trỏ
  setInputValue(): void {
    this.isExisted = false;
    const input = document.getElementById('scan');
    if (input) {
      input.focus();
    }
  }
  // bắt sự kiện scan
  catchScanEvent(): void {
    this.scanValue = {};
    const test = this.scanResults.split('#');
    for (let i = 0; i < test.length; i++) {
      if (i === 0) {
        this.scanValue.reelID = test[0];
      }
      if (i === 1) {
        this.scanValue.partNumber = test[i];
      }
      if (i === 2) {
        this.scanValue.vendor = test[i];
      }
      if (i === 3) {
        this.scanValue.lot = test[i];
      }
      if (i === 4) {
        this.scanValue.userData1 = test[i];
      }
      if (i === 5) {
        this.scanValue.userData2 = test[i];
      }
      if (i === 6) {
        test[i] = 'null';
        this.scanValue.userData3 = test[i];
      }
      if (i === 7) {
        this.scanValue.userData4 = test[i];
      }
      if (i === 8) {
        this.scanValue.userData5 = Number(test[i]);
      }
      if (i === 9) {
        this.scanValue.initialQuantity = Number(test[i]);
      }
      if (i === 10) {
        this.scanValue.quantityOverride = Number(test[i]);
      }
      if (i === 11) {
        this.scanValue.storageUnit = test[i];
      }
      if (i === 12) {
        this.scanValue.expirationDate = test[i];
      }
      if (i === 13) {
        this.scanValue.manufacturingDate = test[i];
      }
      if (i === 14) {
        this.scanValue.sapCode = test[i];
      }
    }
    // check ma lenh san xuat
    // if (String(this.scanValue.userData5) === this.editForm.get(['maLenhSanXuat'])!.value) {
    // check trong danh sách
    for (let i = 0; i < this.chiTietLenhSanXuats.length; i++) {
      // có trong danh sách
      if (this.scanValue.reelID === this.chiTietLenhSanXuats[i].reelID && this.chiTietLenhSanXuats[i].trangThai === 'Active') {
        this.isExisted = true;
        this.chiTietLenhSanXuats[i].checked = 1;
        this.countScan++;

        this.tienDoScan = (this.countScan / this.chiTietLenhSanXuatActive.length) * 100;
        this.resultScanPerCent = this.tienDoScan.toFixed(0);
        this.alertTimeout('Đã tìm thấy tem trong danh sách lệnh', 5000);
        // alert('đã tìm thấy tem trong danh sách');
        break;
      }
      // có trong danh sách nhưng ở trạng thái deactive
      if (this.scanValue.reelID === this.chiTietLenhSanXuats[i].reelID && this.chiTietLenhSanXuats[i].trangThai === 'Inactive') {
        this.isExisted = true;
        this.chiTietLenhSanXuats[i].checked = 1;
        this.alertTimeout('Tem đang ở trạng thái Inactive', 5000);
        // alert('Tem đang ở trạng thái Inactive');
        break;
      }
      if (this.scanValue.reelID === this.chiTietLenhSanXuats[i].reelID && this.chiTietLenhSanXuats[i].trangThai === 'not list') {
        this.isExisted = true;
        this.chiTietLenhSanXuats[i].checked = 1;
        this.alertTimeout('Tem đang ở trạng thái not list', 5000);
        // alert('Tem đang ở trạng thái not list');
        break;
      }
    }
    //không nằm trong danh sách
    if (this.isExisted === false) {
      // this.scanValue.comments = 'not list';
      const item: IChiTietLenhSanXuat = {
        id: 0,
        reelID: this.scanValue.reelID,
        partNumber: this.scanValue.partNumber,
        vendor: this.scanValue.vendor,
        lot: this.scanValue.lot,
        userData1: this.scanValue.userData1,
        userData2: this.scanValue.userData2,
        userData3: this.scanValue.userData3,
        userData4: this.scanValue.userData4,
        userData5: this.scanValue.userData5,
        initialQuantity: this.scanValue.initialQuantity,
        msdLevel: '',
        msdInitialFloorTime: '',
        msdBagSealDate: '',
        marketUsage: '',
        quantityOverride: this.scanValue.quantityOverride,
        shelfTime: '',
        spMaterialName: '',
        warningLimit: '',
        maximumLimit: '',
        comments: '',
        warmupTime: '',
        storageUnit: this.scanValue.storageUnit,
        subStorageUnit: '',
        locationOverride: '',
        expirationDate: this.scanValue.expirationDate,
        manufacturingDate: this.scanValue.manufacturingDate,
        partClass: '',
        sapCode: this.scanValue.sapCode,
        trangThai: 'not list',
        checked: 1,
        lenhSanXuat: this.createFromForm(),
      };
      this.chiTietLenhSanXuats.push(item);
      this.alertTimeout('Tem không nằm trong danh sách', 5000);
    }
    //cập nhật lại danh sách chi tiết lsx ở trạng thái active
    this.chiTietLenhSanXuatActive = this.chiTietLenhSanXuats.filter(a => a.trangThai === 'Active');
    // sắp xếp danh sách
    this.chiTietLenhSanXuatActive.sort(function (a, b) {
      if (a.checked !== undefined && a.checked !== null && b.checked !== undefined && b.checked !== null) {
        return a.checked - b.checked;
      }
      return 0;
    });
    //cập nhật lại danh sách chi tiết lsx không có trong danh sách
    this.chiTietLenhSanXuatNotList = this.chiTietLenhSanXuats.filter(a => a.trangThai === 'not list');
    this.scanResults = '';
    // } else {
    //   this.alertTimeout('Tem không nằm trong mã lệnh sản xuất', 2000);
    //   this.scanResults = '';
    //   // alert('Tem không nằm trong mã lệnh sản xuất');
    // }
  }
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
  createFromForm(): ILenhSanXuat {
    return {
      ...new LenhSanXuat(),
      id: this.editForm.get(['id'])!.value,
      maLenhSanXuat: this.editForm.get(['maLenhSanXuat'])!.value,
      sapCode: this.editForm.get(['sapCode'])!.value,
      sapName: this.editForm.get(['sapName'])!.value,
      workOrderCode: this.editForm.get(['workOrderCode'])!.value,
      version: this.editForm.get(['version'])!.value,
      storageCode: this.editForm.get(['storageCode'])!.value,
      totalQuantity: this.editForm.get(['totalQuantity'])!.value,
      createBy: this.account?.login,
      entryTime: this.editForm.get(['entryTime'])!.value ? dayjs(this.editForm.get(['entryTime'])!.value, DATE_TIME_FORMAT) : undefined,
      timeUpdate: this.editForm.get(['timeUpdate'])!.value ? dayjs(this.editForm.get(['timeUpdate'])!.value, DATE_TIME_FORMAT) : undefined,
      trangThai: this.editForm.get(['trangThai'])!.value,
      comment: this.editForm.get(['comment'])!.value,
    };
  }
}
