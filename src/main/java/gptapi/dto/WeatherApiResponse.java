package gptapi.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WeatherApiResponse(Current current) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Current(double temp,
                          double feels_like,
                          int humidity,
                          double wind_speed,
                          List<Weather> weather) {}


    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Weather(String main,
                          String description,
                          String icon) {
    }

}
