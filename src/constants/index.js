export const configRTCPeerConnection = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: process.env.TURN_SERVER,
      credential: process.env.TURN_PASSWORD,
      username: process.env.TURN_USERNAME
    }
  ]
}
