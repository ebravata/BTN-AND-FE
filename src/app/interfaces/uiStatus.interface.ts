export interface IUiStatus {
  connected: boolean,
  statusConn: string,
  msgPublished: 'SENDING'|'CONFIRM'|'PUBLISHED',
  storedMessages: number
}
