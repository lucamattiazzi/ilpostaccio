import axios from 'axios';
import { config } from 'dotenv';
import { JSDOM } from 'jsdom';
import { Configuration, OpenAIApi } from "openai";
import { Cache } from "./cache";

config()

const PROMPT = `
  Sei un titolista che deve inventare un titolo clickbait per un articolo.
  Il titolo avrà toni misteriosi, e a volte potrà alludere a cospirazioni.
  Il titolo deve essere lungo non più di 200 caratteri.
`

// const PROMPT_2 = 'Sei un titolista che deve inventare un titolo clickbait circondato da un alone di mistero che convincano il lettore ad aprire l\'articolo.Devi generare un singolo titolo lungo non più di 200 caratteri.',


const BASE_MESSAGES = [
  {
    role: 'system' as const,
    content: PROMPT,
  },
]


const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function generateNewTitle(cache: Cache, link: HTMLAnchorElement): Promise<string> {
  const href = link.getAttribute('href')
  const key = link.getAttribute('href').split("?")[0]
  const cachedTitle = cache.get(key)
  if (cachedTitle) return cachedTitle
  const response = await axios.get(href)
  const dom = new JSDOM(response.data)
  const articleContainer = dom.window.document.getElementById('singleBody')
  const paragraphs = Array.from(articleContainer.getElementsByTagName('p'))
  const usefulParagraphs = paragraphs.filter(p => p.textContent.length > 100)
  const textContent = usefulParagraphs.map(p => p.textContent).join(' ')
  const messages = [...BASE_MESSAGES, { role: 'user' as const, content: textContent }]
  const results = await openai.createChatCompletion({
    messages: messages,
    model: "gpt-4",
    temperature: 0.8,
  })
  const newTitle = results?.data?.choices[0]?.message?.content
  if (newTitle) cache.set(key, newTitle)
  return newTitle
}

