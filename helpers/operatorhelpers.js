const { resolve, reject } = require('promise')
const db=require('../config/connection')
const bcrypt=require('bcrypt')
const await = require('await')
const collection= require('../config/collections')
const objectId=require('mongodb').ObjectID
const { response } = require('express')

module.exports={
    doSignup:(operatordata)=>{
        return new Promise(async(resolve,reject)=>{
            var email=await db.get().collection(collection.OPERATOR_COLLECTION).findOne({email:operatordata.email})
            if (email) {
                resolve({signuperror:true})
            }
            else{
            operatordata.password=await bcrypt.hash(operatordata.password,10)
            
            db.get().collection(collection.OPERATOR_COLLECTION).insertOne(operatordata)
            .then((data)=>{
                resolve(data.ops[0])
            })
        }
        })
    },
    doLogin:(logindata)=>{
        return new Promise(async(resolve,reject)=>{
            var response={}
            var email=await db.get().collection(collection.OPERATOR_COLLECTION).findOne({email:logindata.email})
            if(email) {
                bcrypt.compare(logindata.password,email.password)
                .then((status)=>{
                    if (status){
                        console.log('success')
                        response.operator=email
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