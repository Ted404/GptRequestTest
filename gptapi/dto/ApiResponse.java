package gptapi.dto;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record ApiResponse(List<Output> output,
                          Usage usage) {

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Output (
            List<Content> content
    ){ }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Content (String text){}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Usage (
            int input_token,
            int output_tokens,
            int total_tokens
    ){}

}
