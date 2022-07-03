import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing/app-routing.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

import { AppComponent } from './app.component';
import { InitComponent } from './init/init.component';
import { IdleComponent } from './idle/idle.component';
import { HomeComponent } from './home/home.component';
import { ExtrasComponent } from './extras/extras.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { CollectionsComponent } from './collections/collections.component';
import { HeaderComponent } from './header/header.component';

import { GlobalsService } from './services/globals.service';
import { MachineService } from './services/machine.service';
import { PreviousRouteService } from './services/previous-route.service';
import { ConfigService } from './services/config.service';
import { CartService } from './services/cart.service';

import { IvyCarouselModule } from 'angular-responsive-carousel';
import { QRCodeModule } from 'angularx-qrcode';

import { HighlightDirective } from './directives/highlight.directive';
import { ProductsComponent } from './products/products.component';
import { CollectionComponent } from './collection/collection.component';
import { ProductComponent } from './product/product.component';
import { CartComponent } from './cart/cart.component';
import { PaymethodComponent } from './paymethod/paymethod.component';
import { QrcodePaymentComponent } from './qrcode-payment/qrcode-payment.component';

@NgModule({
  declarations: [
    AppComponent,
    InitComponent,
    IdleComponent,
    HomeComponent,
    ExtrasComponent,
    SideMenuComponent,
    HighlightDirective,
    CollectionsComponent,
    HeaderComponent,
    ProductsComponent,
    CollectionComponent,
    ProductComponent,
    CartComponent,
    PaymethodComponent,
    QrcodePaymentComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    AppRoutingModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
    MatDialogModule,
    MatListModule,
    IvyCarouselModule,
    QRCodeModule
  ],
  providers: [
    GlobalsService,
    MachineService,
    PreviousRouteService,
    ConfigService,
    CartService
  ],
  entryComponents: [
    CartComponent,
    PaymethodComponent,
    QrcodePaymentComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
