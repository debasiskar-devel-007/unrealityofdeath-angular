import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignmodalComponent } from './campaignmodal.component';

describe('CampaignmodalComponent', () => {
  let component: CampaignmodalComponent;
  let fixture: ComponentFixture<CampaignmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CampaignmodalComponent]
    });
    fixture = TestBed.createComponent(CampaignmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
