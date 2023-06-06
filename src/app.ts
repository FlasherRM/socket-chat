import express from 'express'
import {Server} from "socket.io";
import * as http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cookiesMiddleware from "./middleware/cookies.middleware";
import MessageService from "./service/message.service";
import {IMessage} from "./interfaces/message.interace";

export default class App {
    public app: express.Application;
    private readonly port: number | string;
    private server: any;
    public io: Server;
    private service: MessageService;


    constructor() {
        this.app = express()
        this.server = http.createServer(this.app);

        this.service = new MessageService()

        this.initializeMiddlewares();
        this.runRoutes();
    }


    public listen(): this {
        const server = this.app.listen(3000, () => {
            console.log(`Server is running on http://0.0.0.0:${3000}`);
        });

        this.initializeSocketServer(server);

        return this;
    }

    public listenSocket() {
        this.io.on('connection', (socket) => {
            socket.on('sendMessage', (data: IMessage) => {
                const result = this.service.addMessage(data)

                if (!result.success) {
                    socket.emit('errorSendingMessage', result.message)
                    return;
                }

                socket.emit('newMessage', data)
            })
        })
    }

    private runRoutes() {
        this.app.get('/', (req, res) => res.render('index', {messages: this.service.getMessages()}))
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.set('view engine', 'ejs')
        // this.app.use(express.static(path.join(__dirname, 'public')));
        this.app.use(express.static('public'))
        this.app.use(cookieParser());
        this.app.use(cookiesMiddleware());
    }

    private initializeSocketServer(server: http.Server) {
        this.io = new Server(server, { cors: { origin: "*" } }); // Allow all
    }
}