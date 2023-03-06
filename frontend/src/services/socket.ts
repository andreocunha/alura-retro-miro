import io from 'socket.io-client';

// const socket = io('http://localhost:4000');
const socket = io('http://192.168.15.43:4000');
// const socket = io('https://alura-retro-miro-server.herokuapp.com');

export { socket };
