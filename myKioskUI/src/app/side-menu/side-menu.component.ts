import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  collectionsEnabled: boolean = true;
  productsEnabled: boolean = true;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute) {
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
  }

}
