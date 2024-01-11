import ReconnectingWebSocket from 'reconnecting-websocket'
import config from '../config'
export const socket = new ReconnectingWebSocket(`wss://${config.replace('https://', '')}`)
