import express, {
  Express,
  Request,
  Response,
  NextFunction,
  Router,
} from "express";
import { connectDB } from "./config/db";
import routes from "./routers/index";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import { connectRedis } from "./integrations/redis";

config();

class EventfulApp {
  public app: Express; // Property to store the Express app instance
  private port: number;
  private appName: string;

  constructor(port: number) {
    this.app = express(); // Initializing the app property
    this.port = port;
    this.appName = this.constructor.name;
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  private initializeMiddlewares() {
    // Enable Cross Origin Resource Sharing
    this.app.set("trust proxy", 1);
    const corsOptions = {
      origin: process.env.FRONTEND_URL,
      credentials: true,
      optionsSuccessStatus: 200,
    };

    this.app.use(cors(corsOptions));
    // Handle preflight requests
    // this.app.options("*", cors(corsOptions));

    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 150, // limit each IP to 100 requests per windowMs
      message:
        "Too many requests from this IP, please try again after 15 minutes",
    });
    this.app.use(limiter);
    this.app.use(morgan("dev"));
  }

  private initializeRoutes(routes: Router[]) {
    routes.forEach((route: Router) => {
      this.app.use("/api/v1/", route);
    });

    this.app.all("*", (req: Request, res: Response) => {
      res.status(404).json({ success: false, message: "Page not Found" });
    });
  }

  private initializeErrorHandling() {
    // Handle 404 errors
    this.app.use((req: Request, res: Response) => {
      res.status(404).send("Not Found");
    });

    // General error handler
    this.app.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack);
        res.status(500).send("Something went wrong!");
      }
    );
  }

  public async startServer() {
    try {
      await connectDB();
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to the database:", error);
      console.log("Server will start anyway and retry database connection...");
    }

    try {
      await connectRedis();
    } catch (error) {
      console.log("Redis unavailable - continuing without cache");
    }

    this.app.listen(this.port, "0.0.0.0", () => {
      console.log(`${this.appName} is running on port ${this.port}`);
    });
  }

  public getAppName() {
    return this.appName;
  }

  public setAppName(newName: string) {
    this.appName = newName;
  }
}

export default EventfulApp;
