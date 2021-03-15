

async function producer(host, topic, msg) {
    return new Promise(async (resolve, reject) =>{

    const  Kafka  = require('kafkajs').Kafka
 
    const kafka = new Kafka({
      clientId: 'modem',
      brokers: [host]
    })
     
    const producer = kafka.producer()
    
      // Producing
      await producer.connect()
      .then(async (a)=>{
       
      await producer.send({
        topic: topic,
        messages: [
          { value: msg },
        ],
      }).then((a)=>{
        resolve(host)
        producer.disconnect()
      }).catch((a)=>{
        reject(a)
      })

    }).catch((a)=>{
      reject(a)
    })
     
    
   
})
}
module.exports = { producer }

