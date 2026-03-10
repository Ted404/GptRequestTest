package gptapi.dto;

public record WeatherResponse(
        double temperature,
        double feelsLike,
        int humidity,
        double windSpeed,
        String main,
        String description,
        String icon
) {}
