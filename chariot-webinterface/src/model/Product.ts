export class Product {
  identifier: number;

  productAddInfo: string;
  productName: string;

  weight: number;
  energyUsed: number;
  deliveryDate: number;

  statusInformation: string;
  status: string;

  category: string;

  state: boolean;

  image: string;

  productionFlow: IndividualProcess[];

  productInfo: {
    name: string;
    value: string;
  }[];

  static createProduct(product: Product) {
    console.log("in Product ", product);
    let newProductionFlow = [];
    for (let flowEntry of product.productionFlow as Array<IndividualProcess>){
      let newProperties = [];
      for (let prop of flowEntry.properties as Array<ProcessProperty>){
        newProperties.push(prop);
      }
      let newFlowEntry = new IndividualProcess(
        flowEntry.icon,
        flowEntry.name,
        flowEntry.progress,
        flowEntry.paused,
        new Date(flowEntry.total),
        new Date(flowEntry.running),
        newProperties
      );
      newProductionFlow.push(newFlowEntry);
    }

    let newProduct = new Product(
      product.identifier,
      product.productAddInfo,
      product.productName,
      product.weight,
      product.energyUsed,
      product.deliveryDate,
      product.statusInformation,
      product.status,
      product.state,
      product.image,
      newProductionFlow,
      product.productInfo,
      product.category);

    console.log("out Product ", newProduct);
    return newProduct;
  }

  constructor(identifier: number,
              productAddInfo: string,
              productName: string,
              weight: number,
              energyUsed: number,
              deliveryDate: number,
              statusInformation: string,
              status: string,
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
    this.productionFlow = productFlow;
    this.productInfo = productInfo;
    this.category = category;
  }

  getTotalRunningTime(): number {
    let sum = 0;
    for (let process of this.productionFlow) {
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
    for (let process of this.productionFlow) {
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


  constructor(icon: string, name: string, progress: number, paused: boolean, total: Date, running: Date, properties: ProcessProperty[]) {
    this.icon = icon;
    this.name = name;
    this.progress = progress;
    this.paused = paused;
    this.total = total;
    this.running = running;
    this.properties = properties;
  }

  properties: ProcessProperty[]
}

export class ProcessProperty {
  display: boolean;
  key: string;
  unit?: string;
  value: any;
  size?: number;
  icon?: string;
  errorThreshold?: number;
}
