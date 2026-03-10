package gptapi.mapper;

import gptapi.dto.WeatherApiResponse;
import gptapi.dto.WeatherResponse;

public class WeatherMapper {

    public static WeatherResponse toResponse(WeatherApiResponse apiResponse) {
        if (apiResponse.weather() == null || apiResponse.weather().isEmpty()) {
            throw new RuntimeException("Weather data missing from API response");
        }

        var weather = apiResponse.weather().get(0);

        return new WeatherResponse(
                apiResponse.main().temp(),
                apiResponse.main().feels_like(),
                apiResponse.main().humidity(),
                apiResponse.wind().speed(),
                weather.main(),
                weather.description(),
                weather.icon()
        );
    }
}