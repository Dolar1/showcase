const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');


//storage engine
const storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function(req, file , cb){
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// intialize Uploads
const upload = multer({
  storage: storage,
  // this code down below we can set the file size of the file and its unit is given in bytes
  limits:{fileSize: 1000000},

  //filtering upon requirenment of file...
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');


//checking the type of file now which is being uploaded by the user
function checkFileType(file, cb){
  //allowed extensions
  const filetypes = /jpeg|jpg|png|gif/;
  //check extensions
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //check mime type...
  const mimetype = filetypes.test(file.mimetype);

  //checkingg
  if(mimetype && extname){
    return cb(null, true);
  }else{
    return cb('Error :Images only');
  }
}

var app= express();

//ejs
app.set('view engine', 'ejs');

//public folder
app.use(express.static('./public'));

app.get('/', function(req, res){
  res.render('index');
});

app.post('/upload', (req, res)=>{
  upload(req, res, function(err){
      if(err){
        res.render('index',{
          msg: err
        });
      }else{

        if(req.file == undefined){
          res.render('index', {
            msg: 'Error: no file selcted'
          });
        }else{
          res.render('index', {
            msg: 'file uploaded',
            file: `uploads/${req.file.filename}`
          });
        }

          }
  });
});

const port = process.env.PORT || 9000;
app.listen(port, function(req, res){
  console.log('listening on 9000');

});
