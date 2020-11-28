const express = require('express');
const app = express();
const router = express.Router();

//Routes
router.get('/',(req,res)=>res.send('index.html'));



//connecting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));