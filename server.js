const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const dataRouter = require('./routes/data');
const Data = require('./models/Data');
const app = express();

//connect to mongoose
mongoose.connect('mongodb+srv://buinhatduy2000:113721250aA@cluster0.oynlr.mongodb.net/toysData?authSource=admin&replicaSet=atlas-wrgvbk-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });


//set template engine
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));


//route for the index
app.get('/', async (request, response) => {
    let data = await Data.find().sort({timeCreated: 'desc'});
    
    response.render('index', { data: data });
});

app.use(express.static("public"));
app.use('/data', dataRouter);

app.listen(5000);