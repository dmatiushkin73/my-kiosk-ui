import { Injectable } from '@angular/core';
import { Brand, UiModel, BrandDetails, Banner, Slider, ProfileDetails, CollectionData, ProductData } from '../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { GlobalsService } from './globals.service';
import { handleHttpError } from '../shared/utils';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configApi = '/config';
  private modelApi = '/ui-model';
  private brandApi = '/brand-info';
  private collectionApi = '/collections';
  private productApi = '/products';
  private cartApi = '/cart';
  private dispense = '/dispense';
  private pickup = '/pickup';
  private transactionId = '/transaction-id';

  private brandInfo!: Brand;
  private uiModel!: UiModel;
  private defaultProfile: string = "";
  private currentProfile: string = "";
  private profiles: { [key: string]: ProfileDetails} = {};
  private collections: CollectionData[] = [];
  private products: ProductData[] = [];

  private lastErrorMsg = "";

  constructor(private http: HttpClient,
    private globalsService: GlobalsService) {
  }

  reset() {
    this.collections.length = 0;
    this.products.length = 0;
  }

  async loadBrandInfo(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.http.get<Brand>(`${environment.serverAddress}${this.brandApi}`,
                           this.globalsService.getHttpReadOptions())
      .subscribe({
        next: (v) => {
          this.brandInfo = v;
          resolve(true);
        },
        error: (err) => {
          console.log(handleHttpError("retrieve", "Brand Info", err));
          this.lastErrorMsg = "Failed to download Brand info";
          resolve(false);
        }
      });
    });
  }
  
  async loadUiModel(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.http.get<UiModel>(`${environment.serverAddress}${this.modelApi}`,
                             this.globalsService.getHttpReadOptions())
      .subscribe({
        next: (v) => {
          this.uiModel = v;
          this.parseUiModel();
          resolve(true);
        },
        error: (err) => {
          console.log(handleHttpError("retrive", "UI Model", err));
          this.lastErrorMsg = "Failed to download UI Model";
          resolve(false);
        }
      });
    });
  }

  loadCollection(id: Number): Promise<CollectionData> {
    return new Promise<CollectionData>((resolve, reject) => {
      this.http.get<CollectionData>(`${environment.serverAddress}${this.collectionApi}/${id}`,
                                    this.globalsService.getHttpReadOptions())
      .subscribe({
        next: (v) => {
          //console.log("Loaded collection " + v.id);
          resolve(v);
        },
        error: (err) => {
          console.log(handleHttpError("retrieve", "collection " + id, err));
          this.lastErrorMsg = "Failed to download collection";
          reject();
        }
      });
    });
  }

  async loadCollectins(): Promise<boolean> {
    let noErrors = true;
    for (const profId in this.profiles) {
      const profile = this.profiles[profId];
      for (var i = 0; i < profile.collections.length; i++) {
        let exists = false;
        for (var j = 0; j < this.collections.length; j++) {
          if (profile.collections[i].id == this.collections[j].id) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          const id = profile.collections[i].id;
          //console.log("Loading collection " + id);
          try {
            const col = await this.loadCollection(id);
            //console.log("Adding collection " + col.id);
            this.collections.push(col);
          }
          catch {
            noErrors = false;
          }
        }
      }
    }
    console.log("Result of loading collections: " + noErrors);
    return noErrors;
  }

  loadProduct(id: Number): Promise<ProductData> {
    return new Promise<ProductData>((resolve, reject) => {
      this.http.get<ProductData>(`${environment.serverAddress}${this.productApi}/${id}`,
                                 this.globalsService.getHttpReadOptions())
      .subscribe({
        next: (v) => {
          //console.log("Loaded product " + v.id);
          resolve(v);
        },
        error: (err) => {
          console.log(handleHttpError("retrieve", "product " + id, err));
          this.lastErrorMsg = "Failed to download product";
          reject();
        }
      });
    });
  }

  async loadProducts(): Promise<boolean> {
    let noErrors = true;
    for (const profId in this.profiles) {
      const profile = this.profiles[profId];
      for (var i = 0; i < profile.products.length; i++) {
        let exists = false;
        for (var j = 0; j < this.products.length; j++) {
          if (profile.products[i] == this.products[j].id) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          const id = profile.products[i];
          //console.log("Loading product " + id);
          try {
            const prod = await this.loadProduct(id);
            //console.log("Adding product " + prod.id);
            this.products.push(prod);
          }
          catch {
            noErrors = false;
          }
        }
      }
    }
    console.log("Result of loading products: " + noErrors);
    return noErrors; 
  }
  
  getLastErrMsg(): string {
    return this.lastErrorMsg;
  }

  private parseUiModel() {
    this.defaultProfile = "";
    this.currentProfile = "";
    for (const profId in this.uiModel.profiles) {
      const profile = this.uiModel.profiles[profId];
        if (this.defaultProfile == "") {
          this.defaultProfile = profId;
        }
        this.profiles[profId] = {
          id: profile.id,
          collections: profile.collections,
          products: profile.products
        };
        let whichSlider = 1;
        for (let i = 0; i < profile.sections.length; i++) {
          const section = profile.sections[i];
          if (section.type == "left-banner") {
            this.profiles[profId].leftBanner = {
              type: section.description.type,
              id: section.description.id?section.description.id:0,
              image: section.description.imageUrl?section.description.imageUrl:""
            };
          }
          if (section.type == "right-banner") {
            this.profiles[profId].rightBanner = {
              type: section.description.type,
              id: section.description.id?section.description.id:0,
              image: section.description.imageUrl?section.description.imageUrl:""
            };
          }
          if (section.type == "slider") {
            if (whichSlider == 1) {
              this.profiles[profId].topSlider = {
                type: section.description.type,
                title: section.description.title?section.description.title:"",
                ids: section.description.ids?section.description.ids:[]
              };
              whichSlider = 2;
            }
            else if (whichSlider == 2) {
              this.profiles[profId].bottomSlider = {
                type: section.description.type,
                title: section.description.title?section.description.title:"",
                ids: section.description.ids?section.description.ids:[]
              };
            }
          }
        }
    }
  }

  useDefaultProfile() {
    this.currentProfile = this.defaultProfile;
  }

  useProfile(id: string) {
    this.currentProfile = id;
  }
  
  getBrandDetails(): BrandDetails{
    return {
      name: this.brandInfo.customerName,
      showName: this.brandInfo.showCustomerName,
      logo: this.brandInfo.logoUrl
    };
  }

  getLeftBanner(): Banner | undefined {
    return this.currentProfile?this.profiles[this.currentProfile].leftBanner:undefined;
  }

  getRighttBanner(): Banner | undefined {
    return this.currentProfile?this.profiles[this.currentProfile].rightBanner:undefined;
  }

  getTopSlider(): Slider | undefined {
    return this.currentProfile?this.profiles[this.currentProfile].topSlider:undefined;
  }

  getBottomSlider(): Slider | undefined {
    return this.currentProfile?this.profiles[this.currentProfile].bottomSlider:undefined;
  }

  getCollectionById(id: Number): CollectionData | undefined {
    for (var i = 0; i < this.collections.length; i++) {
      if (this.collections[i].id == id) {
        return this.collections[i];
      }
    }
    return undefined;
  }

  getProductById(id: Number): ProductData | undefined {
    for (var i = 0; i < this.products.length; i++) {
      if (this.products[i].id == id) {
        return this.products[i];
      }
    }
    return undefined;
  }
}
