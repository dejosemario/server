import express, { Express, Request, Response, NextFunction } from 'express';

class EventfulApp {
    public app: Express; // Property to store the Express app instance
    private port: number; 
    private appName: string; 

    constructor(port: number) {
        this.app = express(); // Initializing the app property
        this.port = port; 
        this.appName = this.constructor.name; 
        this.initailzeMiddlewares(); 
        this.initailzeRoutes(); 
        this.initalizeErrorHandling(); 
    }

    private initailzeMiddlewares() {
        this.app.use(express.json());
    }

    private initailzeRoutes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.send('Hello World!');
        });
    }

    private initalizeErrorHandling() {
        // Handle 404 errors
        this.app.use((req: Request, res: Response) => {
            res.status(404).send('Not Found');
        });

        // General error handler
        this.app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            console.error(err.stack);
            res.status(500).send('Something went wrong!');
        });
    }

    public async startServer() {
        try {
            // Connect to the database
            // await connectToDatabase();
            console.log('Database connected successfully');

            // Start the server
            this.app.listen(this.port, () => {
                console.log(`${this.appName} is running on port ${this.port}`);
            });
        } catch (error) {
            console.error('Failed to connect to the database:', error);
            process.exit(1); // Exit the process with an error code
        }
    }

    public getAppName() {
        return this.appName;
    }

    public setAppName(newName: string) {
        this.appName = newName;
    }
}

export default EventfulApp;
