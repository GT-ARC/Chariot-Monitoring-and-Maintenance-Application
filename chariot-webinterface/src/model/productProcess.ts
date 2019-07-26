export class ProductProcess {
  identifier: number;

  productAddInfo: string;
  productName: string;

  weight: number;
  energyUsed: number;
  deliveryDate: number;

  statusInformation: String;
  status: String;

  category: String;

  state: boolean;

  image: string;

  productFlow: IndividualProcess[];

  productInfo: {
    name: string;
    value: string;
  }[];


  constructor(identifier: number,
              productAddInfo: string,
              productName: string,
              weight: number,
              energyUsed: number,
              deliveryDate: number,
              statusInformation: String,
              status: String,
              state: boolean,
              image: string,
              productFlow: IndividualProcess[],
              productInfo: { name: string; value: string }[],
              category: string) {
    this.identifier = identifier;
    this.productAddInfo = productAddInfo;
    this.productName = productName;
    this.weight = weight;
    this.energyUsed = energyUsed;
    this.deliveryDate = deliveryDate;
    this.statusInformation = statusInformation;
    this.status = status;
    this.state = state;
    this.image = image;
    this.productFlow = productFlow;
    this.productInfo = productInfo;
    this.category = category;
  }

  getTotalRunningTime(): number {
    let sum = 0;
    for (let process of this.productFlow) {
      if (process.progress == 100)
        sum += process.total.valueOf();
      if (process.progress < 100 && process.progress > 0) {
        sum += process.running.valueOf();
        break;
      }
    }
    return sum;
  }

  getCurrentRunningProcess(): IndividualProcess {
    for (let process of this.productFlow) {
      if (process.progress < 100 && process.progress > 0)
        return process;
    }
    return null;
  }
}

export class IndividualProcess {
  icon: string;
  name: string;
  progress: number;
  paused: boolean;

  total: Date;
  running: Date;

  properties: ProcessProperty[]
}

export class ProcessProperty {
  display: boolean;
  name: string;
  unit?: string;
  value: any;
  size?: number;
  icon?: string;
  errorThreshold?: number;
}
