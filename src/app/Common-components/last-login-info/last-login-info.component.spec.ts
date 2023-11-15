import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastLoginInfoComponent } from './last-login-info.component';

describe('LastLoginInfoComponent', () => {
  let component: LastLoginInfoComponent;
  let fixture: ComponentFixture<LastLoginInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastLoginInfoComponent]
    });
    fixture = TestBed.createComponent(LastLoginInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
