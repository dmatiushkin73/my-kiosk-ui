import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PAYMENT_METHOD } from '../app.constants';

@Component({
  selector: 'app-paymethod',
  templateUrl: './paymethod.component.html',
  styleUrls: ['./paymethod.component.scss']
})
export class PaymethodComponent implements OnInit {

  cardMethodEnabled = false;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<PaymethodComponent>) {
      iconRegistry.addSvgIcon('cancel', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
      iconRegistry.addSvgIcon('qr-code', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/qr_code.svg'));
      iconRegistry.addSvgIcon('card', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/credit_card.svg'));
    }

  ngOnInit(): void {
  }

  onQRCodeSelected() {
    this.dialogRef.close(PAYMENT_METHOD.QR_CODE);
  }

  onCreditCardSelected() {
    this.dialogRef.close(PAYMENT_METHOD.CREDIT_CARD);
  }
}
