import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CartService } from '../services/cart.service';
import { appear } from '../app.animation';
import { environment } from 'src/environments/environment';
import { TRANSACTION_LIFE_TIME } from '../app.constants';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-qrcode-payment',
  templateUrl: './qrcode-payment.component.html',
  styleUrls: ['./qrcode-payment.component.scss'],
  animations: [
    appear()
  ]
})
export class QrcodePaymentComponent implements OnInit {

  totalNumber = 0;
  totalCost = "";
  paymentLink?: string;
  countDown = TRANSACTION_LIFE_TIME;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<QrcodePaymentComponent>,
    private cartService: CartService,
    private sessionService: SessionService,
    private snackBar: MatSnackBar) {
      iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
    }

  ngOnInit(): void {
    this.totalNumber = this.cartService.getNumberOfItemsInCart();
    this.totalCost = this.cartService.getCartTotal();
    this.buildPaymentLink();
    this.sessionService.watchTransactionCountDown().subscribe({
      next: (v) => {
        this.countDown = v;
        if (v == 0) {
          this.dialogRef.close("timeout");
        }
      }
    });
  }

  private async buildPaymentLink() {
    let v = await this.cartService.getTransactionId();
    if (v != "") {
      this.paymentLink = `${environment.urlPaymentPortal}/payment/${v}/processing`;
    }
    else {
      this.paymentLink = undefined;
      this.snackBar.open(this.cartService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'errmsg-panel'
      });
    }
  }

}
