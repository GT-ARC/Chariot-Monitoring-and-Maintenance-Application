import {Device, Property} from './device';

export class Issue {
  isMock: boolean = false;
  identifier: string;
  state: boolean;
  type: string;
  description: string;
  issue_date: number;
  importance: number;
  name: string;
  relatedDeviceId: string;
  relatedTo: Property[];
  url: string;
}
