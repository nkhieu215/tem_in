// shared/services/responsive.service.ts
import { Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ResponsiveService {
  isHandset$ = this.bp.observe(Breakpoints.Handset).pipe(map(r => r.matches));
  isTablet$ = this.bp.observe(Breakpoints.Tablet).pipe(map(r => r.matches));
  isWeb$ = this.bp.observe(Breakpoints.Web).pipe(map(r => r.matches));
  constructor(private bp: BreakpointObserver) {}
}
