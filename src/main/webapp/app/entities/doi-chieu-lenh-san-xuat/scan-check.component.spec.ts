import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanCheckComponent } from './scan-check.component';

describe('ScanCheckComponent', () => {
  let component: ScanCheckComponent;
  let fixture: ComponentFixture<ScanCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScanCheckComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScanCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
