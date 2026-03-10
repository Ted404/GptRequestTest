package gptapi.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record WeatherApiResponse(
        Main main,
        Wind wind,
        List<Weather> weather,
        String name
) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Main(
            double temp,
            double feels_like,
            int humidity
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Wind(
            double speed
    ) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Weather(
            String main,
            String description,
            String icon
    ) {}
}
