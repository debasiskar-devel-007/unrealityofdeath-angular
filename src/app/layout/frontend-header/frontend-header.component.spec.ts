import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendHeaderComponent } from './frontend-header.component';

describe('FrontendHeaderComponent', () => {
  let component: FrontendHeaderComponent;
  let fixture: ComponentFixture<FrontendHeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FrontendHeaderComponent]
    });
    fixture = TestBed.createComponent(FrontendHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
