import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('collections', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/collections.svg'));
      iconRegistry.addSvgIcon('products', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/products.svg'));
      iconRegistry.addSvgIcon('pickup', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/pickup.svg'));
      iconRegistry.addSvgIcon('cart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/cart.svg'));
  }

  ngOnInit(): void {
  }

}
