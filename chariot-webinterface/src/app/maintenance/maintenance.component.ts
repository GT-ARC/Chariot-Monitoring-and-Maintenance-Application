import {Component, OnInit, Pipe, PipeTransform, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {Floor} from "../../model/floor";
import {Location} from "../../model/location";
import {Device, Property} from '../../model/device';
import {DataHandlingService} from "../services/data-handling.service";
import {Issue} from "../../model/issue";
import {Color} from "ng2-charts";

import {ActivatedRoute} from '@angular/router';
import {Location as Locl} from '@angular/common';
import {MatSidenav} from "@angular/material";
import {DeviceGroup} from '../../model/deviceGroup';
import {PmNotificationReceiverService} from "../services/pm-notification-receiver.service";
import {Metadata} from "../../model/Metadata";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  devices: Device[];      // Holds the fetched data of the devices

  currentDevice: Device;
  selectedIssue: Issue;
  relatedProperty: Property[];

  group: any[] = [];
  issueList: Issue[];
  groupedIssues: Map<any, Issue[]> = new Map();

  issueGroupings: string[] = [
    'Date',
    'State',
    'Importance'
  ];
  issueSortSelected: string = 'State';

  datesShown: number = -1;
  today = Math.floor(Date.now() / 86400000) * 86400000;
  yesterday = Math.floor(Date.now() / 86400000) * 86400000 - 86400000;

  window = window;

  @ViewChild('snav1', {static: false}) sideNav: MatSidenav;
  metadata: Metadata;

  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578)
      this.sideNav.close();
  }

  constructor(
    private route: ActivatedRoute,
    private pmService: PmNotificationReceiverService,
    private dataService: DataHandlingService,
    private locationService: Locl) {
    // this.dataService.getDataNotification().subscribe(next => {
    //   // Select the routed device
    //   this.initInterface();
    // });
  }

  ngOnInit() {
    this.pmService.issueResolvedEvent.subscribe(i => {
      this.sort(this.issueSortSelected);
    });
    this.pmService.newIssueEvent.subscribe(i => {
      this.sort(this.issueSortSelected);
    });
    this.getData();
    this.initInterface();
  }

  initInterface() {
    if(this.devices == undefined || this.devices.length == 0)
      return;

    if (this.route.snapshot.paramMap.has('id')) {
      let routedIssueId = this.route.snapshot.paramMap.get('id');
      let issue = this.issueList.find(value => value.identifier == routedIssueId);
      if (issue) {
        this.newSelectedIssue(issue);
        console.log("Routed issue ID:", this.selectedIssue.identifier);
      }
    }

    this.sort(this.issueSortSelected);

    // If no issue is selected due to routing select the first in the list
    if (this.selectedIssue == null && this.issueList.length != 0)
      this.newSelectedIssue(this.issueList[0]);

    this.doGraphStuff();
  }

  doGraphStuff() {
    // todo if the pm service model is set get the related property to the issue
    this.relatedProperty = this.selectedIssue.relatedTo;
    console.log(this.selectedIssue.relatedTo)
  }

  /**
   * Iterate over each issue and group by {@param sortBy}
   * @param sortBy
   */
  sort(sortBy: string) {
    this.issueSortSelected = sortBy;
    this.group = [];
    this.groupedIssues = new Map();

    // Group each issue according to sortBy
    this.issueList.forEach(i => {
      // Select after what property should be grouped
      this.insertIssueInGroup(sortBy, i);
    });

    if (sortBy == 'State') this.group.reverse();

    // Sort the issues in each group
    this.groupedIssues.forEach((value, key) => {
      value.sort((a, b) => {
        switch (sortBy) {
          case 'Date':
            return b.issue_date - a.issue_date;
          case 'State':
            return a.type > b.type ? 1 : -1;
          case 'Importance':
            return b.importance - a.importance;
        }
      })
    });

    // Sort the group
    this.group = this.group.sort((a, b) => {
      switch (sortBy) {
        case 'Date':
        case 'Importance':
          return b - a;
        case 'Type':
          return a.type > b.type ? 1 : -1;
      }
    });

    if(this.datesShown != -1 && this.issueSortSelected == 'Date') {
      this.group = this.group.slice(0, this.datesShown);
    }
  }

  private insertIssueInGroup(sortBy: string, i: Issue) {
    let key =
      sortBy == 'Date' ? Math.floor(i.issue_date / 86400000) * 86400000 :
        sortBy == 'State' ? i.state : i.importance;

    if (this.group.indexOf(key) == -1)
      this.group.push(key);

    if (!this.groupedIssues.has(key))
      this.groupedIssues.set(key, []);
    if (this.groupedIssues.get(key).indexOf(i) == -1)
      this.groupedIssues.get(key).push(i);
  }

  getData(): void {
    this.dataService.getFloor()
      .subscribe(data => {
        this.devices = data.devices;
      });
    this.dataService.getIssues()
      .subscribe(data => {
        this.issueList = data.issues;
      });
    this.dataService.getMetadata()
        .subscribe(data => {
          this.metadata = data.metaData;
        });
  }

  newSelectedIssue(issue: Issue) {
    this.selectedIssue = issue;
    this.locationService.replaceState("/maintenance/" + issue.identifier);
    this.currentDevice = this.devices.find(d => d.identifier == issue.relatedDeviceId);
    this.doGraphStuff();
  }

  select() {

  }
}
