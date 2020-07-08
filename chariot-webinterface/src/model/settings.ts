
export class Settings {
  general: SettingsEntry[];
  devices: SettingsEntry[];
  warehouse: SettingsEntry[];
  product: SettingsEntry[];
  maintenance: SettingsEntry[];
}

export class SettingsEntry {
  name: string;
  type: string;
  tool_tip: string;
  value: any;
  callback: Function;
}
