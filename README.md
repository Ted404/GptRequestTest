# TimmyGoesTripping Web App

A Spring Boot web project with:
- A chat page (`Ask Question`) connected to the OpenAI API
- A multi-page landing section (`Home`, `Portfolio`, `About`, `Contact`)
- Custom frontend styling and navigation

## Tech Stack

- Java 22
- Spring Boot 3.2.5
- Maven
- Vanilla HTML/CSS/JavaScript

## Features

- Chat request endpoint: `POST /api/ask`
- Chat UI with message history saved in browser `localStorage`
- Landing pages:
  - `/landing/index.html`
  - `/landing/portfolio.html`
  - `/landing/about.html`
  - `/landing/contact.html`
- Portfolio links back to the chat page

## Project Structure

```text
src/main/java/gptapi/
  Application.java
  Controller/ChatController.java
  service/OpenAiService.java
  dto/

src/main/resources/
  application.properties
  static/
    askQuestion.html
    style.css
    script.js
    landing/
      index.html
      portfolio.html
      about.html
      contact.html
      style.css
      assets/
```

## Setup

1. Set your OpenAI API key:

```bash
export OPENAI_API_KEY="your_api_key_here"
```

2. Run the app:

```bash
mvn spring-boot:run
```

3. Open in browser:
- Chat page: `http://localhost:8080/askQuestion.html`
- Landing home: `http://localhost:8080/landing/index.html`

## API

### `POST /api/ask`

Request body: plain text question

Example:

```bash
curl -X POST http://localhost:8080/api/ask \
  -H "Content-Type: text/plain" \
  --data "What is Java?"
```

Response (JSON):

```json
{
  "message": "Answer text...",
  "token": 123
}
```

## Notes

- If static changes do not appear immediately, hard refresh the browser.
- `application.properties` uses:

```properties
openai.api.key=${OPENAI_API_KEY:}
```
