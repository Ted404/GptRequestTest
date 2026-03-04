import clientrequest.PostRequest;
import gptresponse.SimpleResponse;

import java.io.IOException;
import java.util.Scanner;

public class Application {

    public static void main(String[] args) throws IOException, InterruptedException {

        Scanner scanner = new Scanner(System.in);
        PostRequest postRequest = new PostRequest();

        while (true){
            System.out.print("Ask me: ");
            String input = scanner.nextLine();

            if(input.equalsIgnoreCase("exit")){
                break;
            }
            SimpleResponse response = postRequest.postRequest(input);
            System.out.println("Response: " + response.message());
            System.out.println("Tokens Used: " + response.token());

        }
    }
}
