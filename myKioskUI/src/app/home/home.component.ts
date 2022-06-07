import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import { PreviousRouteService } from '../services/previous-route.service';
import { MachineService } from '../services/machine.service';
import { ConfigService } from '../services/config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Banner, BrandDetails, Slider, CollectionData, ProductData } from '../models/interfaces';
import { appear } from '../app.animation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    appear()
  ]
})
export class HomeComponent implements OnInit {

  brandDetails!: BrandDetails;
  leftBanner?: Banner;
  rightBanner?: Banner;
  topSlider?: Slider;
  bottomSlider?: Slider;
  loaded: boolean = false;

  constructor(private globalsService: GlobalsService,
    private prevRouteService: PreviousRouteService,
    private machineService: MachineService,
    private configService: ConfigService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.prevRouteService.getPreviousUrl() == '/idle') {
      this.loaded = false;
      this.loadConfigData()
      .then(() => {
        console.log("Configuration is loaded");
        this.loaded = true;
      })
      .catch((err) => {
        console.log("Error occured during configuration loading: ", err);
      });
    }
    else {
      this.loaded = true;
      this.brandDetails = this.configService.getBrandDetails();
      this.retrieveUiData();
    }
  }

  private async loadConfigData(): Promise<void> {
    this.configService.reset();
    console.log("Requesting brand info");
    let v = await this.configService.loadBrandInfo();
    if (!v) {
      this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'msg-panel'
      });
    }
    else {
      console.log("Brand info loaded");
      this.brandDetails = this.configService.getBrandDetails();
    }
    console.log("Requesting UI Model");
    v = await this.configService.loadUiModel();
    if (!v) {
      this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'msg-panel'
      });
    }
    else {
      console.log("UI Model loaded");
      console.log("Requesting collections");
      v = await this.configService.loadCollectins();
      if (!v) {
        this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'msg-panel'
        });
      }
      console.log("Requesting products");
      v = await this.configService.loadProducts();
      if (!v) {
        this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'msg-panel'
        });
      }
      this.configService.useDefaultProfile();
      this.retrieveUiData();
    }
  }

  private retrieveUiData() {
    this.leftBanner = this.configService.getLeftBanner();
    this.rightBanner = this.configService.getRighttBanner();
    this.topSlider = this.configService.getTopSlider();
    this.bottomSlider = this.configService.getBottomSlider();
  }

  getCollectionName(id: Number): String {
    const collection: CollectionData | undefined = this.configService.getCollectionById(id);
    return collection ? collection.name : "";
  }

  getCollectionImage(id: Number): String {
    const collection: CollectionData | undefined = this.configService.getCollectionById(id);
    return collection ? collection.image : "";
  }

  getProductName(id: Number): String {
    const product: ProductData | undefined = this.configService.getProductById(id);
    return product? product.name : "";
  }

  getProductImage(id: Number): String {
    const product: ProductData | undefined = this.configService.getProductById(id);
    return product ? product.images[0] : "";
  }
}
