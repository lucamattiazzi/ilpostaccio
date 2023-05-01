import { JSDOM } from 'jsdom'
import { cache } from './cache'
import { generateNewTitle } from './titleGenerator'

export function hideCookieBanner(dom: JSDOM): void {
  const cookieCSS = `
    #onetrust-consent-sdk {
      display: none !important;
    }
  `
  const cookieCSSElement = dom.window.document.createElement('style')
  cookieCSSElement.textContent = cookieCSS
  dom.window.document.head.appendChild(cookieCSSElement)
}

export function addInfo(dom: JSDOM): void {
  const ribbonStyleElement = dom.window.document.createElement('link')
  ribbonStyleElement.rel = 'stylesheet'
  ribbonStyleElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css'
  dom.window.document.head.appendChild(ribbonStyleElement)

  const ribbonElement = dom.window.document.createElement('a')
  ribbonElement.classList.add("github-fork-ribbon")
  ribbonElement.classList.add("fixed")
  ribbonElement.classList.add("left-top")
  ribbonElement.dataset.ribbon = "Che è sta roba?"
  ribbonElement.target = "_blank"
  ribbonElement.title = "Che è sta roba?"
  ribbonElement.textContent = "Che è sta roba?"
  ribbonElement.href = "#"
  ribbonElement.id = "magicRibbon"
  dom.window.document.body.appendChild(ribbonElement)

  const infoTextHTML = `
  <div style="background-color:#eee; padding: 10%; width: 90%; font-size: 2em; height: 90%; position: relative">
    <h2 style="padding-bottom: 1.1em; padding-top: 1.1em; font-size: 1.2em">Cosa?</h2>
    <p>
      Questo sito è un tributo a Il Post, eccellente testata giornalistica online.
      Ma i titoli che ha, sant'iddio, nel 2023 non si possono vedere.
      Ho deciso di usare OpenAI per aggiungere un po' di pepe ai titoli, e magari attirare l'attenzione di ancora più persone che hanno bisogno di leggere un giornale fatto bene.
    </p>
    <h2 style="padding-bottom: 1.1em; padding-top: 1.1em; font-size: 1.2em">Chi?</h2>
    <p>
      Sono Luca, ho tempo da perdere nonostante tutto.
      Sono un grande fan de Il Post, e pure abbonato.
      E sono un grande fan delle cazzate.
    </p>
    <h2 style="padding-bottom: 1.1em; padding-top: 1.1em; font-size: 1.2em">Come?</h2>
    <p>
      Il codice è <a target="_blank" href="https://github.com/lucamattiazzi/ilpostaccio.info">qui</a>.
      Ma in parole povere, chiedo a ChatGPT (4? 3.5? dipende quanto mi costa sta roba) di generare un titolo clickbait dal testo dell'articolo.
      Poi prendo il titolo generato e lo metto al posto del titolo originale.
      Poco altro, poi.
    </p>
    <div id="closeButton" style="position: absolute; top: 10px; right: 10px; font-size: 3em; cursor: pointer">❌</div>
  </div>
  `
  const infoTextHTMLElement = dom.window.document.createElement('div')
  infoTextHTMLElement.id = "magicmodal"
  infoTextHTMLElement.style.position = 'fixed'
  infoTextHTMLElement.style.zIndex = '9999'
  infoTextHTMLElement.style.top = '0'
  infoTextHTMLElement.style.left = '0'
  infoTextHTMLElement.style.width = '100%'
  infoTextHTMLElement.style.height = '100%'
  infoTextHTMLElement.style.alignItems = 'center'
  infoTextHTMLElement.style.justifyContent = 'center'
  infoTextHTMLElement.style.display = 'none'
  infoTextHTMLElement.style.backgroundColor = 'rgba(0,0,0,0.5)'

  infoTextHTMLElement.innerHTML = infoTextHTML

  const infoTextScript = `
  const magicRibbon = document.getElementById('magicRibbon')
  const closeButton = document.getElementById('closeButton')
  const infoModal = document.getElementById('magicmodal')
  magicRibbon.onclick = (e) => {e.preventDefault() ; infoModal.style.display = 'flex'}
  closeButton.onclick = () => infoModal.style.display = 'none'
  `
  const infoTextScriptElement = dom.window.document.createElement('script')
  infoTextScriptElement.innerHTML = infoTextScript

  dom.window.document.body.appendChild(infoTextHTMLElement)
  dom.window.document.body.appendChild(infoTextScriptElement)
}

export async function replaceTitles(dom: JSDOM): Promise<void> {
  const allTitleContainers = dom.window.document.getElementsByClassName('entry-title')
  const titlePromises = Array.from(allTitleContainers).map(async (titleContainer) => {
    const title = titleContainer.getElementsByTagName('a')[0]
    const newTitle = await generateNewTitle(cache, title)
    if (!newTitle) return
    title.textContent = newTitle
  })
  await Promise.all(titlePromises)
}
