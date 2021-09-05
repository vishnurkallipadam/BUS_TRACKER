const { resolve, reject } = require('promise')
const db=require('../config/connection')
const bcrypt=require('bcrypt')
const await = require('await')
const collection= require('../config/collections')
const objectId=require('mongodb').ObjectID
const { response } = require('express')
const { BUS_COLLECTION } = require('../config/collections')

module.exports={
    addBus:(busdetails)=>{
        return new Promise(async(resolve,reject)=>{
            busdetails.status='pending'
            db.get().collection(collection.BUS_COLLECTION).insertOne(busdetails)
            .then((response)=>{
                resolve(response.ops[0])
            })
            
        })
    },
    getMyBus:(operatorid)=>{
        return new Promise(async(resolve,reject)=>{
            var bus=await db.get().collection(collection.BUS_COLLECTION).find({operatorid:operatorid}).toArray()
            resolve(bus)
        })
    },
    removebus:(busid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BUS_COLLECTION).removeOne({_id:objectId(busid)}).then(()=>{
                resolve()
            })
        })
    },
    getBus:(busid)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.BUS_COLLECTION).findOne({_id:objectId(busid)}).then((response)=>{
                resolve(response)
            })
        })
    },
    editBus:(busid,busdetails)=>{
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.BUS_COLLECTION).updateOne({_id:objectId(busid)},{
                $set:{
                    busname:busdetails.busname,
                    regno:busdetails.regno,
                    start:busdetails.start,
                    startingtime:busdetails.startingtime,
                    stop:busdetails.stop,
                    stoptime:busdetails.stoptime,
                    route:busdetails.route,

                }
            }).then(()=>{
                resolve()
            })
        })
    },
    getAllBus:()=>{
        return new Promise(async(resolve,reject)=>{
            bus=await db.get().collection(collection.BUS_COLLECTION).find({status:'active'}).toArray()
            resolve(bus)
        })
    },
    searchBus:(searchdata)=>{
        return new Promise(async(resolve,reject)=>{

            bus=await db.get().collection(collection.BUS_COLLECTION).find({ 

    $and: [

        {start: {$eq: searchdata.from}},
        {stop: {$eq: searchdata.to}},
        {status: {$eq: 'active'}},
        {start: {$exists: true}},
        {stop: {$exists: true}}
    ]
        
        }).toArray()
            resolve(bus)
        })
    }



}