import { Component,  isDevMode, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  template: ``
})
export class LandingComponent implements OnInit {
  constructor( private router: Router ) {
    isDevMode() && console.log('LandingComponent', router);
  }
  ngOnInit(): void {
    this.router.navigate(['app', 'welcome']);
    isDevMode() && console.log('init');
  }

}
