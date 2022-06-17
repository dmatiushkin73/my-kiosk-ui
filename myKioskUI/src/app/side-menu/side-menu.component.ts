import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../services/cart.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  collectionsEnabled: boolean = true;
  productsEnabled: boolean = true;
  productsInCart = 0;
  cartBadgeHidden = true;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cartService: CartService,
    public dialog: MatDialog) {
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
  }

  onCartClick() {
    this.dialog.open(CartComponent, {
      width: "60vw", 
      minHeight: "20vh",
      maxHeight: "80vh"
    });
  }
}
