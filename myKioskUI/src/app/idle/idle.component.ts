import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { emerge } from '../app.animation';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.scss'],
  animations: [
    emerge()
  ]
})
export class IdleComponent implements OnInit {

  text: string = "Let's shop!";

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("IDLE");
  }

  onTouch() {
    this.router.navigate(['/home']);
  }

}
