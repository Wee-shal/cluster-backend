import ReconnectingWebSocket from 'reconnecting-websocket'
import serverUrl from '../config'
export const socket = new ReconnectingWebSocket(`${serverUrl.replace(/^http/, 'ws')}`)
