import './assets/favicons/favicons'
import { config } from './config.js'
import { model } from './model/main'
import { Presenter } from './presenter/main'
import { Structogram } from './views/structogram'
import { CodeView } from './views/code'
import { ImportExport } from './views/importExport'
import { generateHtmltree, generateInfoButton } from './helpers/generator'

import './assets/scss/structog.scss'

window.onload = function () {
  // manipulate the localStorage before loading the presenter
  if (typeof Storage !== 'undefined') {
    const url = new URL(window.location.href)
    const externJson = url.searchParams.get('url')
    if (externJson !== null) {
      fetch(externJson)
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          presenter.readUrl(json)
        })
    }
    const configId = url.searchParams.get('config')
    config.loadConfig(configId)
  }

  generateHtmltree()
  // create presenter object
  const presenter = new Presenter(model)
  // TODO: this should not be necessary, but some functions depend on moveId and nextInsertElement
  model.setPresenter(presenter)

  // create our view objects
  const structogram = new Structogram(
    presenter,
    document.getElementById('editorDisplay')
  )
  presenter.addView(structogram)
  const code = new CodeView(presenter, document.getElementById('editorDisplay'))
  presenter.addView(code)
  const importExport = new ImportExport(
    presenter,
    document.getElementById('Export')
  )
  presenter.addView(importExport)

  generateInfoButton(document.getElementById('optionButtons'))

  presenter.init()
}
