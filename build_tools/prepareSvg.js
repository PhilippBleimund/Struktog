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

const path = require('path')
const fs = require('fs')

// create path of svg directory
const svgDir = path.join(__dirname, '../src/assets/svg/')

fs.readdir(svgDir, function (err, files) {
  if (err) {
    return console.log(err)
  }

  const svgScssFile = path.join(__dirname, '../src/assets/scss/_svg.scss')
  // delete the old scss file
  if (fs.existsSync(svgScssFile)) {
    fs.unlinkSync(svgScssFile)
  }

  // write per file a css class to the file
  files.forEach(function (file) {
    let image = '.'
    image += file.split('.')[0]
    image += ' {background: url("../svg/'
    image += file
    image += '");background-repeat: no-repeat;background-position: center;}'

    fs.appendFileSync(svgScssFile, image)
  })
})
