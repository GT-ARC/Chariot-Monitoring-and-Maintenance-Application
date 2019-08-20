package com.gtarc.chariot.testdevice;

import de.dailab.jiactng.agentcore.AbstractAgentBean;
import de.dailab.jiactng.agentcore.SimpleAgentNode;
import de.dailab.jiactng.agentcore.action.AbstractMethodExposingBean;
import de.dailab.jiactng.agentcore.lifecycle.LifecycleException;
import okhttp3.MediaType;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.context.ApplicationContext;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExampleTestDevice extends AbstractAgentBean {

    private HttpClient httpClient = new HttpClient();
    private JSONObject deviceJson;

    HashMap<KafkaHelper, Double> kafkaProducerValueMap = new HashMap<>();


    @Override
    public void doStart() throws Exception {
        log.info("ExampleTestDevice - starting....");
        log.info("ExampleTestDevice - my ID: " + thisAgent.getAgentId());
        log.info("ExampleTestDevice - my Name: " + thisAgent.getAgentName());
        log.info("ExampleTestDevice - my Node: " + thisAgent.getAgentNode().getName());

        JSONObject deviceJson = Util.getJson("json/ExampleTestDevice.json");
        deviceJson.put("uuid", thisAgent.getAgentId());

        String filledJson = httpClient.addNewDevice(deviceJson.toJSONString());
        this.deviceJson = (JSONObject) new JSONParser().parse(filledJson);

        // Create producer for each property
        if(this.deviceJson.get("properties") instanceof JSONArray) {
            JSONArray properties = (JSONArray) this.deviceJson.get("properties");
            properties.forEach(o ->
                    kafkaProducerValueMap.put (
                            new KafkaHelper (
                                    (String) ((JSONObject) o).get("kafka_topic")
                            ),
                            Math.random() * 100
                    )
            );
        }
    }

    @Override
    public void execute() {
        for(Map.Entry<KafkaHelper, Double> entry : kafkaProducerValueMap.entrySet()) {
            try {
                entry.getKey().sendMessage(entry.getValue() + "");
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void doStop() throws IOException {
        httpClient.removeDevice(deviceJson.get("url").toString());
    }

    public static void main(String[] args) {
        ApplicationContext context = SimpleAgentNode.startAgentNode("classpath:Test_Agents.xml", "jiactng_log4j.properties");
        SimpleAgentNode node = (SimpleAgentNode) context.getBean("TestAgentNode");
        try {
            System.out.println("Start Node");
            node.start();
        } catch (LifecycleException e) {
            e.printStackTrace();
        }

    }

}
