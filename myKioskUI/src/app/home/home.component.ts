import { Component, OnInit } from '@angular/core';
import { GlobalsService } from '../services/globals.service';
import { PreviousRouteService } from '../services/previous-route.service';
import { MachineService } from '../services/machine.service';
import { ConfigService } from '../services/config.service';
import { SessionService } from '../services/session.service';
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
    private sessionService: SessionService,
    private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    if (this.prevRouteService.getPreviousUrl() == '/idle' &&
        (!this.configService.isDataLoaded() ||
          this.configService.isBrandInfoUpdated() ||
          this.configService.isUiModelUpdated())) {
      if (!this.configService.isDataLoaded()) {
        this.loaded = false;
        this.loadBrandConfigData()
        .then(() => {
          this.loadModelConfigData()
          .then(() => {
            console.log("Configuration is loaded");
            this.loaded = true;
            this.configService.setDataLoaded();
            this.sessionService.startSession();
          })
          .catch((err) => {
            console.log("Error occured during model configuration loading: ", err);
          });
        })
        .catch((err) => {
          console.log("Error occured during brand configuration loading: ", err);
        });
      }
      else {
        if (this.configService.isBrandInfoUpdated()) {
          this.loadBrandConfigData()
          .then(() => {
            console.log("Updated Brand Configuration is loaded");
          })
          .catch((err) => {
            console.log("Error occured during updated brand configuration loading: ", err);
          });
        }
        if (this.configService.isUiModelUpdated()) {
          this.loaded = false;
          this.loadModelConfigData()
          .then(() => {
            console.log("Updated UiModel Configuration is loaded");
            this.loaded = true;
            this.configService.setDataLoaded();
          })
          .catch((err) => {
            console.log("Error occured during model configuration loading: ", err);
          });
        }
        this.sessionService.startSession();
      }
    }
    else {
      this.loaded = true;
      this.brandDetails = this.configService.getBrandDetails();
      this.retrieveUiData();
    }
  }

  private async loadBrandConfigData(): Promise<void> {
    console.log("Requesting brand info");
    let v = await this.configService.loadBrandInfo();
    if (!v) {
      this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'errmsg-panel'
      });
    }
    else {
      console.log("Brand info loaded");
      this.brandDetails = this.configService.getBrandDetails();
    }
  }

  private async loadModelConfigData(): Promise<void> {
    this.configService.reset();
    console.log("Requesting UI Model");
    let v = await this.configService.loadUiModel();
    if (!v) {
      this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: 'errmsg-panel'
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
          panelClass: 'errmsg-panel'
        });
      }
      console.log("Requesting products");
      v = await this.configService.loadProducts();
      if (!v) {
        this.snackBar.open(this.configService.getLastErrMsg(), undefined, {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 2000,
          panelClass: 'errmsg-panel'
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

  private getCollectionName(id: Number): String {
    const collection: CollectionData | undefined = this.configService.getCollectionById(id);
    return collection ? collection.name : "";
  }

  private getCollectionImage(id: Number): String {
    const collection: CollectionData | undefined = this.configService.getCollectionById(id);
    return collection ? collection.image : "";
  }

  private getProductName(id: Number): String {
    const product: ProductData | undefined = this.configService.getProductById(id);
    return product? product.name : "";
  }

  private getProductImage(id: Number): String {
    const product: ProductData | undefined = this.configService.getProductById(id);
    return product ? product.images[0] : "";
  }

  getTopSliderImage(id: Number): String {
    if (this.topSlider) {
      return this.topSlider.type == 'collection' ? this.getCollectionImage(id) :
                                                   this.getProductImage(id);
    }
    else {
      return '';
    }
  }

  getTopSliderTitle(id: Number): String {
    if (this.topSlider) {
      return this.topSlider.type == 'collection' ? this.getCollectionName(id) :
                                                   this.getProductName(id);
    }
    else {
      return '';
    }
  }

  getBottomSliderImage(id: Number): String {
    if (this.bottomSlider) {
      return this.bottomSlider.type == 'collection' ? this.getCollectionImage(id) :
                                                      this.getProductImage(id);
    }
    else {
      return '';
    }
  }

  getBottomSliderTitle(id: Number): String {
    if (this.bottomSlider) {
      return this.bottomSlider.type == 'collection' ? this.getCollectionName(id) :
                                                      this.getProductName(id);
    }
    else {
      return '';
    }
  }

  getTopSliderLink(id: Number): String {
    if (this.topSlider) {
      if (this.topSlider.type == 'collection') {
        return "/collections/" + id;
      }
      else {
        return "/products/" + id;
      }
    }
    else {
      return '#';
    }
  }

  getBottomSliderLink(id: Number): String {
    if (this.bottomSlider) {
      if (this.bottomSlider.type == 'collection') {
        return "/collections/" + id;
      }
      else {
        return "/products/" + id;
      }
    }
    else {
      return '#';
    }
  }

  getLeftBannerLink(): String {
    if (this.leftBanner) {
      if (this.leftBanner.type == 'collection') {
        return "/collections/" + this.leftBanner.id;
      }
      else {
        return "/products/" + this.leftBanner.id;
      }
    }
    else {
      return '#';
    }
  }

  getRightBannerLink(): String {
    if (this.rightBanner) {
      if (this.rightBanner.type == 'collection') {
        return "/collections/" + this.rightBanner.id;
      }
      else {
        return "/products/" + this.rightBanner.id;
      }
    }
    else {
      return '#';
    }
  }
}
