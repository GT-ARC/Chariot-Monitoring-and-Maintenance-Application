package com.gtarc.chariot.testdevice;

import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.json.simple.JSONObject;

import java.util.Properties;

public class KafkaHelper {

    private final static String BOOTSTRAP_SERVERS ="chariot-km.dai-lab.de:9092";

    private String topic = null;
    private long messageIndex = 0;

    private Producer<Long, String> producer = null;

    KafkaHelper(String topic) {
        this.topic = topic;
        this.producer = createProducer();
    }

    private static Producer<Long, String> createProducer() {
        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        props.put(ProducerConfig.CLIENT_ID_CONFIG, "KafkaExampleProducer");
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, LongSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        return new KafkaProducer<>(props);
    }

    void sendMessage(String message) throws Exception {
        long time = System.currentTimeMillis();

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("x", time);
        jsonObject.put("y", message);

        ProducerRecord<Long, String> record = new ProducerRecord<>(this.topic, this.messageIndex++, message);
        producer.send(record);
    }

    void stopProducer() {
        producer.flush();
        producer.close();
    }
}
