import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoiChieuLenhSanXuatComponent } from './doi-chieu-lenh-san-xuat.component';

describe('DoiChieuLenhSanXuatComponent', () => {
  let component: DoiChieuLenhSanXuatComponent;
  let fixture: ComponentFixture<DoiChieuLenhSanXuatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoiChieuLenhSanXuatComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoiChieuLenhSanXuatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
