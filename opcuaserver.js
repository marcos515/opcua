const opcua = require("node-opcua");
const fs = require('fs')
const config = require('./files/config.json')

var value = []

setTimeout(async () => {
    var userManager = {
        isValidUser: function (userName, password) {
            if (userName == config.username && password == config.password) {
               // console.log(typeof config.password, config.password, password == config.password)
                return true;
            }
            return false;
        }
    };


    var server = new opcua.OPCUAServer({ userManager: userManager, allowAnonymous: config.allowAnonymous });

    await server.initialize();

    const namespace = server.engine.addressSpace.getOwnNamespace();
    const device = namespace.addObject({
        browseName: config.dirName,
        organizedBy: server.engine.addressSpace.rootFolder.objects
    });

    for (let index = 0; index < config.variables.length; index++) {
        value[index] = -1;
        namespace.addVariable({
            dataType: config.variables[index].dataType,
            componentOf: device,
            browseName:  config.variables[index].browseName,
            nodeId: 's='+config.variables[index].id,
            value: {
                get: function () {
                    return new opcua.Variant({ dataType: opcua.DataType[config.variables[index].dataType], value: getValue(index) });
                }
            }
        });
    }

    server.on("request", (req) => {
        if (req.nodesToWrite) {
            let array = req.nodesToWrite

            for (let index = 0; index < array.length; index++) {
                setValue(array[index].nodeId.value, array[index].value.value.value)
            }
        }
    })



    await server.start(function () {
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log('endpoint: ' + endpointUrl);
    });



}, 10)

function getValue(i) {
   
    return value[i]
    
}

function setValue(id, data) {
    //console.log(id, data)

    for (let index = 0; index < config.variables.length; index++) {
        if(config.variables[index].id == id){
            value[index] = data;
            
        }
       
    }
}