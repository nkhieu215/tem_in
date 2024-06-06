import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DoiChieuLenhSanXuatComponent } from './doi-chieu-lenh-san-xuat.component';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-scan-check',
  templateUrl: './scan-check.component.html',
  styleUrls: ['./scan-check.component.scss'],
})
export class ScanCheckComponent implements OnInit {
  WorkOrderDetailUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order');
  DetaiChecklUrl = this.applicationConfigService.getEndpointFor('api/scan-work-order/detail');
  userLoginlUrl = this.applicationConfigService.getEndpointFor('api/user-login-history');
  listOfMachineURL = this.applicationConfigService.getEndpointFor('api/scan-machines');
  tongHopURL = this.applicationConfigService.getEndpointFor('api/tong-hop');

  //btn
  start = true;
  pause = true;
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  title = 'ScanSystem';

  dataWorkOrder: any[] = [{}];
  checkValue = 'N14662';
  scanValue = '';
  totalScans = 0;
  totalPass = 0;
  totalFail = 0;
  rateCompleted = '';
  runTime = 0;
  stopTime = 0;
  timer: any;
  elapsedTime = 0;
  running = false;
  numberPlan = this.dataWorkOrder[0].sanLuong;
  scanHistory: { value: string; status: string; stationName: 'BG XK04'; valueCheck: 'productName' }[] = [];

  public lastTime = Date.now();
  public lastCmd = null;
  public pieChartLabels = ['NG', 'PASS'];
  public pieChartDatasets = [
    {
      data: [0, 1],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  popupChiTietThongTinScan = false;
  popupConfirmSave = false;

  @Input() machineId = '';
  @Input() position = '';
  dataUser = [{ username: '', timeLogin: '' }];
  // acount
  account: any;
  // Thiet bi
  listOfMachines: any[] = [];
  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected applicationConfigService: ApplicationConfigService,
    protected http: HttpClient,
    protected accountService: AccountService
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
    this.accountService.identity().subscribe(account => {
      this.account = account;
      console.log('acc', this.account);
    });
    const item = sessionStorage.getItem('orderId');
    this.http.get<any>(`${this.WorkOrderDetailUrl}/${item as string}`).subscribe(res => {
      this.dataWorkOrder[0] = res;
      this.numberPlan = this.dataWorkOrder[0].sanLuong;
      if (this.dataWorkOrder[0].trangThai === 0) {
        this.dataWorkOrder[0].trangThai = 'waiting';
      }
      console.log('detail', this.dataWorkOrder[0]);
    });
    this.http.get<any>(`${this.userLoginlUrl}/${item as string}`).subscribe(res => {
      this.dataUser = res;
      console.log('login', res);
    });
    this.http.get<any>(`${this.tongHopURL}/${item as string}`).subscribe(res => {
      this.dataUser = res;
      console.log('tonghop', res);
    });
  }

  async onScan(): Promise<any> {
    console.log({ ttscan: this.totalScans, number: this.numberPlan });
    if (this.scanValue.trim()) {
      this.totalScans++;
      const status = this.scanValue === this.checkValue ? 'Pass' : 'Fail';
      this.scanHistory.push({ value: this.scanValue, status, stationName: 'BG XK04', valueCheck: 'productName' });

      this.rateCompleted = (this.totalScans / Number(this.numberPlan)).toFixed(3);
      if (status === 'Pass') {
        this.totalPass++;
      } else {
        await this.playAlertSound();
        // setTimeout(() => {
        //   alert(this.scanValue + 'không chính xác vui lòng kiểm tra lại!!!');
        // }, 0);
        this.totalFail++;
        this.warningNG(this.scanValue);
      }
      this.pieChartDatasets = [
        {
          data: [this.totalFail, this.totalPass],
        },
      ];

      this.scanValue = ''; // Xóa dữ liệu trong ô input
      if (this.totalScans % 10 === 0) {
        // this.http.post<any>(this.DetaiChecklUrl,this.scanHistory).subscribe(()=>{
        //   console.log("luu thanh cong");
        // })
        this.scanHistory = [];
      }

      if (this.totalScans % 10 === 0) {
        // this.postData();
      }
    }
  }

  warningNG(stringA: string): void {
    alert(stringA + ' không chính xác vui lòng kiểm tra lại!!!');
  }
  playAlertSound(): any {
    return new Promise<void>(resolve => {
      const audio = new Audio();
      audio.src = '../../../content/images/beep_warning.mp3';
      audio.load();
      audio.play();
      audio.onended = () => {
        resolve();
      };
    });
  }

  btnStart(): void {
    document.getElementById('scanCheck')?.focus();
    this.dataWorkOrder[0].trangThai = 'Running';
    this.running = true;
    this.timer = setInterval(() => {
      this.elapsedTime++;
    }, 1000);
    const currentTime = new Date().toLocaleString();
    this.dataUser.push({ username: this.account.login, timeLogin: currentTime });
  }
  btnPause(): void {
    this.dataWorkOrder[0].trangThai = 'Pause';
    this.running = false;
    clearInterval(this.timer);
  }
  btnFinish(): void {
    this.dataWorkOrder[0].trangThai = 'Finish';
    this.running = false;
    clearInterval(this.timer);
  }

  openPopupChiTietThongTinScan(): void {
    const groupId = sessionStorage.getItem('groupId');
    this.http.get<any>(`${this.listOfMachineURL}/${groupId as string}`).subscribe(res => {
      this.listOfMachines = res;
      console.log('machinessss:', res);
    });
    this.popupChiTietThongTinScan = true;
  }

  closePopupChiTietThongTinScan(): void {
    this.popupChiTietThongTinScan = false;
  }

  previousState(): void {
    window.history.back();
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
  }

  closePopupConfirmSave(): void {
    this.popupConfirmSave = false;
  }
}
