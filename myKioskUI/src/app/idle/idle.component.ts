import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.scss']
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
