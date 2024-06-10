import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { DoiChieuLenhSanXuatComponent } from './doi-chieu-lenh-san-xuat.component';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { HttpClient } from '@angular/common/http';
import { AccountService } from 'app/core/auth/account.service';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ChartOptions } from 'chart.js';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';
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
  profileURL = this.applicationConfigService.getEndpointFor('api/profile-check');

  //btn
  start = true;
  pause = true;
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  title = 'ScanSystem';
  result = '';
  dataWorkOrder: any[] = [{}];
  checkValue = '';
  checkName = '';
  scanValue = '';
  totalScans = 0;
  totalPass = 0;
  totalFail = 0;
  rateCompleted = '';
  runTime = 0;
  stopTime = 0;
  timer: any;
  elapsedTime = 0;
  stationName = 'BG XK03';
  running = false;
  numberPlan = this.dataWorkOrder[0].sanLuong;
  timeRecord = '';
  scanHistory: {
    recordValue: string;
    status: string;
    stationName: 'BG XK03';
    machineId: number;
    recordName: string;
    result: string;
    position: number;
    username: string;
    orderId: number;
    timeRecorded: string;
  }[] = [];
  public pieChart: GoogleChartInterface = {
    chartType: GoogleChartType.PieChart,
    dataTable: [
      ['Parameters', 'Count'],
      ['PASS', 1],
      ['NG', 0],
    ],
    //firstRowIsData: true,
    options: {
      title: 'Biểu đồ thống kê',
      width: '900',
      height: '900',
    },
  };
  public lastTime = Date.now();
  public lastCmd = null;
  // public pieChartLabels = ['NG', 'PASS',];
  // public pieChartDatasets = [
  //   {
  //     data: [0, 1],

  //   },
  // ];
  // public lineChartOptions: ChartOptions<'pie'> = {
  //   responsive: false,
  //   maintainAspectRatio: true,
  //   plugins: {
  //     datalabels: {
  //       display: true,
  //       align: 'center',
  //       anchor: 'center',
  //       formatter: (value: any, context: any) => {
  //         const data: any[] = context.chart.data.datasets[0].data
  //         //Khởi tạo biến chứa kết quả tính tổng
  //         let total = 0;
  //         data.forEach((element: any) => {
  //           total += element.value
  //         });
  //         // console.log(total)
  //         //Khởi tạo biến chứa kết quả tính toán %
  //         const percenTageValue = (value.value / total * 100).toFixed(2)
  //         return `${percenTageValue}%`
  //       },
  //       font: {
  //         size: 20
  //       }
  //     }
  //   }
  // };
  // public pieChartLegend = true;
  // public pieChartPlugins = [pluginDataLabels];

  popupChiTietThongTinScan = false;
  popupConfirmSave = false;

  @Input() machineId = '';
  @Input() position = '';
  @Input() itemPerPage = 5;
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
      this.http.get<any>(`${this.userLoginlUrl}/${item as string}`).subscribe(res1 => {
        this.dataUser = res1;
        console.log('login', res1);
      });
      this.http.get<any>(`${this.tongHopURL}/${item as string}`).subscribe((res2: any[]) => {
        if (res2.length === 1) {
          if (res2[0].recordName === 'NG') {
            this.totalFail = Number(res2[0].recordValue);
            this.totalPass = 0;
            this.totalScans = this.totalFail + this.totalPass;
            this.rateCompleted = ((this.totalScans / Number(this.numberPlan)) * 100).toFixed(3);
          } else {
            this.totalFail = 0;
            this.totalPass = Number(res2[0].recordValue);
            this.totalScans = this.totalFail + this.totalPass;
            this.rateCompleted = ((this.totalScans / Number(this.numberPlan)) * 100).toFixed(3);
          }
        } else {
          this.totalFail = Number(res2[0].recordValue);
          this.totalPass = Number(res2[1].recordValue);
          this.totalScans = this.totalFail + this.totalPass;
          this.rateCompleted = ((this.totalScans / Number(this.numberPlan)) * 100).toFixed(3);
        }
        console.log('tonghop', this.totalFail, this.totalPass, this.totalScans);
      });
      this.http.get<any>(`${this.profileURL}/${this.dataWorkOrder[0].productId as string}`).subscribe(res3 => {
        this.checkValue = res3.checkValue;
        this.checkName = res3.checkName;
        console.log('profile', this.checkValue);
      });
    });
  }

  async onScan(): Promise<any> {
    console.log({ ttscan: this.totalScans, number: this.numberPlan });
    if (this.scanValue.trim()) {
      this.totalScans++;
      const status = this.scanValue === this.checkValue ? 'PASS' : 'NG';
      this.scanHistory = [
        {
          recordValue: this.scanValue,
          status,
          stationName: 'BG XK03',
          recordName: this.checkName,
          result: status,
          position: 1,
          username: this.account.login,
          machineId: 2,
          orderId: this.dataWorkOrder[0].orderId,
          timeRecorded: this.timeRecord,
        },
      ];

      this.rateCompleted = ((this.totalScans / Number(this.numberPlan)) * 100).toFixed(3);
      if (status === 'PASS') {
        this.totalPass++;
        this.http.post<any>(this.DetaiChecklUrl, this.scanHistory).subscribe();
        console.log('luu PASS thanh cong');
      } else {
        await this.playAlertSound();
        // setTimeout(() => {
        //   alert(this.scanValue + 'không chính xác vui lòng kiểm tra lại!!!');
        // }, 0);
        this.totalFail++;
        this.warningNG(this.scanValue);
        this.http.post<any>(this.DetaiChecklUrl, this.scanHistory).subscribe();
        console.log('luu NG thanh cong');
      }
      this.pieChart.dataTable = [
        ['Parameters', 'Count'],
        ['PASS', this.totalPass],
        ['NG', this.totalFail],
      ];
      // this.pieChartDatasets = [
      //   {
      //     data: [this.totalFail, this.totalPass],
      //   },
      // ];

      this.scanValue = ''; // Xóa dữ liệu trong ô input
      if (this.totalScans % 10 === 0) {
        this.scanHistory = [];
      }

      if (this.totalScans % 10 === 0) {
        // this.postData();
      }
    }
  }
  getFormattedElapsedTime(): any {
    const hours = Math.floor(this.elapsedTime / 3600);
    const minutes = Math.floor((this.elapsedTime % 3600) / 60);
    const seconds = this.elapsedTime % 60;
    this.timeRecord = `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
    return this.timeRecord;
  }
  pad(num: number): string {
    return num.toString().padStart(2, '0');
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
