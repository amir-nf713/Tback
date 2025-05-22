const express = require("express")
const app = express()
const path = require('path');

app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));

const cors = require("cors");
const { default: axios } = require("axios");
app.use(cors({
    origin: ["http://localhost:3000", 'http://185.243.48.159:3000', 'http://dash.tadrisyar.com', 'https://dash.tadrisyar.com'],
    methods: ['PUT', 'GET', 'POST', 'DELETE'],
    credentials: true

}))
app.use(express.json({ limit: '100000000000mb' }));
app.use(express.urlencoded({ limit: '100000000000mb', extended: true }));



app.set('trust proxy', true);

const allowedOrigins = ['http://localhost:3000', 'http://185.243.48.159:3000', 'http://dash.tadrisyar.com', 'https://dash.tadrisyar.com'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin); // اجازه دسترسی به دامنه‌های مشخص شده
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

app.use(express.json());

const api = '/api/tadrisyar'

const login = require('./app/login/Rlogin')
app.use(api, login)
// 

const loginAdmin = require('./app/admin/Radmin')
app.use(api, loginAdmin)

const ticket = require('./app/ticket/Rticket')
app.use(api, ticket)

const course = require('./app/class/Rclass')
app.use(api, course)

const authentication = require('./app/Authentication/Rauthentication')
app.use(api, authentication)

const sendmony = require('./app/withdrawalMoney/RwithdrawalMoney')
app.use(api, sendmony)

const getprice = require('./app/USD/Rusd')
app.use(api, getprice)



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});