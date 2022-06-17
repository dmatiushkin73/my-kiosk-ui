import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CartData, ProductVariantData, ProductOption } from '../models/interfaces';
import { Observable, Subject } from 'rxjs';
import { formatCurrency } from '@angular/common';
import { environment } from 'src/environments/environment';

class NumberOfItems {
  private value: number;
  private $: Subject<number>;

  constructor() {
    this.value = 0;
    this.$ = new Subject<number>();
  }

  inc() {
    this.value += 1;
    this.$.next(this.value);
  }

  dec() {
    if (this.value > 0) {
      this.value -= 1;
      this.$.next(this.value);
    }
  }

  clear() {
    this.value = 0;
    this.$.next(0);
  }

  get$() {
    return this.$;
  }

  get() {
    return this.value;
  }
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartContents: CartData[] = [];
  private numOfCartItems!: NumberOfItems;

  constructor(private configService: ConfigService) {
    this.numOfCartItems = new NumberOfItems();
  }

  watchNumberOfItemsInCart(): Subject<number> {
    return this.numOfCartItems.get$();
  }

  getNumberOfItemsInCart(): number {
    return this.numOfCartItems.get();
  }

  private CalculateFormatTotal(price: number, quantity: number): string {
    const total = (price * quantity)/100;
    return formatCurrency(total, environment.locale, environment.currency, environment.currencyCode);
  }

  private ComposeVariantName(prodName: string, options: ProductOption[]): string {
    var name = prodName;
    for (var i = 0; i < options.length; i++) {
      name = `${name}, ${options[i].value}`;
    }
    return name;
  }

  addItemToCart(prodName: string, variant: ProductVariantData) {
    // TODO: send it to the backend
    var added = false;
    for (var i = 0; i < this.cartContents.length; i++) {
      var item = this.cartContents[i];
      if (item.id == variant.id) {
        item.quantity += 1;
        item.totalPrice = this.CalculateFormatTotal(item.price, item.quantity);
        console.log(item.totalPrice);
        added = true;
        break;
      }
    }
    if (!added) {
      this.cartContents.push({
        id: variant.id,
        productVariantName: this.ComposeVariantName(prodName, variant.options),
        image: variant.image,
        priceFormatted: variant.priceFormatted,
        price: variant.price,
        quantity: 1,
        totalPrice: variant.priceFormatted
      });
    }
    this.numOfCartItems.inc();
  }

  removeItemFromCart(variantId: number) {
    // TODO: send it to the backend
    for (var i = 0; i < this.cartContents.length; i++) {
      var item = this.cartContents[i];
      if (item.id == variantId) {
        item.quantity -= 1;
        item.totalPrice = this.CalculateFormatTotal(item.price, item.quantity); 
        if (item.quantity <= 0) {
          this.cartContents.splice(i, 1);
        }
        break;
      }
    }
    this.numOfCartItems.dec();
  }

  clearCart() {
    if (this.numOfCartItems.get() > 0) {
      // TODO: notify the backend
      this.cartContents.splice(0, this.cartContents.length);
      this.numOfCartItems.clear();
    }
  }

  getCartContents(): CartData[] {
    return this.cartContents;
  }

  getCartTotal(): string {
    var total = 0;
    for (var i = 0; i < this.cartContents.length; i++) {
      const item = this.cartContents[i];
      total += (item.price * item.quantity);
    }
    return formatCurrency(total, environment.locale, environment.currency, environment.currencyCode);
  }
}
