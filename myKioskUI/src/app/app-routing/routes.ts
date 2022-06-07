import { Routes } from '@angular/router';

import { InitComponent } from '../init/init.component';
import { IdleComponent } from '../idle/idle.component';
import { HomeComponent } from '../home/home.component';

export const routes: Routes = [
    {path: 'start/:id', component: InitComponent},
    {path: 'idle', component: IdleComponent},
    {path: 'home', component: HomeComponent},
    //{path: 'menu', component: MenuComponent},
    //{path: 'dishdetail/:id', component: DishdetailComponent},
    {path: '', redirectTo: '/start/1', pathMatch: 'full'}
];