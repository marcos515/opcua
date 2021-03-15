const opcua = require("node-opcua");
const fs = require('fs')
const config = require('./files/config.json')
const kafka = require("./kafka/kafka")
const kafkaConfig = require('./files/kafka.json')

var value = []

{
    (async () => {
        var userManager = {
            isValidUser: function (userName, password) {
                if (userName == config.username && password == config.password) {
                    return true;
                }
                return false;
            }
        };


        var server = new opcua.OPCUAServer({ port: config.serverPort, userManager: userManager, allowAnonymous: config.allowAnonymous });

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
                browseName: config.variables[index].name,
                nodeId: 's=' + config.variables[index].id,
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
            var endpointUrl = server.discoveryServerEndpointUrl;
            console.log(`opc server is running at: opc.tcpa://localhost:${config.serverPort}`);
        });

        var consumer = kafka.consumer(config.dataHost, config.dataTopic)
        consumer.on("message", async (message) => {
            var msg = json(message.value)
            if(number(msg.dispositivoId) == number(config.dispositivoId) && msg.values){
                newValues(msg.values)
            }
        })

    })()
}

function newValues(values){
    for (let index = 0; index < config.variables.length; index++) {
        for (let index2 = 0; index2 < values.length; index2++) {
            if (config.variables[index].name == values[index2].name) {
                value[index] = values[index2].value
            }
            
        }
    }
}

function getValue(i) {
    return value[i]
}

function setValue(id, data) {
    let msg = {"ts":new Date().getTime(), "dispositivoId":11, "opcua":true, "message":"received request to write value",
     "req":{"id":id,"value":data}}
    kafka.producer(config.dataHost, config.dataTopic, JSON.stringify(msg))
    /*
    for (let index = 0; index < config.variables.length; index++) {
        if (config.variables[index].id == id) {
            value[index] = data;
        }
    }*/
}

function json(json){
    try {
        return JSON.parse(json)
    } catch (err) {
        return json
    }
}

function number(n){
    try {
        return parseInt(n)
    } catch (err) {
        return n
    }
}