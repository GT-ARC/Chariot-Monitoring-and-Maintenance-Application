export class ProductProcess {
  identifier: number;

  productAddInfo: string;
  productName: string;

  weight: number;
  energyUsed: number;
  deliveryDate: number;

  statusInformation: String;
  status: String;

  state: boolean;

  image: string;

  productFlow: IndividualProcess[];

  productInfo: {
    name: string;
    value: string;
  }[]
}

export class IndividualProcess {
  icon: string;
  name: string;
  progress: number;
  paused: boolean;

  total: Date;
  running: Date;

  properties: {
    display: boolean;
    name: string;
    unit?: string;
    value: any;
    size?: number;
    icon?: string;
    errorThreshold?: number;
  }[]
}
