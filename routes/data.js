const { request, response } = require('express');
const express = require('express');
const Data = require('./../models/Data');
const router = express.Router();
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, './public/uploads/images')
    },

    filename: function(request, file, callback){
        callback(null, Date.now() + file.originalname)
    }
});


const upload = multer({
    storage:storage,
    limits:{
        fieldSize: 1024*1024*3
    },
})

router.get('/new', (request, response) => {
    response.render('new');
});

//view route
router.get('/:slug', async (request, response) => {
    let data = await Data.findOne({slug: request.params.slug});

    if(data){
        response.render('detail',{data:data});
    }else{
        response.redirect('/');
    }
});

//handles new post
router.post('/', upload.single('image') , async (request, response) => {
    // console.log(request.body);
    let data = new Data({
        title: request.body.title,
        price: request.body.price,
        description: request.body.description,
        img: request.file.filename,
    });

    try {
        data = await data.save();
        response.redirect(`data/${data.slug}`);
    } catch (error) {
        console.log(error)
    }

});

router.get('/edit/:id', async (request, response)=>{
    let data = await Data.findById(request.params.id);
    response.render('edit', {data:data});
});

router.put('/:id', async (request, response)=>{
    request.data = await Data.findById(request.params.id);
    let data = request.data
    data.title = request.body.title
    data.price = request.body.price
    data.description = request.body.description

    try {
        data = await data.save();

        response.redirect(`/data/${data.slug}`);
    } catch (error) {
        console.log(error)
        response.redirect(`data/edit/${data.id}`, {data:data});
    }
});


router.delete('/:id', async(request, response)=>{
    await Data.findByIdAndDelete(request.params.id);
    response.redirect('/');
});

module.exports = router;