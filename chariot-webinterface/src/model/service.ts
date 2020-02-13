import {LocationModel} from './deviceModel';

export class Service {
  public objectType: string;
  public name: string;
  public uuid: string;
  public identifier: string;
  public securitykey: string;
  public ip: string;
  public group_id: string;
  public reId: string;
  public location: LocationModel;
  public groupId: string;
  public properties: ServiceProperty[];
  public operations: ServiceOperation[];
}

export class ServiceProperty {
  public key: string;
  public url: string;
  public kafka_topic: string;
  public operation: string;
  public relatedTo: string[];
  public timestamp: string;
  public type: string;
  public value: string;
  public writable: string;
}

export class ServiceOperation {
  public name: string;
  public inputs: string[];
  public outputs: string[];
}
