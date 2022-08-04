import { Component, OnInit } from '@angular/core';
import { appear } from '../app.animation';
import { ProductData } from '../models/interfaces';
import { ConfigService } from '../services/config.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  animations: [
    appear()
  ]
})
export class CollectionComponent implements OnInit {

  products: ProductData[] = [];

  constructor(private configService: ConfigService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.url.subscribe({
      next: (v) => {
        //console.log(v);
        if (v.length == 2 && v[0].path === 'collections') {
            this.products = this.configService.getProductsByCollectionId(parseInt(v[1].path));
        }
      }
    });
  }

}
