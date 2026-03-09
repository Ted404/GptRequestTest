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

    public ChatController(){
        this.openAiServices = new OpenAiService();
    }
    @PostMapping("/ask")
    public SimpleResponse ask (@RequestBody String question) throws Exception{
        return openAiServices.ask(question);
    }
}
