import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Device} from "../../../model/device";
import {Issue} from "../../../model/issue";

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements OnInit {

  @Input() device: Device;
  @Input() issue: Issue;

  @Input() selectedIssue: Issue;

  @Output() uploaded = new EventEmitter<{device: Device, state: boolean}>();

  constructor() { }

  ngOnInit() {
  }

}
