import { Routes } from '@angular/router';

import { InitComponent } from '../init/init.component';
import { IdleComponent } from '../idle/idle.component';
import { HomeComponent } from '../home/home.component';
import { CollectionsComponent } from '../collections/collections.component';
import { ProductsComponent } from '../products/products.component';
import { CollectionComponent } from '../collection/collection.component';
import { ProductComponent } from '../product/product.component';

export const routes: Routes = [
    {path: 'start/:id', component: InitComponent},
    {path: 'idle', component: IdleComponent},
    {path: 'home', component: HomeComponent},
    {path: 'collections', component: CollectionsComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'collections/:id', component: CollectionComponent},
    {path: 'products/:id', component: ProductComponent},
    {path: '', redirectTo: '/start/1', pathMatch: 'full'}
];