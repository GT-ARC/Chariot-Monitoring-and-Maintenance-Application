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

            //var consumerGroup = new ConsumerGroup({/}, kafka_topic);

            kafkaClient.loadMetadataForTopics([kafka_topic], (err, result) => {
                console.log(result);
            })

            // Get the offset of the topic and get only the latest info
            var offset = new kafka.Offset(kafkaClient);
            var topicOffset = offset.fetch([{ topic: kafka_topic, partition: 0, time: -1 }], function (err, data) {
                topicOffset = data[kafka_topic]['0'][0];
                console.log(topicOffset);
            });

            var consumer = new Consumer(kafkaClient, 
            [{ topic: kafka_topic, offset: topicOffset - 1, partition: 0 }],{
                autoCommit: false,
                fromOffset: true,
                encoding: 'utf8',
                keyEncoding: 'utf8'
            });

            socketToKafkaMap[socket] = consumer;


            count = 0
            consumer.on('message', function (message) {
                if(count > topicOffset)
                    socket.emit("data", message);
                count++;
            });

            consumer.on(("error"), (err) => {
                console.log("Kafka consumer error: " + err);
                consumer.close(() => {});
                kafkaClient.close(() => {})
            });
        }); 

        // When there is an error in the socket emit a socket error
        kafkaClient.on("error", (err) => {
            console.log("Kafka Client Error " + err);
            socket.emit("error", "Kafka Client Error");
        });
    });

    // When the frontend disconnects
    socket.on('disconnect', function() {
        console.log('user disconnected');
        if(socket in socketToKafkaMap)        
            socketToKafkaMap[socket].close();
    });
});

http.listen(4444);