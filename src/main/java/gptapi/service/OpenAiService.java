package gptapi.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import gptapi.dto.ApiResponse;
import gptapi.dto.SimpleResponse;
import gptapi.mapper.ResponseMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class OpenAiService {

    @Value("${openai.api.key}")
    private String apikey;

    private final HttpClient client;
    private final ObjectMapper mapper = new ObjectMapper();

    public OpenAiService(){
        client = HttpClient.newHttpClient();
    }

    public SimpleResponse ask(String userInput) throws IOException, InterruptedException{
        if (apikey == null || apikey.isBlank()) {
            throw new IllegalStateException("OPENAI_API_KEY is not set. Configure it and restart the app.");
        }

        String jsonBody = """
                {
                    "model": "gpt-4.1-mini",
                    "input": "%s"
                }
                """.formatted(userInput.replace("\"", "\\\""));

        HttpRequest httpRequest = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/responses"))
                .header("Content-Type", "application/json")
                .header("Authorization", "Bearer " + apikey)
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                .build();

        HttpResponse<String> response = client.send(
                httpRequest,
                HttpResponse.BodyHandlers.ofString());

        if(response.statusCode() != 200){
            throw new RuntimeException(
                    "OpenAI API error (" + response.statusCode() + "): " + response.body()
            );
        }

        ApiResponse apiResponse = mapper.readValue(response.body(), ApiResponse.class);

        return ResponseMapper.toSimple(apiResponse);
    }
}
