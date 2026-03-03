package gptresponse;

public class ResponseMapper {

    public static GptResponse.SimpleResponse toSimple(ChatResponse response) {
        String message = response.output().get(0).content().get(0).text();
        int tokens = response.usage().total_tokens();
        return new GptResponse.SimpleResponse(message, tokens);
    }
}
