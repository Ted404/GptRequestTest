package gptapi.controller;

import gptapi.service.OpenAiService;
import gptapi.dto.SimpleResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final OpenAiService openAiServices;

    public ChatController(OpenAiService openAiService){
        this.openAiServices = openAiService;
    }
    @PostMapping("/ask")
    public SimpleResponse ask (@RequestBody String question) {
        String cleaned = question == null ? "" : question.trim();

        if (cleaned.isEmpty()) {
            return new SimpleResponse("Please enter a question.", 0);
        }

        try {
            return openAiServices.ask(cleaned);
        } catch (Exception ex) {
            return new SimpleResponse("Request failed: " + ex.getMessage(), 0);
        }
    }
}
