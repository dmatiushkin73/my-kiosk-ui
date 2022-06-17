import { Component, OnInit } from '@angular/core';
import { CartData } from '../models/interfaces';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartContents!: CartData[];
  total!: string;

  constructor(public dialogRef: MatDialogRef<CartComponent>) { }

  ngOnInit(): void {
  }

}
