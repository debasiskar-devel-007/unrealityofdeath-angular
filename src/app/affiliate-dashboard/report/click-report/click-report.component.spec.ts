import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickReportComponent } from './click-report.component';

describe('ClickReportComponent', () => {
  let component: ClickReportComponent;
  let fixture: ComponentFixture<ClickReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickReportComponent]
    });
    fixture = TestBed.createComponent(ClickReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
