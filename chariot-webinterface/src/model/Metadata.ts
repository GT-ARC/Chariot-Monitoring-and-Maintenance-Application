export class Metadata {

  devicesSynchronised: boolean = false;
  warehouseSynchronised: boolean = false;
  issuesSynchronised: boolean = false;

  prodBehindPlanData: {
    y: number,
    x: number
  }[];
  prodBehindPlanPrediction: {
    y: number,
    x: number
  }[];

  constructor() {
  }
}
