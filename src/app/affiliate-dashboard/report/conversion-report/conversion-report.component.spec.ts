import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversionReportComponent } from './conversion-report.component';

describe('ConversionReportComponent', () => {
  let component: ConversionReportComponent;
  let fixture: ComponentFixture<ConversionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConversionReportComponent]
    });
    fixture = TestBed.createComponent(ConversionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
