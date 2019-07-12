from kafka import KafkaProducer
from json import dumps
import time, sys
from random import randrange

if len(sys.argv) < 3: 
	print("python3 KafkaProducerTest [topic] [intervall]")
	exit()

print(sys.argv)

topic = str(sys.argv[1]);
speed = float(sys.argv[2]);

print("Produce data into topic " + topic + " in intervall " + str(speed))

#kafka_brokers = ['192.168.180.103:9092', '192.168.180.103:9092', '192.168.180.103:9092'];
kafka_brokers = ['chariot-km.dai-lab.de:9092']
KAFKA_VERSION = (0, 12)
producer = KafkaProducer( bootstrap_servers=kafka_brokers, api_version=KAFKA_VERSION);


y_value = randrange(500)

while True:
	message = "{\"y\":%d, \"x\":%d}" % (y_value, int(time.time()))
	print(message)
	producer.send(topic, value=b"%s" % message.encode());
	y_value += randrange(100) - 50;
	time.sleep(speed);
