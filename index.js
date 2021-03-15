const { exec } = require("child_process");
const kafka = require("./kafka/kafka")
const kafkaConfig = require('./files/kafka.json')
const fs = require('fs')
try { exec("pm2 start opcuaserver.js --name \"index\"") } catch (err) { }

{
    (async () => {
        

        var consumer = kafka.consumer(kafkaConfig.host, kafkaConfig.topic)
        consumer.on("message", async (message) => {
            var msg = json(message.value)
            if (msg.opcua && msg.deviceId) {
                if (msg.deviceId == 11) {
                    await newConfig(msg.config) == 1? restart(): console.log("nova config rejeitada")
                } else {
                    console.log(-2)
                }
            } else {
                console.log(-1)
            }
        })

        async function restart(){
            console.log("nova config aceita") 
            await exec("pm2 stop index && pm2 start index")
        }


    })()
}

async function newConfig(config) {
    try {
        if (config.username && config.password && config.dirName && configIn(config.allowAnonymous) && config.variables) {
            console.log("nova config com: ", config.variables.length, "variaveis")

            for (let index = 0; index < config.variables.length; index++) {
                if (!config.variables[index].browseName && !config.variables[index].dataType && !config.variables[index].id) {
                    
                    return -1
                }
            }
            fs.writeFileSync("./files/config.json", JSON.stringify(config))
            return 1
        }
       
        return -1
    } catch (err) {
        console.log(err)
        return -1
    }
}

function configIn(val){
    if(val == undefined || val == "undefined"){
        //console.log(val)
        return false
    }else{
        return true
    }
}
function json(json) {
    try {
        return JSON.parse(json)
    } catch (err) {
        return json
    }
}