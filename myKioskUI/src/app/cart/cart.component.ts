import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CartData } from '../models/interfaces';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CartService } from '../services/cart.service';
import { PaymethodComponent } from '../paymethod/paymethod.component';
import { PAYMENT_METHOD } from '../app.constants';
import { QrcodePaymentComponent } from '../qrcode-payment/qrcode-payment.component';
import { SessionService } from '../services/session.service';
import { MachineService } from '../services/machine.service';
import { MACHINE_STATUS } from '../models/wsmessage';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {

  cartContents?: CartData[];
  total!: string;
  buyNow: boolean;
  enabled = true;
  paymentMethodDlgRef?: MatDialogRef<PaymethodComponent>;
  qrCodeCheckoutDlgRef?: MatDialogRef<QrcodePaymentComponent>;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<CartComponent>,
    private cartService: CartService,
    private sessionService: SessionService,
    private machineService: MachineService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: {buyNow: boolean}) {
      iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clear.svg'));
      iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
      iconRegistry.addSvgIcon('checkout', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/checkout.svg'));
      iconRegistry.addSvgIcon('trash', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/trash.svg'));
      this.buyNow = data.buyNow;
  }

  ngOnInit(): void {
    this.refreshData();
    if (this.buyNow) {
      setTimeout(() => {
        this.onCheckoutClick();
      }, 250);
    }
    this.enabled = this.machineService.getMachineStatus() == MACHINE_STATUS.AVAILABLE;
    this.machineService.watchMachineStatus()
    .subscribe({
      next: (ms) => {
        this.enabled = ms == MACHINE_STATUS.AVAILABLE;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.paymentMethodDlgRef) {
      this.paymentMethodDlgRef.close();
    }
  }

  private refreshData() {
    this.cartContents = this.cartService.getCartContents();
    if (this.cartContents.length == 0) {
      this.cartContents = undefined;
    }
    this.total = this.cartService.getCartTotal();
  }

  onMinusClick(cartItem: CartData) {
    this.cartService.decrementItemInCart(cartItem.id)
    .then((v) => {
      this.refreshData();
    });
  }

  onPlusClick(cartItem: CartData) {
    this.cartService.incrementItemInCart(cartItem.id)
    .then((v) => {
      this.refreshData();
    });
  }

  onRemoveClick(cartItem: CartData) {
    this.cartService.removeItemFromCart(cartItem.id)
    .then((v) => {
      this.refreshData();
    });
  }

  onClearClick() {
    this.cartService.clearCart()
    .then((v) => {
      this.refreshData();
    });
  }

  onCheckoutClick() {
    this.paymentMethodDlgRef = this.dialog.open(PaymethodComponent, {
      maxWidth: "600px",
      maxHeight: "400px"
    });
    this.paymentMethodDlgRef.afterClosed().subscribe((result) => {
      if (result === PAYMENT_METHOD.QR_CODE) {
        this.sessionService.stopSession();
        this.qrCodeCheckoutDlgRef = this.dialog.open(QrcodePaymentComponent, {
          maxWidth: "80vw",
          maxHeight: "80vh",
          disableClose: true
        });
        this.sessionService.startTransactionCoundDown();
        this.qrCodeCheckoutDlgRef.afterClosed().subscribe((result) => {
          this.sessionService.stopTransactionCountDown();
          this.sessionService.startSession();
          if (result == "timeout") {
            this.cartService.clearCart()
            .then((v) => {
              this.refreshData();
              this.dialogRef.close();
            });
          }
        })
      }
    });
  }
}
