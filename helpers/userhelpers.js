const { resolve, reject } = require('promise')
const db=require('../config/connection')
const bcrypt=require('bcrypt')
const await = require('await')
const collection= require('../config/collections')
const objectId=require('mongodb').ObjectID
const { response, request } = require('express')

module.exports={
    doSignup:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            var email=await db.get().collection(collection.USER_COLLECTION).findOne({email:userdata.email})
            if (email) {
                resolve({signuperror:true})
            }
            else{
            userdata.password=await bcrypt.hash(userdata.password,10)
            
            db.get().collection('users').insertOne(userdata)
            .then((data)=>{
                resolve(data.ops[0])
            })
        }
        })

        
    },
    doLogin:(userdata)=>{
        return new Promise(async(resolve,reject)=>{
            var response={}
            var email=await db.get().collection(collection.USER_COLLECTION).findOne({email:userdata.email})
            if(email) {
                bcrypt.compare(userdata.password,email.password)
                .then((status)=>{
                    if (status){
                        console.log('success')
                        response.user=email
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
    

  
}