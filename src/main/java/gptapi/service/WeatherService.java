package gptapi.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import gptapi.dto.WeatherApiResponse;
import gptapi.dto.WeatherResponse;
import gptapi.mapper.WeatherMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class WeatherService {

    @Value("${weather_api_key}")
    private String weatherApiKey;

    private final HttpClient httpClient = HttpClient.newHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public WeatherResponse getWeather(String city) throws Exception {
        try {
            String url = "https://api.openweathermap.org/data/2.5/weather?q="
                    + city
                    + "&appid=" + weatherApiKey
                    + "&units=metric";

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            WeatherApiResponse apiResponse =
                    objectMapper.readValue(response.body(), WeatherApiResponse.class);

            System.out.println("RAW WEATHER API RESPONSE:");
            System.out.println(response.body());

            return WeatherMapper.toResponse(apiResponse);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch weather data", e);
        }
    }
}
