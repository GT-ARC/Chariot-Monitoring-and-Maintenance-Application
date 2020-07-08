import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Device} from "../../../model/device";
import {Issue} from "../../../model/issue";

@Component({
  selector: 'app-issue-card',
  templateUrl: './issue-card.component.html',
  styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent implements OnInit {

  @Input() issue: Issue;

  @Input() selectedIssue: Issue;
  @Input() dashboard: boolean = false;

  constructor() { }

  ngOnInit() {
  }

}
