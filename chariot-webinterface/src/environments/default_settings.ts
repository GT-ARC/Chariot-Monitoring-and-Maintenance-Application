import {Settings, SettingsEntry} from "../model/settings";
import {environment} from "./environment";

export const settings : Settings = {
  general: [
    {
      name: "Mock modus",
      tool_tip: "Switch if data is generated or pulled from the backend",
      value: false,
      type: 'boolean',
      callback: function (state: any) {
        //  this.settings.general.find(ele => ele.name == 'Mock modus').value = true;
        location.reload();
      }
    }
  ],
  devices: [],
  warehouse: [],
  product: [],
  maintenance: []
};
