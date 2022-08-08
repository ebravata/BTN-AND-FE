import { mqttMensaje } from "src/app/interfaces/mensaje.interface"

const ejemplo: mqttMensaje = {
  Timestamp:"1653755578",
  Event_type:"ANDON",
  Datetime: "28/05/2022 11:32:58 a. m.",
  Station_ID:"OP140",
  State:"ACTIVE",
  Elapsed:"0.000000",
  Source:"",
  ID:"ID20220528113258.334"
}

const ejemplo2: mqttMensaje =  {
  Timestamp:"1653755612",
  Event_type:"ANDON",
  Datetime:"28/05/2022 11:33:32 a. m.",
  Station_ID:"OP140",
  State:"OFF_Meeting_ON",
  Elapsed:"0.000000",
  Source:"",
  ID:"ID20220528113332.260"
}

const ejemplo3: mqttMensaje = {
  Timestamp: "1653755971",
  Event_type:"ANDON",
  Datetime:"28/05/2022 11:39:31 a. m.",
  Station_ID:"OP140",
  State:"MATERIALS_ON",
  Elapsed:"0.000000",
  Source:"",
  ID:"ID20220528113931.246"
}

const ejemplo4: mqttMensaje = {
  Timestamp:"1653756041",
  Event_type:"ANDON",
  Datetime:"28/05/2022 11:40:41 a. m.",
  Station_ID:"OP140",
  State:"MATERIALS_OFF",
  Elapsed:"70.118307",
  Source:"",
  ID:"ID20220528114041.364"
}
