const { resolve, reject } = require('promise')
const db=require('../config/connection')
const bcrypt=require('bcrypt')
const await = require('await')
const collection= require('../config/collections')
const objectId=require('mongodb').ObjectID
const { response } = require('express')

module.exports={
    findAdmin:()=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_COLLECTION).find().toArray()
                .then((response)=>{
                    resolve(response)
                })
            })
        
    },
    createAdmin:()=>{
        return new Promise(async(resolve,reject)=>{
            let password=await bcrypt.hash('admin123',10)
            let admin={
                username:'admin',
                password:password
            }
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(admin)
            .then(()=>{
                resolve()
            })

        })
    },
    doLogin:(admindata)=>{
        return new Promise(async(resolve,reject)=>{
            var response={}
            var admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({username:admindata.username})
            if(admin) {
                bcrypt.compare(admindata.password,admin.password)
                .then((status)=>{
                    if (status){
                        console.log('success')
                        response.admin=admin
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve ({loginerror:true})
                    }
                })
            }else{
                console.log('login failed')
                resolve ({loginerror:true})
            }
            
        })
    },
    findPendingBus:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BUS_COLLECTION).find({status:'pending'}).toArray()
            .then((response)=>{
                resolve(response)

            })
        })
    },
    approveBus:(busid)=>{
        return new Promise((resolve,reject)=>{

            
            db.get().collection(collection.BUS_COLLECTION).updateOne({_id:objectId(busid)},{
                $set:{
                    status:'active'
                }

            }).then(()=>{
                resolve()
            })
            })   
    },
    rejectProduct:(busid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BUS_COLLECTION).removeOne({_id:objectId(busid)}

            .then(()=>{
                resolve()
            }))

        })
    },
    getAllUsers:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).find().toArray()
            .then((response)=>{
                resolve(response)
            })
        })
    },
    getAllOperators:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.OPERATOR_COLLECTION).find().toArray()
            .then((response)=>{
                resolve(response)
            })
        })
    },
    getAllBuses:()=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BUS_COLLECTION).find({$or: [ { status: 'active'  }, { status: 'inactive' } ]}).toArray()
            .then((response)=>{
                resolve(response)
            })
        })
    },
    activeBus:(busid)=>{
        return new Promise((resolve,reject)=>{
        
            db.get().collection(collection.BUS_COLLECTION).updateOne({_id:objectId(busid)},{
                $set:{
                    status:'active'
                }

            }).then(()=>{
                resolve()
            })
            })

    },
    inactiveBus:(busid)=>{
        return new Promise((resolve,reject)=>{  
            db.get().collection(collection.BUS_COLLECTION).updateOne({_id:objectId(busid)},{
                $set:{
                    status:'inactive'
                }
            }).then(()=>{
                resolve()
            })
            })

    },
    removeOperator:(operatorid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.OPERATOR_COLLECTION).removeOne({_id:objectId(operatorid)})
            .then(()=>{
                resolve()
            })
        })
    },
    
    removeUser:(userid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).removeOne({_id:objectId(userid)})
            .then(()=>{
                resolve()
            })
        })

    }




    
}