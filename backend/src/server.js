const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const http = require("http");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./configs/connectDb");
const routes = require("./routes");
const integrateSwagger = require("./configs/swaggerConfig");
const process = require("process"); // Add this line to import the 'process' module

const app = express();
const server = http.createServer(app); // thiết lập socket io cho sau này


dotenv.config();
app.use(cors());

// Cookie parser
app.use(cookieParser());

// config data
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(bodyParser.json());

routes(app);

integrateSwagger(app);

// start app
const port = process.env.PORT || 3001;

const startApp = () => {
    server.listen(port, () => {
        console.log("Server is running in port: " + `http://localhost:${port}`);
    });
}

;(async () => {
    try {
        await connectDb();
        startApp()
    } catch (error) {
        console.log('Connection DB Error: ', error);
    }
})();
  