import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { ProductData } from '../models/interfaces';
import { ConfigService } from '../services/config.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { appear } from '../app.animation';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CartComponent } from '../cart/cart.component';
import { CART_DLG_SIZES } from '../app.constants';
import { MachineService } from '../services/machine.service';
import { MACHINE_STATUS } from '../models/wsmessage';

interface Item {
  name: string;
  value: string;
}

interface Option {
  values: Item[];
  currentValue: string;
}

interface VariantOption {
  values: number[];
  variantId: number;
}

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [
    appear()
  ]
})
export class ProductComponent implements OnInit, OnDestroy {

  product?: ProductData;
  variantInd = 0;
  price = "";
  comparePrice = "";
  sale = false;
  available = false;
  enabled = true;
  hasVariants = false;
  varIds: number[] = [];
  optionNames: string[] = [];
  options: {[key: string]: Option} = {};
  opt2var: VariantOption[] = [];
  cartDialogRef?: MatDialogRef<CartComponent>;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private machineService: MachineService,
    public dialog: MatDialog) {
      iconRegistry.addSvgIcon('add-to-cart', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/to_cart.svg'));
      iconRegistry.addSvgIcon('buy-now', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/buy_now.svg'));
  }

  ngOnInit(): void {
    this.route.url.subscribe({
      next: (v) => {
        //console.log(v);
        if (v.length == 2 && v[0].path === 'products') {
            this.product = this.configService.getProductById(parseInt(v[1].path));
            this.buildOptions();
            this.variantInd = 0;
            this.updateProperties();
        }
      }
    });
    this.configService.watchAvailabilityChange().subscribe({
      next: (v) => {
        if (this.product) {
          for (var i = 0; i < this.product.variants.length; i++) {
            var variant = this.product.variants[i];
            if (variant.id == v.variantId) {
              variant.available = v.available;
              this.available = variant.available > 0;
              break;
            }
          }
        }
      }
    });

    this.enabled = this.machineService.getMachineStatus() == MACHINE_STATUS.AVAILABLE;
    this.machineService.watchMachineStatus()
    .subscribe({
      next: (ms) => {
        this.enabled = ms == MACHINE_STATUS.AVAILABLE;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.cartDialogRef) {
      this.cartDialogRef.close();
    }
  }

  private buildOptions() {
    if (this.product) {
      var value = 0;
      for (var i = 0; i < this.product.variants.length; i++) {
        const variant = this.product.variants[i];
        var varopt: VariantOption = {
          values: [],
          variantId: variant.id
        }
        for (var j = 0; j < variant.options.length; j++) {
          if (this.options[variant.options[j].name]) {
            this.options[variant.options[j].name].values.push({
              name: variant.options[j].value,
              value: value.toString()
            });
          }
          else {
            this.options[variant.options[j].name] = {
              values: [{
                name: variant.options[j].value,
                value: value.toString()
              }],
              currentValue: ''
            }
            if (i == 0) {
              this.options[variant.options[j].name].currentValue = this.options[variant.options[j].name].values[0].value;
            }
            this.optionNames.push(variant.options[j].name);
          }
          varopt.values.push(value);
          value += 1;
        }
        this.opt2var.push(varopt);
        this.varIds.push(variant.id);
      }
    }
  }

  private updateProperties() {
    if (this.product) {
      const variant = this.product.variants[this.variantInd];
      this.price = variant.priceFormatted;
      this.comparePrice = variant.comparePriceFormatted;
      this.sale = !(variant.price == variant.comparePrice);
      this.available = variant.available > 0;
      this.hasVariants = this.product.variants.length > 1;
    }
  }

  onOptionChanged(optName: string, v: string) {
    this.options[optName].currentValue = v;
    for (var i = 0; i < this.opt2var.length; i++) {
      var j = 0;
      var match = true;
      for (const opt in this.options) {
        const option = this.options[opt];
        match &&= this.opt2var[i].values[j] == parseInt(option.currentValue);
        j += 1;
      }
      if (match) {
        const ind = this.varIds.indexOf(this.opt2var[i].variantId);
        if (ind < 0) {
          console.log('Cannot find variantId ' + this.opt2var[i].variantId);
        }
        else {
          this.variantInd = ind;
          this.updateProperties();
        }
        break;
      }
    }
  }

  async addToCart() {
    if (this.product) {
      let v = await this.cartService.addItemToCart(this.product.name, this.product.variants[this.variantInd]);
      if (v) {
        const msg = `${this.cartService.composeVariantName(this.product.name, this.product.variants[this.variantInd].options)} added to the Shopping Cart`;
        this.snackBar.open(msg, undefined, {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 2000,
            panelClass: 'msg-panel'
        });
      }
      else {
        const msg = `Unable to add ${this.cartService.composeVariantName(this.product.name, this.product.variants[this.variantInd].options)} to the Shopping Cart`;
        this.snackBar.open(msg, undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'errmsg-panel'
        });
      }
    }
  }

  async buyNow() {
    if (this.product) {
      let v = await this.cartService.addItemToCart(this.product.name, this.product.variants[this.variantInd]);
      if (v) {
        const msg = `${this.cartService.composeVariantName(this.product.name, this.product.variants[this.variantInd].options)} added to the Shopping Cart`;
        this.snackBar.open(msg, undefined, {
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            duration: 2000,
            panelClass: 'msg-panel'
        });
        this.cartDialogRef = this.dialog.open(CartComponent, {
          width: CART_DLG_SIZES.width, 
          minHeight: CART_DLG_SIZES.minHeight,
          maxHeight: CART_DLG_SIZES.maxHeight,
          data: {buyNow: true}
        });
      }
      else {
        const msg = `Unable to add ${this.cartService.composeVariantName(this.product.name, this.product.variants[this.variantInd].options)} to the Shopping Cart`;
        this.snackBar.open(msg, undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'errmsg-panel'
        });
      }
    }
  }
}
