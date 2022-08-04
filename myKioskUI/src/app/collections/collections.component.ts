import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../services/config.service';
import { CollectionData } from '../models/interfaces';
import { appear } from '../app.animation';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  animations: [
    appear()
  ]
})
export class CollectionsComponent implements OnInit {

  collections: CollectionData[] = [];

  constructor(private configService: ConfigService) { }

  ngOnInit(): void {
    this.collections = this.configService.getCollections();
  }

}
