import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuanLyThietBiComponent } from './quan-ly-thiet-bi.component';

describe('QuanLyThietBiComponent', () => {
  let component: QuanLyThietBiComponent;
  let fixture: ComponentFixture<QuanLyThietBiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuanLyThietBiComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuanLyThietBiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
