const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, { origins: '*:*' });
const { Kafka } = require('kafkajs')

socketToKafkaMap = {};
topicToKafkaMap = {};

const kafkaBrokers = ['chariot-km.dai-lab.de:9092'];

// When the kafka client established a connection start listening for the socket io requests 


// Wait for a connection from the frontend
io.on('connection', function (socket) {
    console.log("User connected: ", socket.id);

    // When a user sends a subscribtion message with a kafka topic 
    socket.on("subscribe", (message) => {
        message = JSON.parse(message);
        console.log("Subscribe to Kafka Topic: " + JSON.stringify(message));

        // Create a id for different group ids for the kafka consumer
        let ID = Math.random().toString(36).substring(7);
        const kafka = new Kafka({
            // clientId: ID,
            brokers: kafkaBrokers,
            logLevel: 1
        });

        // Create kafaka consumer and save the konsumer into the socket to kafka map to close the
        // consumer on a disconect or unsubscribe 
        // const consumer = kafka.consumer();
        const consumer = kafka.consumer({ groupId: ID });
        consumer.connect();
        let kafka_topic = message['topic'];
        if(message['regex']) {
            kafka_topic =  new RegExp(kafka_topic)
            console.log("RegEx detected: " + kafka_topic)
        }
        try {
            consumer.subscribe({ topic: kafka_topic, fromBeginning: false });
        } catch (error) {
            console.log(error)
        }

        if(!(socket.id in socketToKafkaMap)){
            socketToKafkaMap[socket.id] = [consumer];    
        }
        socketToKafkaMap[socket.id].push(consumer);
        topicToKafkaMap[message['topic']] = consumer;
        consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                console.log("\n\n");
                console.log("{" + topic + "}");
                console.log(message.value.toString());
                //   console.log({ partition, offset: message.offset, value: message.value.toString() })

                // When the consumer receives a message send it over the socket to the front end
                socket.emit(topic+"", message.value.toString());
            }
        });
    });

    // When the socket sends a unsubscribe message remove the kafka consumer
    socket.on("unsubscribe", (topic) => {
        if (topic in topicToKafkaMap) {
            console.log("Unsubscribe of topic: " + topic);
            topicToKafkaMap[topic].stop();
            delete topicToKafkaMap[topic];
        }
    })

    // When the socket disconnects
    socket.on('disconnect', function () {
	console.log('Socket disconected: ' + socket.id);
        if (socket.id in socketToKafkaMap) {
            console.log("User disconnected" + socket.id + " release kafka consumer");
            for(let consumer of socketToKafkaMap[socket.id])
                consumer.stop();
            delete socketToKafkaMap[socket.id];
        }
    });
});


http.listen(4444);
