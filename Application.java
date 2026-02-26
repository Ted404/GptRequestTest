import clientrequest.PostRequest;

import java.io.IOException;
import java.util.Scanner;

public class Application {

    public static void main(String[] args) throws IOException, InterruptedException {

        Scanner scanner = new Scanner(System.in);
        PostRequest postRequest = new PostRequest();

        while (true){
            System.out.println("Request: ");
            String input = scanner.nextLine();

            if(input.equalsIgnoreCase("exit")){
                break;
            }
            String response = postRequest.postRequest(input);

            System.out.println("Response: " + response);
        }
    }
}
