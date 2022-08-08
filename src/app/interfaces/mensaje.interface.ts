export class mqttMensaje {


  constructor(
    public Timestamp:  string = '',
    public Event_type: 'ANDON' | 'PRODUCCION',
    public Datetime:   string = '',
    public Station_ID: string = '',
    public Elapsed:    string = '',
    public Source:     string = '',
    public ID:         string = '',
    public isRealtime?: boolean,
    public State?:      string,
    ){  }

}
