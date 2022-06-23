import { Component, OnInit } from '@angular/core';
import { CartData } from '../models/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartContents?: CartData[];
  total!: string;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<CartComponent>,
    private cartService: CartService) {
      iconRegistry.addSvgIcon('clear', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/clear.svg'));
      iconRegistry.addSvgIcon('close', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/close.svg'));
      iconRegistry.addSvgIcon('checkout', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/checkout.svg'));
      iconRegistry.addSvgIcon('trash', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/trash.svg'));
  }

  ngOnInit(): void {
    this.refreshData();
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
}
