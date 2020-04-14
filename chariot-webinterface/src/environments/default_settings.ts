import {Settings, SettingsEntry} from "../model/settings";
import {environment} from "./environment";

export const settings : Settings = {
  general: [
    {
      name: "Mock modus",
      tool_tip: "Switch if data is generated or pulled from the backend",
      value: environment.mock,
      type: 'boolean',
      callback: function (state: any) {
        console.log("Mock modus changed");
      }
    }
  ],
  devices: [],
  warehouse: [],
  product: [],
  maintenance: []
};
