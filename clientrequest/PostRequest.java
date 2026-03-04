package clientrequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import gptresponse.ApiResponse;
import gptresponse.SimpleResponse;
import gptresponse.ResponseMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class PostRequest {

    private final String API_KEY = System.getenv("API_KEY");
    private final HttpClient client;
    private final ObjectMapper mapper = new ObjectMapper();

    public PostRequest(){
        client = HttpClient.newHttpClient();
        if(API_KEY == null){
            throw new IllegalStateException("OPENAI_API_KEY environment variable not set.");
        }
    }

    public SimpleResponse postRequest(String userInput) throws IOException, InterruptedException{

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

        HttpResponse<String> response = client.send(
                httpRequest,
                HttpResponse.BodyHandlers.ofString());
       // if (response.statusCode() != 200) {
            //System.out.println("Error: " + response.body());
        if(response.statusCode() != 200){
            throw new RuntimeException(
                    "API Error: " + response.body()
            );
        }

        ///  broken part - will need to fix this part along with the other classes
        ApiResponse apiResponse = mapper.readValue(response.body(), ApiResponse.class);

        return ResponseMapper.toSimple(apiResponse);
    }
}
