//Routing
const express = require('express');
const routes =  require('./app/routes');
const {json, urlencoded} = require('body-parser');
const cors = require('cors');


//DataBase connecting
const mongoose = require('mongoose');
const db = require('../Schemas/keysToRemote').MongoURI;
mongoose.connect(db, {useNewUrlParser: true})
.then(console.log('[+] MongoDB connected ...'))
.catch(err=> console.error(err));

//express config
var corsOptions = {
    origin: "http://localhost:8081"
};
const app = express();
app.use(cors(corsOptions));
//parse requests of content type - application/json
app.use(json());
//parse 
app.use(urlencoded({ extended: true}));

//Setting routes to the express server
routes(app);


//connecting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));