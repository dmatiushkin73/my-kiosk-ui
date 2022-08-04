import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { CART_DLG_SIZES } from '../app.constants';
import { PickupComponent } from '../pickup/pickup.component';
import { MachineService } from '../services/machine.service';
import { MACHINE_STATUS } from '../models/wsmessage';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  collectionsEnabled: boolean = true;
  productsEnabled: boolean = true;
  pickupEnabled: boolean = true;
  productsInCart = 0;
  cartBadgeHidden = true;
  busyVisible = false;
  cartDialogRef?: MatDialogRef<CartComponent>;
  pickupDialogRef?: MatDialogRef<PickupComponent>;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cartService: CartService,
    private machineService: MachineService,
    public dialog: MatDialog,) {
      iconRegistry.addSvgIcon('collections', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/collections.svg'));
      iconRegistry.addSvgIcon('products', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/products.svg'));
      iconRegistry.addSvgIcon('pickup', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pickup.svg'));
      iconRegistry.addSvgIcon('cart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cart.svg'));
  }

  ngOnInit(): void {
    this.route.url.subscribe({
      next: (v) => {
        //console.log(v);
        if (v.length == 1) {
          if (v[0].path === 'collections') {
            this.collectionsEnabled = false;
          }
          else if (v[0].path === 'products') {
            this.productsEnabled = false;
          }
        }
      }
    });

    this.productsInCart = this.cartService.getNumberOfItemsInCart();
    this.cartBadgeHidden = (this.productsInCart == 0);
    this.cartService.watchNumberOfItemsInCart()
    .subscribe({
      next: (v) => {
        this.productsInCart = v;
        this.cartBadgeHidden = (v == 0);
      }
    });

    const ms = this.machineService.getMachineStatus();
    this.pickupEnabled = ms == MACHINE_STATUS.AVAILABLE;
    this.busyVisible = ms == MACHINE_STATUS.BUSY;
    this.machineService.watchMachineStatus()
    .subscribe({
      next: (ms) => {
        this.pickupEnabled = ms == MACHINE_STATUS.AVAILABLE;
        this.busyVisible = ms == MACHINE_STATUS.BUSY;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
    if (this.pickupDialogRef) {
      this.pickupDialogRef.close();
    }
  }

  onCartClick() {
    this.cartDialogRef = this.dialog.open(CartComponent, {
      width: CART_DLG_SIZES.width, 
      minHeight: CART_DLG_SIZES.minHeight,
      maxHeight: CART_DLG_SIZES.maxHeight,
      disableClose: true,
      data: {buyNow: false}
    });
  }

  onPickupClick() {
    this.pickupDialogRef = this.dialog.open(PickupComponent, {
      maxHeight: "50vh",
      maxWidth: "70vw",
      disableClose: true
    });
  }
}
