const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http, { origins: '*:*'});
var kafka = require('kafka-node'),
    Consumer = kafka.Consumer;


socketToKafkaMap = {};

// When the kafka client established a connection start listening for the socket io requests 

io.on('connection', function(socket){
    console.log("User connected");
    socket.on("subscribe", (kafka_topic) => {

        console.log("Subscribe to Kafka Topic: " + kafka_topic);
        var kafkaClient = new kafka.KafkaClient(
        {
            kafkaHost: '192.168.180.103:9092,192.168.180.103:9093,192.168.180.103:9094',
            requestTimeout: 10000
        });

        kafkaClient.on("ready", () => {   
            
            console.log("Kafka Client connected");
            // Get the offset of the topic and get only the latest info
            var offset = new kafka.Offset(kafkaClient);
            var topicOffset = offset.fetch([{ topic: 'numtest', partition: 0, time: -1 }], function (err, data) {
                topicOffset = data['numtest']['0'][0];
            });

            var consumer = new Consumer(kafkaClient, 
            [{ topic: kafka_topic, offset: topicOffset, partition: 0 }],{
                autoCommit: false,
                fromOffset: true,
                encoding: 'utf8',
                keyEncoding: 'utf8'
            });

            socketToKafkaMap[socket] = consumer;

            consumer.on('message', function (message) {
                console.log("Message received", message)
                socket.emit("data", message);
            });

            consumer.on(("error"), (err) => {
                console.log("Kafka consumer error: " + err)
                consumer.close(() => {});
                kafkaClient.close(() => {})
            });
        }); 

        // When there is an error in the socket emit a socket error
        kafkaClient.on("error", (err) => {
            console.log("Kafka Client Error " + err)
            socket.emit("error", "Kafka Client Error");
        });
    });

    // When the frontend disconects
    socket.on('disconnect', function() {
        console.log('user disconnected');
        if(socket in socketToKafkaMap)        
            socketToKafkaMap[socket].close();
    });
});

http.listen(4444);