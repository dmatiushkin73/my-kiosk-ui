import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { CartData, ProductVariantData, ProductOption, CartItem, ResponseResult } from '../models/interfaces';
import { RESPONSE } from '../app.constants';
import { Observable, of, Subject } from 'rxjs';
import { formatCurrency } from '@angular/common';
import { environment } from 'src/environments/environment';
import { GlobalsService } from './globals.service';
import { HttpClient } from '@angular/common/http';
import { handleHttpError } from '../shared/utils';

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

  private cartApi = '/cart';
  private cartContents: CartData[] = [];
  private numOfCartItems!: NumberOfItems;

  constructor(private configService: ConfigService,
    private globalsService: GlobalsService,
    private http: HttpClient) {
    this.numOfCartItems = new NumberOfItems();
    this.configService.watchAvailabilityChange().subscribe({
      next: (v) => {
        for (var i = 0; i < this.cartContents.length; i++) {
          var item = this.cartContents[i];
          if (item.id == v.variantId) {
            item.available = v.available;
            break;
          }
        }
      }
    });
  }

  watchNumberOfItemsInCart(): Subject<number> {
    return this.numOfCartItems.get$();
  }

  getNumberOfItemsInCart(): number {
    return this.numOfCartItems.get();
  }

  private calculateFormatTotal(price: number, quantity: number): string {
    const total = (price * quantity)/100;
    return formatCurrency(total, environment.locale, environment.currency, environment.currencyCode);
  }

  composeVariantName(prodName: string, options: ProductOption[]): string {
    var name = prodName;
    for (var i = 0; i < options.length; i++) {
      name = `${name}, ${options[i].value}`;
    }
    return name;
  }

  private updateCartApi(cartItem: CartItem): Observable<ResponseResult> {
    if (environment.simulation) {
      return of({message: "OK"});
    }
    else {
      return this.http.put<ResponseResult>(`${environment.serverAddress}${this.cartApi}`,
        cartItem,
        this.globalsService.getHttpWriteOptions());
    }
  }

  private clearCartApi(): Observable<ResponseResult> {
    if (environment.simulation) {
      return of({message: "OK"});
    }
    else {
      return this.http.delete<ResponseResult>(`${environment.serverAddress}${this.cartApi}`,
        this.globalsService.getHttpWriteOptions());
    }
  }

  async addItemToCart(prodName: string, variant: ProductVariantData): Promise<boolean> {
    const cartItem: CartItem = {
      variantId: variant.id,
      amount: 1
    };
    return new Promise<boolean>((resolve) => {
      this.updateCartApi(cartItem)
      .subscribe({
        next: (v) => {
          if (v.message == RESPONSE.OK) {
            var added = false;
            for (var i = 0; i < this.cartContents.length; i++) {
              var item = this.cartContents[i];
              if (item.id == variant.id) {
                item.quantity += 1;
                item.totalPrice = this.calculateFormatTotal(item.price, item.quantity);
                item.decEnabled = true;
                item.incEnabled = (variant.available - 1) > 0;
                added = true;
                break;
              }
            }
            if (!added) {
              this.cartContents.push({
                id: variant.id,
                productVariantName: this.composeVariantName(prodName, variant.options),
                image: variant.image,
                priceFormatted: variant.priceFormatted,
                price: variant.price,
                quantity: 1,
                totalPrice: variant.priceFormatted,
                available: variant.available,
                decEnabled: false,
                incEnabled: variant.available > 1
              });
            }
            this.numOfCartItems.inc();
            this.configService.updateProductVariantAvailability(variant.id, -1);
            resolve(true);
          }
          else {
            console.log("Backend did not add to the cart variant " + variant.id);
            resolve(false);
          }
        },
        error: (err) => {
          console.log(handleHttpError("add to cart", "variant " + variant.id, err));
          resolve(false);
        }
      });
    });
  }

  async incrementItemInCart(variantId: number): Promise<boolean> {
    const cartItem: CartItem = {
      variantId: variantId,
      amount: 1
    };
    return new Promise<boolean>((resolve) => {
      this.updateCartApi(cartItem)
      .subscribe({
        next: (v) => {
          if (v.message == RESPONSE.OK) {
            for (var i = 0; i < this.cartContents.length; i++) {
              var item = this.cartContents[i];
              if (item.id == variantId) {
                item.quantity += 1;
                item.totalPrice = this.calculateFormatTotal(item.price, item.quantity);
                item.decEnabled = true;
                item.incEnabled = (item.available - 1) > 0;
                break;
              }
            }
            this.numOfCartItems.inc();
            this.configService.updateProductVariantAvailability(variantId, -1);
            resolve(true);
          }
          else {
            console.log("Backend did not add to the cart variant " + variantId);
            resolve(false);
          }
        },
        error: (err) => {
          console.log(handleHttpError("add to cart", "variant " + variantId, err));
          resolve(false);
        }
      });
    });
  }

  async decrementItemInCart(variantId: number): Promise<boolean> {
    const cartItem: CartItem = {
      variantId: variantId,
      amount: -1
    };
    return new Promise<boolean>((resolve) => {
      this.updateCartApi(cartItem)
      .subscribe({
        next: (v) => {
          if (v.message == RESPONSE.OK) {
            for (var i = 0; i < this.cartContents.length; i++) {
              var item = this.cartContents[i];
              if (item.id == variantId) {
                item.quantity -= 1;
                item.totalPrice = this.calculateFormatTotal(item.price, item.quantity);
                item.decEnabled = item.quantity > 1;
                item.incEnabled = true;
                break;
              }
            }
            this.numOfCartItems.dec();
            this.configService.updateProductVariantAvailability(variantId, 1);
            resolve(true);
          }
          else {
            console.log("Backend did not remove from the cart variant " + variantId);
            resolve(false);
          }
        },
        error: (err) => {
          console.log(handleHttpError("remove from cart", "variant " + variantId, err));
          resolve(false);
        }
      });
    });
  }

  async removeItemFromCart(variantId: number): Promise<boolean> {
    var decBy = 0;
    var idx = 0;
    for (var i = 0; i < this.cartContents.length; i++) {
      var item = this.cartContents[i];
      if (item.id == variantId) {
        decBy = item.quantity;
        idx = i;
        break;
      }
    }
    const cartItem: CartItem = {
      variantId: variantId,
      amount: -decBy
    };
    return new Promise<boolean>((resolve) => {
      this.updateCartApi(cartItem)
      .subscribe({
        next: (v) => {
          if (v.message == RESPONSE.OK) {
            this.cartContents.splice(idx, 1);
            for (var i = 0; i < decBy; i++) {
              this.numOfCartItems.dec();
            }
            this.configService.updateProductVariantAvailability(variantId, decBy);
            resolve(true);
          }
          else {
            console.log("Backend did not remove from the cart variant " + variantId);
            resolve(false);
          }
        },
        error: (err) => {
          console.log(handleHttpError("remove from cart", "variant " + variantId, err));
          resolve(false);
        }
      });
    });
  }

  async clearCart(): Promise<boolean> {
    if (this.numOfCartItems.get() > 0) {
      return new Promise<boolean>((resolve) => {
        this.clearCartApi()
        .subscribe({
          next: (v) => {
            if (v.message == RESPONSE.OK) {
              for (var i = 0; i < this.cartContents.length; i++) {
                const item = this.cartContents[i];
                this.configService.updateProductVariantAvailability(item.id, item.quantity);
              }
              this.cartContents.splice(0, this.cartContents.length);
              this.numOfCartItems.clear();
              resolve(true);
            }
            else {
              console.log("Backend did not clear the cart");
              resolve(false);
            }
          },
          error: (err) => {
            console.log(handleHttpError("clear cart", "", err));
            resolve(false);
          }
        });
      });
    }
    else {
      return true;
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
    return formatCurrency(total/100, environment.locale, environment.currency, environment.currencyCode);
  }
}
