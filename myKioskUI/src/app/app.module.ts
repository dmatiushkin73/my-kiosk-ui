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

import { AppComponent } from './app.component';
import { InitComponent } from './init/init.component';
import { IdleComponent } from './idle/idle.component';
import { HomeComponent } from './home/home.component';

import { GlobalsService } from './services/globals.service';
import { MachineService } from './services/machine.service';
import { PreviousRouteService } from './services/previous-route.service';
import { ConfigService } from './services/config.service';

import { IvyCarouselModule } from 'angular-responsive-carousel';
import { ExtrasComponent } from './extras/extras.component';
import { SideMenuComponent } from './side-menu/side-menu.component';

import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
  declarations: [
    AppComponent,
    InitComponent,
    IdleComponent,
    HomeComponent,
    ExtrasComponent,
    SideMenuComponent,
    HighlightDirective
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
    IvyCarouselModule
  ],
  providers: [
    GlobalsService,
    MachineService,
    PreviousRouteService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
