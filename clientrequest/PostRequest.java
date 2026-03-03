package clientrequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import gptresponse.ChatResponse;
import gptresponse.GptResponse;
import gptresponse.ResponseMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PostRequest {

    private final String API_KEY = System.getenv("API_KEY");
    private final HttpClient client;

    public PostRequest(){
        client = HttpClient.newHttpClient();
        if(API_KEY == null){
            throw new IllegalStateException("OPENAI_API_KEY environment variable not set.");
        }
    }

    public String postRequest(String userInput) throws IOException, InterruptedException{

        String jsonBody = """
                {
                    "model": "gpt-4.1-mini",
                    "input": "%s"
                }
                """.formatted(userInput.replace("\"", "\\\""));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/responses"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + API_KEY)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(httpRequest, HttpResponse.BodyHandlers.ofString());
       // if (response.statusCode() != 200) {
            //System.out.println("Error: " + response.body());

        ObjectMapper mapper = new ObjectMapper();
        ChatResponse gptResponse = mapper.readValue(response.body(), GptResponse.class);
        GptResponse.SimpleResponse simple = ResponseMapper.toSimple();
        return response.body();
    }
}
