import { Component, Inject, OnInit } from '@angular/core';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab-navigation-content',
  templateUrl: './tab-navigation-content.component.html',
  styleUrls: ['./tab-navigation-content.component.scss']
})
export class TabNavigationContentComponent implements OnInit {

  constructor(
    private router: Router,
    private bottomSheetRef: MatBottomSheetRef<TabNavigationContentComponent>, 
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any[]
  ) {}

  ngOnInit(): void {
    console.log('started', this.data)
  }

  onClick(item: any) {
    this.bottomSheetRef.dismiss(item);
  }
}