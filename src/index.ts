import axios from 'axios'
import cors from 'cors'
import express, { Request, Response } from 'express'
import { JSDOM } from 'jsdom'
import { addInfo, changeLogo, hideCookieBanner, replaceTitles } from './editDom'

const app = express()
app.use(cors())

const HOMEPAGE = 'https://ilpost.it'


async function proxyIlPost(req: Request, res: Response) {
  const response = await axios.get(HOMEPAGE)
  const dom = new JSDOM(response.data)
  hideCookieBanner(dom)
  addInfo(dom)
  changeLogo(dom)
  await replaceTitles(dom)
  res.end(dom.serialize())
}

app.use(express.static('public'))

app.get('/', proxyIlPost)

app.listen(3000, () => {
  console.log('started!')
})
