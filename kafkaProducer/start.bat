#!/bin/bash

python3 KafkaProducerTest.py exampleData2 1 &
python3 KafkaProducerTest.py exampleData1 0.5 &
python3 KafkaProducerTest.py exampleData3 2 
