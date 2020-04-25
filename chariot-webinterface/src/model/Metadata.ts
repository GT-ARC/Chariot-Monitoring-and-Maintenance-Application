import {EventEmitter} from "events";

export class Metadata {

  private _devicesSynchronised: boolean = false;
  private _warehouseSynchronised: boolean = false;
  private _issuesSynchronised: boolean = false;

  private _deviceEventEmitter: EventEmitter = new EventEmitter();

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


  get deviceEventEmitter(): EventEmitter {
    return this._deviceEventEmitter;
  }

  get devicesSynchronised(): boolean {
    return this._devicesSynchronised;
  }

  set devicesSynchronised(value: boolean) {
    this._deviceEventEmitter.emit("synchronised");
    this._devicesSynchronised = value;
  }

  get warehouseSynchronised(): boolean {
    return this._warehouseSynchronised;
  }

  set warehouseSynchronised(value: boolean) {
    this._warehouseSynchronised = value;
  }

  get issuesSynchronised(): boolean {
    return this._issuesSynchronised;
  }

  set issuesSynchronised(value: boolean) {
    this._issuesSynchronised = value;
  }
}
