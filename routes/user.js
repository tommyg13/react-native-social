const express    = require("express"),
      router     = express.Router(),
      User       = require("../models/User"),
      multer     = require('multer'),
      checkAuth = require("../middleware/check-auth");
      
const fileFilter = (req,file,cb)=>{
    const allowedTypes = ["image/jpeg","image/png"];    
    if(!allowedTypes.includes(file.mimetype)){
        return cb(new Error("only jpeg/png are allowed"),true);
    } 
    cb(null,true);
};

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./static/uploads/avatars');
    },
    filename: (req,file,cb) => {
        cb(null, new Date().toISOString() + file.originalname);
    }
});
const upload = multer({
    storage, 
    limits: {
    fileSize: 3000
        
    },
    fileFilter
});


router.post('/login',(req,res)=>{
   const { email, password } = req.body;
   User.findOne({email})
       .then(user=>{
          if(user && user.isValidPassword(password)) {
              res.send({token:user.generateToken()});
          } else {
               res.status(401).json({error:"Invalid Credentials"});
           } 
       });
});

router.post('/register', (req,res)=>{
    const { email, username, password, password_conf } = req.body;
    const errors = {};
    
    User.findOne()
        .where("email").equals(email)
        .then(user=>{
           if(user) {
               errors.email = "Email already in use";
           } 
           if(password !== password_conf) {
               errors.password = 'Passwords do not match';
           }
          if(Object.keys(errors).length > 0) {
              return res.status(401).json({errors});
          } else {
              let user = new User();
              user.email = email;
              user.password = user.generateHashedPass(password);
              user.username = username;
              
              user.save(err=>{
                  if(err) {
                  errors.username = "Username exists";
                  res.status(400).json({errors});                      
                  }
                  else {
                  res.json({msg: "You have successfully registered and you can now login"});                      
                  }
              });
          }
        });
});

router.post("/upload-avatar", checkAuth,upload.single('image'), (req,res)=>{
    const filePath  = `https://preview.c9users.io/gkazikas/my-social-backend/${req.file.path}`;
    const userEmail = req.userData.email;
    
    User.findOne({email: userEmail}, function (error, user) {
        if(error) {
            res.status(404).json({error:"user not found"});
        }
        else {
            user.avatar = filePath;
            user.save(function (err) {
                if(err) {
                    res.status(500).json({error:"error updating profile image"});
                } else {
                    // send renewed token to upadte saved user with new image
                    res.json({token:user.generateToken()});
                }
            });
        }
    });
});

router.use((err,req,res,next)=>{
   if(err.code === "LIMIT_FILE_SIZE") {
       res.status(422).json({error:"Max allowed size is 2mb"});
       return;
   }    
});

module.exports = router;