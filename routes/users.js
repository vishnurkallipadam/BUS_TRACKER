const { response } = require('express');
var express = require('express');
var router = express.Router();
const userhelpers=require('../helpers/userhelpers')
const await = require('await');
const bushelpers = require('../helpers/bushelpers');
const verifyLogin=(req,res,next)=>{
  if(req.session.user)
  next()
  else
  res.redirect('/login')
}

/* GET home page. */
router.get('/', function(req, res, next) {

    if(req.session.user){
     
        res.render('user/user_index', { user:req.session.user});

    }else{
      res.redirect('/login')
    }
 
  
});
router.get('/login',function(req,res){
  res.render('user/user_login',{user:true});
});
router.post('/login',function(req,res){
  console.log(req.body)
  userhelpers.doLogin(req.body)
  .then((response)=>{
    if(response.loginerror){
      res.redirect('/login')
    }else{
      console.log(response)
      req.session.user=response.user
      res.redirect('/')

    }
  })

});
router.post('/register',function(req,res){
  console.log(req.body)
  userhelpers.doSignup(req.body)
  .then((data)=>{
    if(data.signuperror){
      res.redirect('/register')
    }
    else{
      console.log(data)
      req.session.user=data
      res.redirect('/')
    }
  })

});
router.get('/logout',function(req,res){
  req.session.user=false
  res.redirect('/')
});
router.get('/find_bus',verifyLogin,async function(req,res){
  res.render('user/user_search',{user:req.session.user})
})

router.post('/find_bus',verifyLogin,async function(req,res){
  searchdata=req.body
  console.log(searchdata);
  bushelpers.searchBus(searchdata)
  .then((response)=>{
    console.log(response);
    res.render('user/user_search',{user:req.session.user,bus:response})


  })
  
})

module.exports = router;
