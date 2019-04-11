import {Component, OnInit, SimpleChange, SimpleChanges, ViewChild} from '@angular/core';
import {Floor} from "../../model/floor";
import {Location} from "../../model/location";
import {Device} from "../../model/device";
import {MockDataService} from "../services/mock-data.service";
import {Issue} from "../../model/issue";
import {Color} from "ng2-charts";

import {ActivatedRoute} from '@angular/router';
import {Location as Locl} from '@angular/common';
import {MatSidenav} from "@angular/material";

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styleUrls: ['./maintenance.component.css']
})
export class MaintenanceComponent implements OnInit {

  devices: Device[];      // Holds the fetched data of the devices

  selectedIssue: Issue;

  group: any[] = [];
  issueList: Issue[];
  groupedIssues: Map<any, Issue[]> = new Map();
  issueDeviceMap: Map<Issue, Device> = new Map();

  issueSort: string[] = ["Date", "Type", "Importance"];
  issueSortSelected: string = "Date";

  datesShown: number = 2;
  today = Math.floor(Date.now() / 86400000) * 86400000;
  yesterday = Math.floor(Date.now() / 86400000) * 86400000 - 86400000;

  window = window;

  @ViewChild('snav1') sideNav: MatSidenav;
  backDropClicked() {
    if (this.sideNav.opened && window.innerWidth < 1578)
      this.sideNav.close();
  }

  constructor(
    private route: ActivatedRoute,
    private mockDataService: MockDataService,
    private locationService: Locl) {
  }

  ngOnInit() {

    this.getMockData();

    let id = null;
    if (this.route.snapshot.paramMap.has('id')) {
      let routing = this.route.snapshot.paramMap.get('id');
      if (routing.charAt(0) == 'i')
        id = +routing.slice(1, routing.length);
      else {
        let issueDevice = this.devices.find(value => value.identifier == +routing);
        if (issueDevice != undefined && issueDevice.issues.length != 0) {
          id = issueDevice.issues[0].identifier;
        }
      }
    }

    console.log("Issue ID:", id);

    this.issueList = this.devices.map(d => {
      d.issues.forEach(i => {
        this.issueDeviceMap.set(i, d);
      });
      return d.issues;
    }).reduce((previousValue, currentValue) => currentValue.concat(previousValue));

    this.sort(this.issueSortSelected);


    if (id != null) {
      let issue = this.issueList.find(value => value.identifier == id);
      if (issue != undefined)
        this.selectedIssue = issue;
    }

    // If no issue is selected due to routing select the first in the list
    if (this.selectedIssue == null)
      this.selectedIssue = this.issueList[0];


    this.doGraphStuff();
  }

  doGraphStuff() {
    let currentDevice = this.issueDeviceMap.get(this.selectedIssue);
    this.lineChartLabels = currentDevice.data.map(data =>
      this.monthAbrNames[new Date(data.y).getMonth()] + " " + new Date(data.y).getDay()
    );
    this.lineChartData = [
      {
        data: currentDevice.data.map(data => data.x),
        label: 'History'
      }
    ];
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
      let key =
        sortBy == "Date" ? Math.floor(i.issue_date / 86400000) * 86400000 :
          sortBy == "Type" ? i.type : i.importance;

      if (this.group.indexOf(key) == -1)
        this.group.push(key);

      if (!this.groupedIssues.has(key))
        this.groupedIssues.set(key, []);
      this.groupedIssues.get(key).push(i);
    });

    // Sort the issues in each group
    this.groupedIssues.forEach((value, key) => {
      value.sort((a, b) => {
        switch (sortBy) {
          case "Date":
            return b.issue_date - a.issue_date;
          case "Type":
            return a.type > b.type ? 1 : -1;
          case "Importance":
            return b.importance - a.importance;
        }
      })
    });

    // Sort the group
    this.group = this.group.sort((a, b) => {
      switch (sortBy) {
        case "Date":
        case "Importance":
          return b - a;
        case "Type":
          return a.type > b.type ? 1 : -1;
      }
    }).slice(0, this.datesShown);
  }

  getMockData(): void {
    this.mockDataService.getFloor()
      .subscribe(data => {
        this.devices = data.devices;
      });
  }

  public lineChartType = 'line';
  public lineChartLegend = true;
  public lineChartLabels = [];
  public lineChartData = [];
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(48,92,255,0.1)',
      borderColor: 'rgba(48,92,255,1)',
      pointBorderColor: 'rgba(48,92,255,1)',
      pointBorderWidth: 2,
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      pointBackgroundColor: "#fff",
      pointRadius: 3
    }
  ];
  public lineChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
  };

  monthAbrNames: string [] = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sept", "Oct",
    "Nov", "Dec"
  ];

  newSelectedIssue(issue: Issue) {
    this.selectedIssue = issue;

    this.locationService.replaceState("/maintenance/i" + issue.identifier);
    this.doGraphStuff();
  }
}
