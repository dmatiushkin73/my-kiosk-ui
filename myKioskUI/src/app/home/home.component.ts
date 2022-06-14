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
