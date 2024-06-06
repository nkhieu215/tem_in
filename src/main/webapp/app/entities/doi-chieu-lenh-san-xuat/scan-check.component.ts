import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';

@Component({
  selector: 'jhi-scan-check',
  templateUrl: './scan-check.component.html',
  styleUrls: ['./scan-check.component.scss'],
})
export class ScanCheckComponent implements OnInit {
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  title = 'ScanSystem';

  dataWorkOrder = [
    {
      productCode: '00047261',
      productName: 'Bộ đèn LED M66 1200/60W 6500K',
      workOrder: 'WO-88409-1',
      lot: '240601130006A',
      machineCode: 'LR-XK01',
      status: 'Waiting',
      runTime: '45324',
      numberOfplan: 2000,
    },
  ];
  checkValue = 'N14662';
  scanValue = '';

  scanHistory: { value: string; status: string; stationName: 'BG XK04'; valueCheck: 'productName' }[] = [];
  totalScans = 0;
  totalPass = 0;
  totalFail = 0;
  rateCompleted = 0;
  runTime = 0;
  stopTime = 0;
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
  dataUser = [
    { username: 'RD002043', timeLogin: '2024-06-05 10:00' },
    { username: 'RD002044', timeLogin: '2024-06-05 11:00' },
    { username: 'RD002045', timeLogin: '2024-06-05 14:00' },
  ];

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

  async onScan(): Promise<any> {
    if (this.scanValue.trim()) {
      this.totalScans++;
      const status = this.scanValue === this.checkValue ? 'Pass' : 'Fail';
      this.scanHistory.push({ value: this.scanValue, status, stationName: 'BG XK04', valueCheck: 'productName' });
      this.rateCompleted = this.totalScans / this.dataWorkOrder[0].numberOfplan;
      if (status === 'Pass') {
        this.totalPass++;
      } else {
        this.totalFail++;
        await this.playAlertSound();
        setTimeout(() => {
          alert(this.scanValue + 'không chính xác vui lòng kiểm tra lại!!!');
        }, 0);

        //this.warningNG(this.scanValue);
      }
      this.pieChartDatasets = [
        {
          data: [this.totalFail, this.totalPass],
        },
      ];
      this.scanValue = ''; // Xóa dữ liệu trong ô input
    }
  }

  warningNG(stringA: string): void {
    alert(stringA + ' sai vui lòng kiểm tra lại!');
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
    this.dataWorkOrder[0].status = 'Running';
  }
  btnPause(): void {
    this.dataWorkOrder[0].status = 'Pause';
  }
  btnFinish(): void {
    this.dataWorkOrder[0].status = 'Finish';
  }
}
