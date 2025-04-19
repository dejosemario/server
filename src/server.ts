import { config } from 'dotenv';
import EventfulApp from './app'; 

config();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const myAppInstance = new EventfulApp(port);

// Start the server
myAppInstance.startServer();

