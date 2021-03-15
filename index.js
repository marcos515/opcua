const { OPCUAServer, findServers } = require("node-opcua");
const opcua = require("node-opcua");
const fs = require('fs')
var value = 0
setTimeout(async () => {
var userManager = {

    isValidUser: function (userName, password) {
    
        if (userName === "default" && password === "default") {
    
            return true;
        }
    
    
        return false;
    }};
    var server_options = {
        
        userManager: userManager,
        
        allowAnonymous: false,
        };
        
        var server = new OPCUAServer(server_options);

    await server.initialize();

    const namespace = server.engine.addressSpace.getOwnNamespace();
    const device = namespace.addObject({
        browseName: "SomeObject",
        organizedBy: server.engine.addressSpace.rootFolder.objects
    });

    namespace.addVariable({
        dataType: 'Int16',
        componentOf: device,
        browseName: 'tag1',
        nodeId: 's=tag1.tag1',
        value: {
            get: function () {
                return new opcua.Variant({dataType: opcua.DataType.Int16, value: getValue() });
            }
        }
    });

    server.on("request", (req)=>{
      
      if(req.nodesToWrite){
          let array = req.nodesToWrite

          for (let index = 0; index < array.length; index++) {
            value = array[index].value.value.value
              
          }
      }
        //  fs.writeFileSync('./req.txt', JSON.stringify(req, null, 5))
    })
    
    
  
    await server.start(function() {
        
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log('endpoint: ' + endpointUrl );
      });

  
    
}, 10)

function getValue(){
    return value
}