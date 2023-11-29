import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardReportModalComponent } from './dashboard-report-modal.component';

describe('DashboardReportModalComponent', () => {
  let component: DashboardReportModalComponent;
  let fixture: ComponentFixture<DashboardReportModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardReportModalComponent]
    });
    fixture = TestBed.createComponent(DashboardReportModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
