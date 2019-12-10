import {Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Device} from '../../../model/device';
import {isNumber} from 'util';

@Component({
  selector: 'app-clickable-text',
  templateUrl: './clickable-text.component.html',
  styleUrls: ['./clickable-text.component.css']
})
export class ClickableTextComponent implements OnInit {

  active: boolean = false;
  textFieldWith: string = '100%';

  visibleText: string;
  isStr: boolean;
  val: number;

  @Output() eventEmitter = new EventEmitter<{value: string}>();
  @Input() text: string;
  @Input() size: number;
  @Input() color: string;
  @Input() enabled: boolean;


  @Input() min?: number;
  @Input() max?: number;

  @Input() accuracy: number = 1;

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.resizeTextfield();
    this.visibleText = this.getVisibleString(this.text)
  }

  ngOnInit() {
    this.resizeTextfield();
    this.visibleText = this.getVisibleString(this.text)
  }

  emitValue() {
    this.eventEmitter.emit({value: this.text});
  }

  submitValue($event: KeyboardEvent) {
    this.visibleText = this.getVisibleString($event.target['value']);
    if($event.key == 'Enter' ) {
      this.active = false;
      this.text = this.visibleText;
      this.emitValue();
    }
    this.resizeTextfield();
  }

  focusEvent($event) {
    this.active = false;
    this.resizeTextfield();
    this.visibleText = this.getVisibleString($event.target['value']);
    this.text = this.visibleText;
    this.emitValue();
  }

  getVisibleString(text: any): string {
    if(isNumber(text)){
      const retValue =  Math.round(Number(text) * Math.pow(10, this.accuracy)) / Math.pow(10, this.accuracy);
      this.isStr = false;
      this.val = retValue;
      return retValue.toString();
    }
    this.isStr = true;
    return text;
  }

  @ViewChild('invisibleText', { static: true }) invisibleTextWidth: HTMLDivElement;

  resizeTextfield() {
    setTimeout(()=>{ // this will make the execution after the above boolean has changed
      this.textFieldWith = this.invisibleTextWidth['nativeElement'].clientWidth + "px";
    },0);
  }
}
