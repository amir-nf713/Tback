const express = require("express")
const app = express()
const cors = require("cors")
app.use(cors({
    origin: ["*"],
    methods: ['PUT', 'GET', 'POST', 'DELETE'],
    credentials: true

}))


app.set('trust proxy', true);

const allowedOrigins = ['*'];

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

const loginAdmin = require('./app/admin/Radmin')
app.use(api, loginAdmin)

const ticket = require('./app/ticket/Rticket')
app.use(api, ticket)

const course = require('./app/class/Rclass')
app.use(api, course)





const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});