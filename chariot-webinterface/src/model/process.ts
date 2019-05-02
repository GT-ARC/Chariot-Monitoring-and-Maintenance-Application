export class Process {
  identifier: number;

  productAddInfo: string;
  productName: string;


  statusInformation: String;
  status: String;

  state: boolean;

  image: string;

  productFlow: {
    icon: string;
    name: string;
    progress: number;
  }[];

  productInfo: {
    name: string;
    value: string;
  }[]
}
