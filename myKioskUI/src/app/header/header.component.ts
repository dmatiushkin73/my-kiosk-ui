import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { BrandDetails } from '../models/interfaces';
import { ConfigService } from '../services/config.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  title: string = '';
  brandDetails!: BrandDetails;

  constructor(private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private location: Location) {
      iconRegistry.addSvgIcon('back', sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/back.svg'));
     }

  ngOnInit(): void {
    this.brandDetails = this.configService.getBrandDetails();
    this.route.url.subscribe({
      next: (v) => {
        //console.log(v);
        if (v[0].path === 'collections') {
          if (v.length == 1) {
            this.title = 'Collections';
          }
          else if (v.length == 2) {
            const coll = this.configService.getCollectionById(parseInt(v[1].path));
            this.title = coll ? coll.name : '';
          }
        }
        else if (v[0].path === 'products') {
          if (v.length == 1) {
            this.title = 'Products';
          }
          else if (v.length == 2) {
            const prod = this.configService.getProductById(parseInt(v[1].path));
            this.title = prod ? prod.name : '';
          }
        }
      }
    });
  }

  onBackClick() {
    this.location.back();
  }
}
