import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrcodePaymentComponent } from './qrcode-payment.component';

describe('QrcodePaymentComponent', () => {
  let component: QrcodePaymentComponent;
  let fixture: ComponentFixture<QrcodePaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QrcodePaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QrcodePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
