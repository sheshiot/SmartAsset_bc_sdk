"use strict";

const assert = require('assert');
var express = require('express');
        var app = express();
        

app.all('*', function(req, res, next) {
	res.header("Content-Type", "text/plain");
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "xtoken");
	next();
});

//DIGI
const connection = {
    port: 5001,
    host: '127.0.0.1',
    user: "multichainrpc",
    pass: "BLVUFXWUGvEZ8zD8dKvuEtew1PqjYsyGrrXPCMC8grmy"
}


//LOCAL
// const connection = {
//     port: 7198,
//     host: '127.0.0.1',
//     user: "multichainrpc",
//     pass: "GXFyoMgyRNmi4WgLiJsZQnhokUGMdFUSfQwY9LGxZ2Ft"
// }

const multichain = require("../index.js")(connection);

//create a server object:
var server = app.listen(4000, function() {
    console.log('Listening on port %d', server.address().port);
    console.log('Press Ctrl-C to terminate');
    });
    app.get('/getInfo', function(req, res){
        multichain.getInfo((err, info) => {
          if(err){
              throw err;
          }
          console.log(info);
            res.send(JSON.stringify(info));
                          return res.end();
      })
      
    });
    



    app.get('/registerDevice', function(req, res){
	var date = new Date();
 var dateStr = date.toLocaleDateString();
var timeStr = date.toLocaleTimeString();
        var Key = req.query.DeviceID+"_"+req.query.ID;
        var DeviceData ={
            "DeviceInfo": [
            {
                    "ID":req.query.ID,
                    "DeviceID":req.query.DeviceID,
                    "NAME":req.query.NAME,
                    "TYPE":req.query.TYPE	
            }
            ],
            "SensorData":[
                
                ]
        };
    
        multichain.listStreamKeyItems({
            stream: "SmartAssets",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length === 0) {
                let dataHex = Buffer.from(JSON.stringify(DeviceData), 'utf8').toString('hex');
                multichain.publish({stream:"SmartAssets",key: Key , data: dataHex }, (err, results) => {
                   // console.log(res)
                    if(err){
                        res.send(JSON.stringify(err));
                        return res.end();
                    }else{
var params = req.query;
			     var options = { method: 'GET',
      url: 'https://smdiot-p1942521372trial.dispatcher.hanatrial.ondemand.com/dbchain/digitalpersonas/assetReg.xsjs',
      qs: 
       { TXID: result,
         DEVICEID: params.ID, 
         NAME: params.NAME,
         TYPE: params.TYPE,
         DATE: dateStr,
         TIME: timeStr,
         },
      headers: 
       { 'cache-control': 'no-cache',
         Connection: 'keep-alive',
         Cookie: 'BIGipServer~jpaas_folder~dispatcher.hanatrial.ondemand.com=!Rk92XWQpK6tp5dvfolxFifn6mxJejwzecQLxJ52vPMEYCKqcmtC/wtA368iFRJcvfBPZxmaW0MMA9Uw=; JSESSIONID=91543F60B3983DD79EB5CA45B581FD1ACED3F7548C3BA8DDF0C595517F4CF062',
         'Accept-Encoding': 'gzip, deflate',
         Host: 'smdiot-p1942521372trial.dispatcher.hanatrial.ondemand.com',
         'Postman-Token': 'bdda3878-19bf-4702-9eb4-94770b784a85,6068736f-ccce-495e-a2ee-8c238f3f11c3',
         'Cache-Control': 'no-cache',
         Accept: '*/*',
         'User-Agent': 'PostmanRuntime/7.16.3' } };  
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
    
      var results = {
        "status": 200,
        'message': "Asset Registered successfully"
      };
      res.status(200).json(results);
    });
                    }
                })
        }else{

            var response ={
                "message":"Device Already Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 



            




    });
    
    app.get('/postSMDDataToBC', function(req, res){
        var Key = req.query.DeviceID+"_"+req.query.ID;
        multichain.listStreamKeyItems({
            stream: "bane",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length !== 0) {
            let dataString = Buffer.from(results[results.length - 1].data, 'hex').toString();
            results[results.length - 1].data = JSON.parse(dataString);
           var oDeviceInfo = results[results.length - 1].data.DeviceInfo[0];
        //    const uniqidNew = uniqid.time();
        //    uniqueIDLekhPal=oKisaanInfo.kisaan_id+"L_"+uniqidNew;
           var oSensorData ={};
           oSensorData.ID = req.query.ID;
           oSensorData.STATUS = req.query.STATUS;
           oSensorData.LATITUDE = req.query.LATITUDE;
           oSensorData.LONGITUDE = req.query.LONGITUDE;
           oSensorData.DATE = req.query.DATE;
           oSensorData.TIME = req.query.TIME;
           oSensorData.DeviceID = req.query.DeviceID;

            results[results.length - 1].data.SensorData.push(oSensorData);

            let dataHex = Buffer.from(JSON.stringify(results[results.length - 1].data), 'utf8').toString('hex');
            multichain.publish({stream:"SmartAssets",key: req.query.DeviceID+"_"+req.query.ID, data: dataHex }, (err, results) => {                       
                if(err){
                    res.send(JSON.stringify(err));
                    return res.end();
                }else{
                    var obj ={};
                    obj.statusCode = 200;
                    obj.txid = results;
                    obj.deviceInfo = oDeviceInfo;
                    res.send(JSON.stringify(obj));
                    return res.end();
                }
            }) 
        }else{

            var response ={
                "message":"Device Not Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 
    });

    app.get('/postGasDataToBC', function(req, res){
        var Key = req.query.DeviceID+"_"+req.query.ID;
        multichain.listStreamKeyItems({
            stream: "bane",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length !== 0) {
            let dataString = Buffer.from(results[results.length - 1].data, 'hex').toString();
            results[results.length - 1].data = JSON.parse(dataString);
           var oDeviceInfo = results[results.length - 1].data.DeviceInfo[0];
        //    const uniqidNew = uniqid.time();
        //    uniqueIDLekhPal=oKisaanInfo.kisaan_id+"L_"+uniqidNew;
           var oSensorData ={};
           oSensorData.ID = req.query.ID;
           oSensorData.TEMPERATURE = req.query.TEMPERATURE;
           oSensorData.PRESSURE = req.query.PRESSURE;
           oSensorData.HUMIDITY = req.query.HUMIDITY;
           oSensorData.IAQ = req.query.IAQ;
           oSensorData.DeviceID = req.query.DeviceID;

            results[results.length - 1].data.SensorData.push(oSensorData);

            let dataHex = Buffer.from(JSON.stringify(results[results.length - 1].data), 'utf8').toString('hex');
            multichain.publish({stream:"SmartAssets",key: req.query.DeviceID+"_"+req.query.ID, data: dataHex }, (err, results) => {                       
                if(err){
                    res.send(JSON.stringify(err));
                    return res.end();
                }else{
                    var obj ={};
                    obj.statusCode = 200;
                    obj.txid = results;
                    obj.deviceInfo = oDeviceInfo;
                    res.send(JSON.stringify(obj));
                    return res.end();
                }
            }) 
        }else{

            var response ={
                "message":"Device Not Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 
    });

    app.get('/postWaterProbeDataToBC', function(req, res){
        var Key = req.query.DeviceID+"_"+req.query.ID;
        multichain.listStreamKeyItems({
            stream: "bane",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length !== 0) {
            let dataString = Buffer.from(results[results.length - 1].data, 'hex').toString();
            results[results.length - 1].data = JSON.parse(dataString);
           var oDeviceInfo = results[results.length - 1].data.DeviceInfo[0];
        //    const uniqidNew = uniqid.time();
        //    uniqueIDLekhPal=oKisaanInfo.kisaan_id+"L_"+uniqidNew;
           var oSensorData ={};
           oSensorData.ID = req.query.ID;
           oSensorData.TEMPERATURE = req.query.TEMPERATURE;
           oSensorData.PH = req.query.PH;
           oSensorData.CONDUCTIVITY = req.query.CONDUCTIVITY;
           oSensorData.DeviceID = req.query.DeviceID;

            results[results.length - 1].data.SensorData.push(oSensorData);

            let dataHex = Buffer.from(JSON.stringify(results[results.length - 1].data), 'utf8').toString('hex');
            multichain.publish({stream:"SmartAssets",key: req.query.DeviceID+"_"+req.query.ID, data: dataHex }, (err, results) => {                       
                if(err){
                    res.send(JSON.stringify(err));
                    return res.end();
                }else{
                    var obj ={};
                    obj.statusCode = 200;
                    obj.txid = results;
                    obj.deviceInfo = oDeviceInfo;
                    res.send(JSON.stringify(obj));
                    return res.end();
                }
            }) 
        }else{

            var response ={
                "message":"Device Not Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 
    });

    app.get('/getDeviceDataFromBC', function(req, res){
        var Key = req.query.DeviceID+"_"+req.query.ID;
        multichain.listStreamKeyItems({
            stream: "bane",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length !== 0) {
            let dataString = Buffer.from(results[results.length - 1].data, 'hex').toString();
            results[results.length - 1].data = JSON.parse(dataString);
           var oSensorData = results[results.length - 1].data.SensorData[results[results.length - 1].data.SensorData.length - 1];
           var oDeviceInfo = results[results.length - 1].data.DeviceInfo[0];

           var finalobj = {
               "deviceInfo":oDeviceInfo,
               "sensorData":oSensorData
           };
           res.send(JSON.stringify(finalobj));
        return res.end();
        }else{

            var response ={
                "message":"Device Not Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 
    });

    app.get('/getDeviceDataTrackingHistory', function(req, res){
        var Key = req.query.DeviceID+"_"+req.query.ID;
        multichain.listStreamKeyItems({
            stream: "bane",
            key: Key,
            verbose: true
        }, (err, results) => {
            if(err){
                res.send(JSON.stringify(err));
                return res.end();
            }
            if(results.length !== 0) {
            let dataString = Buffer.from(results[results.length - 1].data, 'hex').toString();
            results[results.length - 1].data = JSON.parse(dataString);
           var oDeviceInfo = results[results.length - 1].data;
           res.send(JSON.stringify(oDeviceInfo));
        return res.end();
        }else{

            var response ={
                "message":"Device Not Registered in Blockchain Network"
            };
            res.send(JSON.stringify(response));
            return res.end();
        }
        }) 
    });

    


