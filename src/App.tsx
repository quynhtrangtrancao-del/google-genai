import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Terminal, Image as ImageIcon, MessageSquare, Settings, Zap, BookOpen, Copy, Check, FileJson, Video, Upload, MessagesSquare } from 'lucide-react';

type Topic = {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
  code: string;
};

const topics: Topic[] = [
  {
    id: 'installation',
    title: 'Installation & Setup',
    icon: Terminal,
    description: 'Install the new Google GenAI SDK and initialize the client.',
    code: `# Install the SDK
pip install google-genai

# Import and initialize
from google import genai
import os

# The client automatically picks up the GEMINI_API_KEY environment variable
client = genai.Client()

# Or pass it explicitly
# client = genai.Client(api_key="YOUR_API_KEY")`
  },
  {
    id: 'generate-text',
    title: 'Generate Text',
    icon: MessageSquare,
    description: 'Generate text content from a simple prompt.',
    code: `from google import genai

client = genai.Client()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Explain quantum computing in one sentence.'
)

print(response.text)`
  },
  {
    id: 'streaming',
    title: 'Streaming Responses',
    icon: Zap,
    description: 'Stream the response back as it is generated.',
    code: `from google import genai

client = genai.Client()

response = client.models.generate_content_stream(
    model='gemini-2.5-flash',
    contents='Write a short story about a brave knight.'
)

for chunk in response:
    print(chunk.text, end="")`
  },
  {
    id: 'system-instructions',
    title: 'System Instructions',
    icon: Settings,
    description: "Provide system instructions to guide the model's behavior.",
    code: `from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Tell me about the solar system.',
    config=types.GenerateContentConfig(
        system_instruction="You are a pirate. Speak like one.",
        temperature=0.7,
    )
)

print(response.text)`
  },
  {
    id: 'generate-image',
    title: 'Generate Image',
    icon: ImageIcon,
    description: 'Generate images using the Imagen model.',
    code: `from google import genai
from google.genai import types

client = genai.Client()

result = client.models.generate_images(
    model='imagen-3.0-generate-002',
    prompt='A futuristic city with flying cars at sunset.',
    config=types.GenerateImagesConfig(
        number_of_images=1,
        output_mime_type="image/jpeg",
        aspect_ratio="16:9"
    )
)

for generated_image in result.generated_images:
    image = generated_image.image
    # image.image_bytes contains the raw bytes
    with open("output.jpg", "wb") as f:
        f.write(image.image_bytes)`
  },
  {
    id: 'function-calling',
    title: 'Function Calling',
    icon: Code2,
    description: 'Provide Python functions for the model to call.',
    code: `from google import genai
from google.genai import types

client = genai.Client()

def get_current_weather(location: str) -> str:
    """Returns the current weather for a given location."""
    # In a real app, you would call a weather API here
    return f"The weather in {location} is sunny and 72 degrees."

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='What is the weather like in Paris?',
    config=types.GenerateContentConfig(
        tools=[get_current_weather],
    )
)

# The SDK handles the function call automatically if you pass the function directly
print(response.text)`
  },
  {
    id: 'chat',
    title: 'Chat Sessions',
    icon: MessagesSquare,
    description: 'Maintain conversation history with the Chat interface.',
    code: `from google import genai

client = genai.Client()

chat = client.chats.create(model='gemini-2.5-flash')

response = chat.send_message('Tell me a story about a magic backpack.')
print(response.text)

# The chat object remembers the previous messages
response = chat.send_message('Summarize the story in one sentence.')
print(response.text)`
  },
  {
    id: 'json-schema',
    title: 'JSON Structured Output',
    icon: FileJson,
    description: 'Force the model to return structured JSON data using Pydantic.',
    code: `from google import genai
from google.genai import types
from pydantic import BaseModel

client = genai.Client()

class CountryInfo(BaseModel):
    name: str
    population: int
    capital: str
    continent: str

response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='Give me information for the United States.',
    config=types.GenerateContentConfig(
        response_mime_type='application/json',
        response_schema=CountryInfo,
    ),
)

# response.text contains the JSON string
print(response.text)`
  },
  {
    id: 'upload-file',
    title: 'Upload Files',
    icon: Upload,
    description: 'Upload files to the Gemini API for processing.',
    code: `from google import genai

client = genai.Client()

# Upload a file
file = client.files.upload(file='document.pdf')

# Use the file in a prompt
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents=['Could you summarize this document?', file]
)

print(response.text)`
  },
  {
    id: 'generate-video',
    title: 'Generate Video (Veo)',
    icon: Video,
    description: 'Generate videos using the Veo model.',
    code: `from google import genai
from google.genai import types
import time

client = genai.Client()

# Create video generation operation
operation = client.models.generate_videos(
    model='veo-2.0-generate-001',
    prompt='A neon hologram of a cat driving at top speed',
    config=types.GenerateVideosConfig(
        number_of_videos=1,
        duration_seconds=5,
        enhance_prompt=True,
    ),
)

# Poll operation until complete
while not operation.done:
    time.sleep(20)
    operation = client.operations.get(operation)

video = operation.response.generated_videos[0].video
# video.uri contains the download link
print(f"Video ready at: {video.uri}")`
  }
];

export default function App() {
  const [activeTopicId, setActiveTopicId] = useState<string>(topics[0].id);
  const [copied, setCopied] = useState(false);

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTopic.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-80 border-r border-zinc-800 bg-zinc-900/50 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3 text-emerald-400 mb-2">
            <BookOpen className="w-6 h-6" />
            <h1 className="text-xl font-semibold tracking-tight text-zinc-100">GenAI Python SDK</h1>
          </div>
          <p className="text-sm text-zinc-400">
            Cheat sheet for the new <code className="text-zinc-300 bg-zinc-800 px-1 py-0.5 rounded">google-genai</code> package.
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isActive = activeTopicId === topic.id;
            return (
              <button
                key={topic.id}
                onClick={() => setActiveTopicId(topic.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className="font-medium text-sm">{topic.title}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-zinc-800">
          <a 
            href="https://googleapis.github.io/python-genai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-zinc-500 hover:text-emerald-400 transition-colors flex items-center gap-2"
          >
            Official Documentation &rarr;
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-zinc-950 p-6 md:p-12">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTopic.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <activeTopic.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-tight">{activeTopic.title}</h2>
                </div>
                <p className="text-zinc-400 text-lg">{activeTopic.description}</p>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative rounded-2xl bg-[#0d0d0d] border border-zinc-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                      <div className="w-3 h-3 rounded-full bg-zinc-700"></div>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors bg-zinc-800/50 hover:bg-zinc-800 px-2.5 py-1.5 rounded-md"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy code'}
                    </button>
                  </div>
                  <div className="p-6 overflow-x-auto">
                    <pre className="text-sm font-mono text-zinc-300 leading-relaxed">
                      <code>{activeTopic.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
