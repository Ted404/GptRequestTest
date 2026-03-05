package gptapi.dto;

public class ResponseMapper {

    public static SimpleResponse toSimple(ApiResponse response){
        if(response.output() == null || response.output().isEmpty()){
            return new SimpleResponse("No Response Received.", 0);
        }
        var firstOutput = response.output().get(0);

        if (firstOutput.content() == null || firstOutput.content().isEmpty()){
            return new SimpleResponse("No Contect in Response.", 0);
        }

        String message = firstOutput.content().get(0).text();
        int tokens = response.usage() != null ? response.usage().total_tokens() : 0;

        return new SimpleResponse(message, tokens);
    }
}
