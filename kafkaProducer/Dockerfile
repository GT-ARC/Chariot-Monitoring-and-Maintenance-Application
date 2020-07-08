FROM python:3.6.8

COPY KafkaProducerTest.py .
COPY start.bat .

RUN pip3 install kafka-python

CMD [ "./start.bat" ]
