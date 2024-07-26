import express, {
  Express,
  Request,
  Response,
  NextFunction,
} from "express";
import helmet from "helmet";
import fileUpload from "express-fileupload";
import dotenv from "dotenv";
import routes from "./startup/routes";
import { AUTH } from "./constants/AUTH";
import bodyParser from "body-parser";
import { SECURITY, logger, envUtils } from "ep-micro-common";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./config/swagger.json"
import * as CONST from "./constants/CONST";

dotenv.config();

const app: Express = express();

const resolveCrossDomain = function (
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header('Access-Control-Allow-Headers', CONST.allowed_headers);
  res.header("Access-Control-Expose-Headers", "Version");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Strict-Transport-Security", "max-age=15552000");
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
};

// Set appVersion number to Header
const setAppVersiontoHeader = async function (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  next();
};

app.use(bodyParser.json({
  limit: envUtils.getStringEnvVariableOrDefault("EP_BODY_PARSER_LIMIT", "5mb")
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.set("view engine", "ejs");
app.use(helmet());
app.use(resolveCrossDomain, setAppVersiontoHeader);
app.use(function applyXFrame(req: Request, res: Response, next: NextFunction) {
  res.set("X-Frame-Options", "DENY");
  next();
});
app.use('/api/v1/admin/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

SECURITY(app, AUTH);
routes(app);

process.on("uncaughtException", function (err) {});

const port = process.env.PORT || 5003;
const server = app.listen(port, () => {
  logger.info(`[SERVER STARTED] Listening to port [${port}]`);
});

export = server;
