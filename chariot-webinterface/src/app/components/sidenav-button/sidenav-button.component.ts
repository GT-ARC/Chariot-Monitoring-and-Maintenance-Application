import {Component, HostListener, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {MatSidenav} from "@angular/material";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-sidenav-button',
  templateUrl: './sidenav-button.component.html',
  styleUrls: ['./sidenav-button.component.css']
})
export class SidenavButtonComponent implements OnInit {

  @Input() sideNav: MatSidenav;
  @Input() sideNav2: MatSidenav;

  @Input() toggleSideNav2: boolean = true;

  viewPortSizeBig: number = 1578;
  viewPortSizeSmall: number = 1248;
  sidenavSize: number = 600;

  constructor(private route: ActivatedRoute,) { }

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

  left = true;
  moveFloorList(ev:MouseEvent) {
    if(!this.left){
      this.sideNav['_elementRef'].nativeElement.style['left'] = '-190px';
      this.sideNav2['_elementRef'].nativeElement.style['left'] = '-260px';
      this.left = true;
    }
  }
  moveDeviceList(ev:MouseEvent) {
    if(this.left){
      this.sideNav['_elementRef'].nativeElement.style['left'] = '0';
      this.sideNav2['_elementRef'].nativeElement.style['left'] = '-69px';
      this.left = false;
    }
  }

  reset = false;
  handleSize(width: number): void {
    console.log(this.route);

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
          // this.sideNav2['_elementRef'].nativeElement.style['left'] = '0px';
          this.sideNav2.close();
        }
      } else {
        if (width > this.viewPortSizeSmall){
          // this.sideNav2['_elementRef'].nativeElement.style['left'] = '-19px';
          this.sideNav2.open();
        }
      }
    }

    if(this.route.snapshot.url[0].path == 'devices' && width < this.sidenavSize) {
      this.sideNav['_elementRef'].nativeElement.style['left'] = '-190px';
      if(this.toggleSideNav2){
        this.sideNav2['_elementRef'].nativeElement.style['left'] = '-260px';
        if(document.getElementById('device-list')) {
          document.getElementById('device-list').style['"min-width"'] = '258px';
          document.getElementById('device-list').style['minWidth'] = '258px';
          document.getElementById('device-list').addEventListener('click', ev => this.moveFloorList(ev));
        }
        if (document.getElementById('floor-list')) {
          document.getElementById('floor-list').style['"min-width"'] = '258px';
          document.getElementById('floor-list').style['minWidth'] = '258px';
          document.getElementById('floor-list').addEventListener('click', (e: MouseEvent) => this.moveDeviceList(e));
        }
        this.reset = true;
      }
    }

    if(this.reset && (width > this.sidenavSize || this.route.snapshot.url[0].path != 'devices')) {
      console.log("Reset Sidenav");
      this.sideNav['_elementRef'].nativeElement.style['left'] = '0';
      if(this.toggleSideNav2){
        this.sideNav2['_elementRef'].nativeElement.style['left'] = '0';
        if(document.getElementById('device-list')){
          document.getElementById('device-list').style['"min-width"'] = '312px';
          document.getElementById('device-list').style['minWidth'] = '312px';
          document.getElementById('device-list').removeEventListener('click', this.moveFloorList);
        }
        if(document.getElementById('floor-list')){
          document.getElementById('floor-list').style['"min-width"'] = '328px';
          document.getElementById('floor-list').style['minWidth'] = '328px';
          document.getElementById('floor-list').removeEventListener('click', this.moveDeviceList);
        }
      }
      this.reset = false;
    }

  }

  toggleSidebar() {

    if (window.innerWidth > this.viewPortSizeSmall && window.innerWidth <= this.viewPortSizeBig){
      this.sideNav.toggle();
    } else if (window.innerWidth < this.viewPortSizeSmall){
      this.sideNav.toggle();
      if(this.toggleSideNav2){
        let display = this.sideNav2['_elementRef'].nativeElement.style['visibility'];
        this.sideNav2['_elementRef'].nativeElement.style['display'] = display == 'hidden' ? '' : 'none';
        this.sideNav2.toggle();
      }
    }
  }
}
