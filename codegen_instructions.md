# Code Generation Instructions for Google GenAI Python SDK

When generating Python code that uses the Google GenAI API, you **MUST** use the new `google-genai` SDK. Do not use the legacy `google-generativeai` SDK.

Follow these guidelines and patterns:

## 1. Installation and Imports
- **Package name:** `google-genai`
- **Imports:**
  ```python
  from google import genai
  from google.genai import types
  ```

## 2. Client Initialization
- Always initialize the client using `genai.Client()`.
- The client automatically picks up the `GEMINI_API_KEY` environment variable.
  ```python
  client = genai.Client()
  ```

## 3. Generating Text
- Use `client.models.generate_content` for synchronous generation.
- Use `client.models.generate_content_stream` for streaming.
- **Default text model:** `gemini-2.5-flash` or `gemini-2.5-pro`.
  ```python
  response = client.models.generate_content(
      model='gemini-2.5-flash',
      contents='Explain quantum computing in one sentence.'
  )
  print(response.text)
  ```

## 4. Configuration (System Instructions, Temperature, etc.)
- Always use `types.GenerateContentConfig` to pass configuration options like `system_instruction`, `temperature`, `response_mime_type`, etc.
  ```python
  response = client.models.generate_content(
      model='gemini-2.5-flash',
      contents='Tell me a story.',
      config=types.GenerateContentConfig(
          system_instruction="You are a pirate.",
          temperature=0.7,
      )
  )
  ```

## 5. Structured Output (JSON)
- Use Pydantic models to define the schema.
- Set `response_mime_type='application/json'` and pass the Pydantic class to `response_schema`.
  ```python
  from pydantic import BaseModel

  class CountryInfo(BaseModel):
      name: str
      population: int
      capital: str

  response = client.models.generate_content(
      model='gemini-2.5-flash',
      contents='Give me information for the United States.',
      config=types.GenerateContentConfig(
          response_mime_type='application/json',
          response_schema=CountryInfo,
      ),
  )
  # response.text contains the JSON string
  ```

## 6. Function Calling (Tools)
- Pass Python functions directly into the `tools` list in the config. The SDK handles the schema generation automatically.
  ```python
  def get_weather(location: str) -> str:
      """Returns the weather for a location."""
      return f"Sunny in {location}"

  response = client.models.generate_content(
      model='gemini-2.5-flash',
      contents='What is the weather in Paris?',
      config=types.GenerateContentConfig(
          tools=[get_weather],
      )
  )
  ```

## 7. Chat Sessions
- Use `client.chats.create` to start a conversation that maintains history.
  ```python
  chat = client.chats.create(model='gemini-2.5-flash')
  response1 = chat.send_message('Tell me a story about a magic backpack.')
  response2 = chat.send_message('Summarize it.')
  ```

## 8. Asynchronous Usage
- Use `client.aio` for async operations.
  ```python
  import asyncio

  async def main():
      client = genai.Client()
      response = await client.aio.models.generate_content(
          model='gemini-2.5-flash',
          contents='Hello async world!'
      )
      print(response.text)
  ```

## 9. Image Generation (Imagen)
- Use `client.models.generate_images` with the `imagen-3.0-generate-002` model.
  ```python
  result = client.models.generate_images(
      model='imagen-3.0-generate-002',
      prompt='A futuristic city at sunset.',
      config=types.GenerateImagesConfig(
          number_of_images=1,
          output_mime_type="image/jpeg",
          aspect_ratio="16:9"
      )
  )
  for generated_image in result.generated_images:
      # Access bytes via generated_image.image.image_bytes
      pass
  ```

## 10. Video Generation (Veo)
- Use `client.models.generate_videos` with the `veo-2.0-generate-001` model.
  ```python
  operation = client.models.generate_videos(
      model='veo-2.0-generate-001',
      prompt='A neon hologram of a cat driving',
      config=types.GenerateVideosConfig(
          number_of_videos=1,
          duration_seconds=5,
      ),
  )
  # Poll operation until complete
  while not operation.done:
      import time
      time.sleep(20)
      operation = client.operations.get(operation)
  
  video = operation.response.generated_videos[0].video
  # video.uri contains the download link
  ```

## 11. File Uploads
- Use `client.files.upload` to upload files, then pass the returned file object in the `contents` list.
  ```python
  file = client.files.upload(file='document.pdf')
  response = client.models.generate_content(
      model='gemini-2.5-flash',
      contents=['Summarize this document:', file]
  )
  ```

**CRITICAL:** Do NOT use `google.generativeai` or `genai.configure(api_key=...)`. Always use the new `google.genai` module and `genai.Client()`.
