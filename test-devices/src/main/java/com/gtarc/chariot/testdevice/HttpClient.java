package com.gtarc.chariot.testdevice;

import okhttp3.*;

import java.io.IOException;

public class HttpClient {

    private static final String url = "http://chariot-km.dai-lab.de:8001/device/";

    private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
    private OkHttpClient client = new OkHttpClient();

    String addNewDevice(String json) throws IOException {
        RequestBody body = RequestBody.create(JSON, json);

        Request request = new Request.Builder()
                .url(url)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }

    String removeDevice(String deviceUrl) throws IOException {
        Request request = new Request.Builder()
                .url(deviceUrl).delete().build();
        try (Response response = client.newCall(request).execute()) {
            return response.body().string();
        }
    }
}
