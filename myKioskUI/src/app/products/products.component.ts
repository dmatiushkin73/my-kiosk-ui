import { Component, OnInit } from '@angular/core';
import { appear } from '../app.animation';
import { ProductData } from '../models/interfaces';
import { ConfigService } from '../services/config.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    appear()
  ]
})
export class ProductsComponent implements OnInit {

  products: ProductData[] = [];

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.products = this.configService.getProducts();
  }

}
