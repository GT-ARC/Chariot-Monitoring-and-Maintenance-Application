package com.gtarc.chariot.testdevice;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.net.URL;

public class Util {

    public static JSONObject getJson(String fileName) throws IOException, ParseException {
        //JSON parser object to parse read file
        JSONParser jsonParser = new JSONParser();

        URL jsonURL = Util.class.getClassLoader().getResource("json/ExampleTestDevice.json");

        if(jsonURL == null)
            throw new FileNotFoundException("Device Json not found: " + fileName);

        try (FileReader reader = new FileReader(jsonURL.getFile()))
        {
            //Read JSON file
            Object obj = jsonParser.parse(reader);
            JSONObject deviceObject = (JSONObject) obj;

            return deviceObject;
        }
    }

}
