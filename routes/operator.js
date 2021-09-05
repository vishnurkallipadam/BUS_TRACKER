const await = require('await');
const { response, request } = require('express');
var express = require('express');
const fileUpload = require('express-fileupload');
var router = express.Router();
var operatorhelpers=require('../helpers/operatorhelpers');
var bushelpers=require('../helpers/bushelpers');

const verifyLogin=(req,res,next)=>{
  if(req.session.operator)
  next()
  else
  res.redirect('/operator/operator_login')
}

/* GET home page. */
router.get('/', function(req, res) {
    if(req.session.operator){
      bushelpers.getMyBus(req.session.operator._id)
      .then((response)=>{
        console.log(response);
        res.render('operator/operator_index', {operator:req.session.operator,bus:response});

      })
        
 
    }else{
      res.redirect('/operator/operator_login')
    }
  });

router.get('/operator_signup',function(req,res){
  res.render('operator/operator_signup')
})

  router.post('/operator_signup',function(req,res){
    console.log(req.body);
    operatorhelpers.doSignup(req.body)
    .then((data)=>{
      if(data.signuperror){
        res.redirect('/operator/operator_login')
      }
      else{
        console.log(data)
        req.session.operator=data
        res.redirect('/operator')
      }
    })
    
  })
  router.get('/operator_login',function(req,res){
    if(req.session.operator){
      res.redirect('/operator')
    }else
    res.render('operator/operator_login')
  })
  router.post('/operator_login',function(req,res){
    operatorhelpers.doLogin(req.body)
    .then((response)=>{
      if(response.loginerror){
        res.redirect('/operator/login')
      }else{
        console.log(response)
        req.session.operator=response.operator
        res.redirect('/operator')
  
      }
  
    })
  });
  router.get('/logout',function(req,res){
    req.session.operator=false
    res.redirect('/operator')
  });
router.get('/add_bus/:id',verifyLogin,function(req,res){
  res.render('operator/add_bus',{operator:req.session.operator})
});
router.post('/add_bus',verifyLogin,function(req,res){
  console.log(req.body);
  bushelpers.addBus(req.body)
  .then(()=>{
    res.redirect('/operator')

  })
  
});
router.get('/removebus/:id',verifyLogin,async function(req,res){
  let busId=req.params.id
  bushelpers.removebus(busId)
  .then(()=>{
    res.redirect('/operator')
  })
  
});
router.get('/edit_bus/:id',verifyLogin,async function(req,res){
  let busId=req.params.id
  let bus=await bushelpers.getBus(busId)
  console.log('BUS DETAILS TO EDIT',bus);
  res.render('operator/edit_bus',{bus,operator:req.session.operator})
});

router.post('/edit_bus/:id',verifyLogin,function(req,res){
  bushelpers.editBus(req.params.id,req.body)
  .then(()=>{
    res.redirect('/operator')
  })
});

module.exports = router;
