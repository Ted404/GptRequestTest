# TimmyGoesTripping Web App

A Spring Boot web project with:
- A chat page (`Ask Question`) connected to the OpenAI API
- A weather page (`Weather Forecast`) connected to OpenWeather API
- A multi-page landing section (`Home`, `Portfolio`, `About`, `Contact`)
- Custom frontend styling and navigation

## Tech Stack

- Java 22
- Spring Boot 3.2.5
- Maven
- Vanilla HTML/CSS/JavaScript

## Features

- Chat request endpoint: `POST /api/ask`
- Weather endpoint: `GET /weather?city=<city>`
- Chat UI with message history saved in browser `localStorage`
- Weather Forecast UI with:
  - city search
  - typo-tolerant city suggestions
  - condition-based dynamic background
  - weather details panel (temperature, feels like, humidity, wind speed, main, description, icon code)
- Landing pages:
  - `/landing/index.html`
  - `/landing/portfolio.html`
  - `/landing/about.html`
  - `/landing/contact.html`
- Weather page:
  - `/weatherForecast.html`
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
    weatherForecast.html
    weather.css
    weather.js
    style.css
    script.js
    branding/
      timmygoestripping-logo.svg
      timmygoestripping-logo-white.svg
    landing/
      index.html
      portfolio.html
      about.html
      contact.html
      style.css
      theme.js
      assets/
```

## Setup

1. Set your API keys:

```bash
export OPENAI_API_KEY="your_api_key_here"
export weather_api_key="your_openweather_api_key_here"
```

2. Run the app:

```bash
mvn spring-boot:run
```

3. Open in browser:
- Chat page: `http://localhost:8080/askQuestion.html`
- Weather page: `http://localhost:8080/weatherForecast.html`
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

### `GET /weather?city=<city>`

Example:

```bash
curl "http://localhost:8080/weather?city=Dubai"
```

Response (JSON):

```json
{
  "temperature": 30.5,
  "feelsLike": 33.1,
  "humidity": 58,
  "windSpeed": 4.2,
  "main": "Clouds",
  "description": "broken clouds",
  "icon": "04d"
}
```

## Notes

- If static changes do not appear immediately, hard refresh the browser.
- `application.properties` uses:

```properties
openai.api.key=${OPENAI_API_KEY:}
weather_api_key=${weather_api_key:}
```
