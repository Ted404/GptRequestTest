package gptresponse;
import java.util.List;

public record ChatResponse(List<Output> output,
                           Usage usage) {

    public record Output (
            List<Content> content
    ){ }
    public record Content (String text){}
    public record Usage (
            int input_token,
            int output_tokens,
            int total_tokens
    ){}
}
