export class DeviceModel {

  objectType: string;
  uuid: string;
  groupId: string;
  id: string;
  ip: string;
  kafka_topic: string;
  manufacturer: string;
  name: string;
  location: LocationModel;
  properties: PropertyModel[];
  reId: string;
  securitykey: string;
  url: string;
}

export class LocationModel {
  id: string;
  identifier: string;
  indoorposition: {
    id: string;
    indoorlat: number;
    indoorlng: number;
  };
  level: number;
  name: string;
  position: {
    id: string,
    lat: number,
    lng: number
  };
  type: string;
}

export class PropertyModel {
  kafka_topic: string;
  key: string;
  timestamp: number;
  type: string;
  unit: string;
  url: string;
  value: boolean | number | string | PropertyModel[];
  writable: boolean;
}
