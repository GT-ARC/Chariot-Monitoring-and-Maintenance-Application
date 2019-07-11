const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, { origins: '*:*'});
const { Kafka } = require('kafkajs')

socketToKafkaMap = {};

// When the kafka client established a connection start listening for the socket io requests 



io.on('connection', function(socket){
    console.log("User connected: ", socket.id);
    socket.on("subscribe", (kafka_topic) => {
        console.log("Subscribe to Kafka Topic: " + kafka_topic);
        let ID = Math.random().toString(36).substring(7);
        const kafka = new Kafka({
            clientId: ID,
            brokers: ['chariot-km.dai-lab.de:9093']
          })
        const consumer = kafka.consumer({ groupId: ID })
        consumer.connect()
        consumer.subscribe({ topic: kafka_topic, fromBeginning: false })
        socketToKafkaMap[socket.id] = consumer;
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log(message.value.toString());
            //   console.log({
            //     partition,
            //     offset: message.offset,
            //     value: message.value.toString(),
            //   })
              socket.emit("data", message.value.toString());
            }
        })
    }); 

    socket.on("unsubscribe", (kafka_topic) => {
        if(socket.id in socketToKafkaMap){
            console.log(socket.id, " Unsubscribe from kafka topic")
            socketToKafkaMap[socket.id].stop()
            delete socketToKafkaMap[socket.id]
        }      
    })

    // When the frontend disconnects
    socket.on('disconnect', function() {
        if(socket.id in socketToKafkaMap) {
            console.log(socket.id, " disconected: release kafka consumer")
            socketToKafkaMap[socket.id].stop()
            delete socketToKafkaMap[socket.id]
        }
    });
});


http.listen(4444);
