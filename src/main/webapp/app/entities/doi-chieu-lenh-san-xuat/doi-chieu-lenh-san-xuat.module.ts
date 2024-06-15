import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { DoiChieuLenhSanXuatComponent } from './doi-chieu-lenh-san-xuat.component';
import { ScanCheckComponent } from './scan-check.component';
import { NgChartsModule } from 'ng2-charts';
import { GoogleChartComponent, Ng2GoogleChartsModule } from 'ng2-google-charts';

const doiChieuLenhSanXuatRoute: Routes = [
  {
    path: '',
    component: DoiChieuLenhSanXuatComponent,
  },
  {
    path: 'scan-check',
    component: ScanCheckComponent,
  },
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(doiChieuLenhSanXuatRoute),
    NgxPaginationModule,
    FormsModule,
    NgChartsModule,
    Ng2GoogleChartsModule,
  ],
  declarations: [DoiChieuLenhSanXuatComponent, ScanCheckComponent],
  exports: [RouterModule],
  providers: [ScanCheckComponent],
})
export class DoiChieuLenhSanXuatModule {}
