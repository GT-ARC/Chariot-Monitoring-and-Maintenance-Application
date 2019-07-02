const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    Consumer = kafka.Consumer,
    client = new kafka.KafkaClient(
        {
            kafkaHost: '192.168.180.103:9092,192.168.180.103:9093,192.168.180.103:9094',
            requestTimeout: 10000
        }),
    producer = new Producer(client);

client.on("ready", () => {
    console.log("Client Ready");
    var consumer = new Consumer(client, [{ topic: 'test', partition: 0 }]);
    consumer.on('message', function (message) {
        console.log(message);
    });

    consumer.on('error', function (err) {
        console.log(err);
    })
});

client.on("error", (error) => console.log("Client Error:" + error));
client.on("brokersChanged", () => console.log("Brokers Changed"))

// var topicsToCreate = 
// [
//     {
//         topic: "exampleTopic",
//         partitions: 1,
//         replicationFactor: 2
//     },
//     {
//         topic: "exampleTopic2",
//         partitions: 1,
//         replicationFactor: 2
//     }
// ]

// client.createTopics(topicsToCreate, (error, result) => {
//     // result is an array of any errors if a given topic could not be created
//     if(result) console.log("Create Topic Result:", result)
//     if(error) console.log("Create Topic Error:", error)
// })

// client.refreshMetadata(["exampleTopic"], (error) => {
//     if(error) console.log("Refresh Metadata Error: ", error);
// });

// client.topicExists(["exampleTopic"], (error) => {
//     if(error) console.log("topicExists Error: ", error);
// })


// var payloads = [
//     { topic: 'exampleTopic', messages: 'hi', partition: 1 },
//     { topic: 'exampleTopic2', messages: ['hello', 'world'], partition: 1 }
// ];

// // producer.on('ready', function () {
// //     console.log("Send payloads")
// //     producer.send(payloads, function (err, data) {
// //         if(data) console.log("Producer send data:", data);
// //         if(err) console.log("Producer send err:", err);
// //     });
// // });

// var options = {
//     groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
//     // Auto commit config
//     autoCommit: true,
//     autoCommitIntervalMs: 5000,
//     // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
//     fetchMaxWaitMs: 100,
//     // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
//     fetchMinBytes: 1,
//     // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
//     fetchMaxBytes: 1024 * 1024,
//     // If set true, consumer will fetch message from the given offset in the payloads
//     fromOffset: false,
//     // If set to 'buffer', values will be returned as raw buffer objects.
//     encoding: 'utf8',
//     keyEncoding: 'utf8'
// };

// var consumer = new Consumer(client, [{ topic: 'test', partition: 0 }], options);
// consumer.on('message', function (message) {
//     console.log(message);
// });

// consumer.on('error', function (err) {
//     console.log(err);
// })


// io.on("connection", socket => {
//     console.log(socket)
// });

http.listen(4444);