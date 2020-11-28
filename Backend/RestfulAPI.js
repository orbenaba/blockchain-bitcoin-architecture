const express = require('express');
const app = express();

//Routes
app.use('/',require('../Backend/index.html'));


//connecting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));