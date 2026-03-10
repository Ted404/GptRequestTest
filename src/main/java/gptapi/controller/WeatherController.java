package gptapi.controller;

import gptapi.dto.WeatherApiResponse;
import gptapi.dto.WeatherResponse;
import gptapi.service.WeatherService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController (WeatherService weatherService){
        this.weatherService = weatherService;
    }

    @GetMapping("/weather")
    public WeatherResponse getWeather (@RequestParam String city){
        try {
            return weatherService.getWeather(city);
        } catch (Exception e) {
            throw new RuntimeException("Weather API failed", e);
        }
    }
}
