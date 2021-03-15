var kafka = require('kafka-node')

function consumer(host, topic) {
Consumer = kafka.Consumer,
client = new kafka.KafkaClient({ kafkaHost: host }),
consumer = new Consumer(
    client,
    [
        { topic: topic, partition: 0 }
    ],
    {
       
        autoCommit: true,
        fromOffset: false,
       
        encoding: 'utf8',
        keyEncoding: 'utf8'
    }
);
return consumer
}
module.exports={consumer}