const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, { origins: '*:*' });
const { Kafka } = require('kafkajs')

socketToKafkaMap = {};

const kafkaBrokers = ['chariot-km.dai-lab.de:9092'];

// When the kafka client established a connection start listening for the socket io requests 


// Wait for a connection from the frontend
io.on('connection', function (socket) {
    console.log("User connected: ", socket.id);

    // When a user sends a subscribtion message with a kafka topic 
    socket.on("subscribe", (kafka_topic) => {
        console.log("Subscribe to Kafka Topic: " + kafka_topic);

        // Create a id for different group ids for the kafka consumer
        let ID = Math.random().toString(36).substring(7);
        const kafka = new Kafka({
            clientId: ID,
            brokers: kafkaBrokers
        });

        // Create kafaka consumer and save the konsumer into the socket to kafka map to close the
        // consumer on a disconect or unsubscribe 
        const consumer = kafka.consumer({ groupId: ID });
        consumer.connect();
        consumer.subscribe({ topic: kafka_topic, fromBeginning: false });
        socketToKafkaMap[socket.id] = consumer;
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                //   console.log(message.value.toString());
                //   console.log({ partition, offset: message.offset, value: message.value.toString() })

                // When the consumer receives a message send it over the socket to the front end
                socket.emit("data", message.value.toString());
            }
        });
    });

    // When the socket sends a unsubscribe message remove the kafka consumer
    socket.on("unsubscribe", (kafka_topic) => {
        if (socket.id in socketToKafkaMap) {
            console.log(socket.id, " Unsubscribe from kafka topic");
            socketToKafkaMap[socket.id].stop();
            delete socketToKafkaMap[socket.id];
        }
    })

    // When the socket disconnects
    socket.on('disconnect', function () {
        if (socket.id in socketToKafkaMap) {
            console.log(socket.id, " disconected: release kafka consumer");
            socketToKafkaMap[socket.id].stop();
            delete socketToKafkaMap[socket.id];
        }
    });
});


http.listen(4444);
