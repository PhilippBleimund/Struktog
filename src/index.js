/*
 Copyright (C) 2019-2023 Thiemo Leonhardt, Klaus Ramm, Tom-Maurice Schreiber, Sören Schwab

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import './assets/favicons/favicons'
import { config } from './config.js'
import { model } from './model/main'
import { Presenter } from './presenter/main'
import { Structogram } from './views/structogram'
import { CodeView } from './views/code'
import { ImportExport } from './views/importExport'
import { generateFooter, generateHtmltree } from './helpers/generator'

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
  generateFooter()
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

  // generateInfoButton(document.getElementById('optionButtons'))

  presenter.init()
}
