const await = require('await');
var express = require('express');
var router = express.Router();
const adminhelpers = require('../helpers/adminhelpers');

const verifyLogin=(req,res,next)=>{
  if(req.session.admin)
  next()
  else
  res.redirect('/admin/login')
}


/* GET users listing. */
router.get('/login',async function(req, res, next) {
  let admin=await adminhelpers.findAdmin()
  if(admin.Length == 0){
    console.log(admin)
    res.render('admin/admin_login');
  }
  else{
    adminhelpers.createAdmin()
    .then(()=>{
      res.render('admin/admin_login')
    })
  }
  res.render('admin/admin_login');
});
router.post('/login',async function(req,res){
  adminhelpers.doLogin(req.body)
  .then((response)=>{
    if(response.admin){
      req.session.admin=response.admin
      res.redirect('/admin')
    }
    else{
      res.redirect('/admin/login')
    }

  })
});
router.get('/',async function(req,res){
  if(req.session.admin){
    let pendinglist=await adminhelpers.findPendingBus()
    console.log(pendinglist);
    res.render('admin/admin_home',{admin:req.session.admin,pendinglist})

  }else{
    res.redirect('/admin/login')
  }
});

router.get('/approve_bus/:id',verifyLogin,function(req,res){
  console.log(req.params.id);
  adminhelpers.approveBus(req.params.id)
  .then(()=>{
    res.redirect('/admin')
  })
  
})
router.get('/reject_bus/:id',verifyLogin,function(req,res){
  adminhelpers.rejectBus(req.params.id)
  .then(()=>{
    res.redirect('/admin')
  })
})
router.get('/all_users',async function(req,res){
  let userlist=await adminhelpers.getAllUsers()
  console.log(userlist);
  res.render('admin/all_users',{admin:req.session.admin,userlist})
});
router.get('/all_operator',verifyLogin,async function(req,res){
  let operatorlist=await adminhelpers.getAllOperators()
  console.log(operatorlist);
  res.render('admin/all_operator',{admin:req.session.admin,operatorlist})

});
router.get('/all_buses',verifyLogin,async function(req,res){
  let buslist=await adminhelpers.getAllBuses()
  console.log(buslist);

  res.render('admin/all_buses',{admin:req.session.admin,buslist})
  
});
router.get('/active_bus/:id',verifyLogin,function(req,res){
  console.log(req.params.id);
  adminhelpers.activeBus(req.params.id)
  .then(()=>{
    res.redirect('/admin/all_buses')
  })
  
})
router.get('/inactive_bus/:id',verifyLogin,function(req,res){
  console.log(req.params.id);
  adminhelpers.inactiveBus(req.params.id)
  .then(()=>{
    res.redirect('/admin/all_buses')
  })
  
})
router.get('/remove_operator/:id',verifyLogin,function(req,res){
  console.log(req.params.id);
  adminhelpers.removeOperator(req.params.id)
  .then(()=>{
    res.redirect('/admin/all_operator')
  })
})
router.get('/remove_user/:id',verifyLogin,function(req,res){
  console.log(req.params.id);
  adminhelpers.removeUser(req.params.id)
  .then(()=>{
    res.redirect('/admin/all_users')
  })
})
router.get('/logout',function(req,res){
  req.session.admin=false
  res.redirect('/admin')
});



module.exports = router;
