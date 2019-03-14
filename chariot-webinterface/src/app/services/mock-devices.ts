import {Device} from "../../model/device";
import {Issue} from "../../model/issue";
import {Location} from "../../model/location";
import {Floor} from "../../model/floor";

export const DEVICES: Device[] = [
  {
    idenfitifier: 0,
    name: "Device 1",
    symbole: null,

    power_state: true, power_consumption: 37,

    running: 200, down_time: 5,

    description: [
      {
        title: "Lorem ipsum",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit consectetur eum asperiores, doloribus, facilis assumenda itaque commodi obcaecati esse, blanditiis consequatur reprehenderit. Porro, possimus tempore. Architecto rerum porro aliquid a."
      },
      {
        title: "Dolor",
        desc: "Lorem ipsum dolor"
      },
      {
        title: "Adipisicing",
        desc: "amet consectetur adipisicing elit."
      },
      {
        title: "Architecto",
        desc: "Architecto rerum porro aliquid a."
      }
    ],
    issues: [
      {
        state: false,
        description: "",
        issue_date: Date.now(),
        importance: 0
      },
      {
        state: true,
        description: "",
        issue_date: Date.now(),
        importance: 0
      },
      {
        state: true,
        description: "",
        issue_date: Date.now(),
        importance: 0
      },
      {
        state: true,
        description: "",
        issue_date: Date.now(),
        importance: 0
      },
      {
        state: true,
        description: "",
        issue_date: Date.now(),
        importance: 0
      }
    ],

    timeline: [],
  },
];
