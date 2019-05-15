import {Component, HostListener, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-sidenav-button',
  templateUrl: './sidenav-button.component.html',
  styleUrls: ['./sidenav-button.component.css']
})
export class SidenavButtonComponent implements OnInit {

  @Input() sideNav: MatSidenav;

  @Input() sideNav2: MatSidenav;

  @Input() toggleSideNav2: boolean = true;

  viewPortSizeBig : number = 1578;
  viewPortSizeSmall : number = 1248;

  constructor() { }

  ngOnInit() {
    // Close the sidebar when they are loaded
    this.handleSize(window.innerWidth)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.handleSize(event.target.innerWidth)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.handleSize(window.innerWidth)
  }

  handleSize(width: number): void {

    if (window.innerWidth < this.viewPortSizeBig){
      this.sideNav.mode = 'over';
    } else
      this.sideNav.mode = 'side';

    if (this.sideNav2 != null && this.toggleSideNav2) {
      if (window.innerWidth < this.viewPortSizeSmall){
        this.sideNav2.mode = 'over';
      } else
        this.sideNav2.mode = 'side';
    }

    if (this.sideNav.opened) {
      if (width < this.viewPortSizeBig) {
        this.sideNav.close();
      }
    } else {
      if (width > this.viewPortSizeBig){
        this.sideNav.open();
      }
    }

    if (this.sideNav2 != null && this.toggleSideNav2){
      if (this.sideNav2.opened) {
        if (width < this.viewPortSizeSmall) {
          this.sideNav2.close();
        }
      } else {
        if (width > this.viewPortSizeSmall){
          this.sideNav2.open();
        }
      }
    }
  }

  toggleSidebar() {
    if (window.innerWidth > this.viewPortSizeSmall && window.innerWidth <= this.viewPortSizeBig){
      this.sideNav.toggle();
    } else if (window.innerWidth < this.viewPortSizeSmall){
      this.sideNav.toggle();
      if(this.toggleSideNav2) this.sideNav2.toggle();
    }
  }
}
