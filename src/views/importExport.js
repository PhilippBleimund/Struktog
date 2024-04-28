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
import * as htmlToImage from 'html-to-image'
export class ImportExport {
  constructor (presenter, domRoot) {
    this.presenter = presenter
    this.domRoot = domRoot
    this.printHeight = 32

    this.preRender()
  }

  render (model) {}

  preRender () {
    const importDiv = document.createElement('div')
    importDiv.classList.add(
      'options-element',
      'uploadIcon',
      'tooltip',
      'tooltip-bottom',
      'hand'
    )
    importDiv.setAttribute('data-tooltip', 'Laden')
    const importInput = document.createElement('input')
    importInput.setAttribute('type', 'file')
    importInput.addEventListener('change', (e) => this.presenter.readFile(e))
    importDiv.addEventListener('click', () => importInput.click())
    document.getElementById('optionButtons').appendChild(importDiv)

    const saveDiv = document.createElement('div')
    saveDiv.classList.add(
      'options-element',
      'saveIcon',
      'tooltip',
      'tooltip-bottom',
      'hand'
    )
    saveDiv.setAttribute('data-tooltip', 'Speichern')
    saveDiv.addEventListener('click', () => this.presenter.saveDialog())
    document.getElementById('optionButtons').appendChild(saveDiv)

    // right now only png export exists, in the future a dialog should be opened
    const exportDiv = document.createElement('div')
    exportDiv.classList.add(
      'options-element',
      'exportIcon',
      'tooltip',
      'tooltip-bottom',
      'hand'
    )
    exportDiv.setAttribute('data-tooltip', 'Bildexport')
    exportDiv.addEventListener('click', () =>
      this.exportAsPngWithPackage()
      // this.exportAsPng(this.presenter.getModelTree())
    )
    document.getElementById('optionButtons').appendChild(exportDiv)

    // ugly fix for HTMLToImage package
    // first creation of the image misses the lines in the image
    htmlToImage.toPng(document.getElementById('structogram'))
      .then(function (dataUrl) {
      })
  }

  /**
   * Render the current tree element on a canvas position and call to render childs
   *
   * @param    subTree        object of the current element / sub tree of the struktogramm
   * @param    ctx            instance of the canvas
   * @param    x              current x position on the canvas to start drawing
   * @param    xmax           absolute x position until then may be drawn
   * @param    y              current y position on the canvas to start drawing
   * @param    overhead       overhead of the current element, used to calculate the y position of the next element
   * @param    oneLineNodes   number of nodes that are drawn on one line, used to calculate the y position of the next element
   * @return   int            max y positon to which was drawn already, so the parent element knows where to draw the next element
   */
  renderTreeAsCanvas (subTree, ctx, x, xmax, y, givenStepSize = 1) {
    // uses a recursive structure, termination condition is no definied element to be drawn
    if (subTree === null) {
      return y
    } else {
      const defaultMargin = 22
      // use for every possible element type a different drawing strategie
      switch (subTree.type) {
        case 'InsertNode':
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y,
            givenStepSize
          )

        case 'Placeholder': {
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          const centerX = x + (xmax - x) / 2
          const centerY = y + this.printHeight / 2
          ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
          ctx.moveTo(centerX - 11, centerY + 11)
          ctx.lineTo(centerX + 11, centerY - 11)
          ctx.stroke()
          return y + this.printHeight
        }

        case 'InputNode': {
          const stepSize = this.printHeight * givenStepSize
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + stepSize)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + stepSize)
          ctx.stroke()

          ctx.fillStyle = '#fcedce'
          ctx.rect(x, y, xmax, stepSize)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText('E: ' + subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y + stepSize,
            givenStepSize
          )
        }

        case 'OutputNode': {
          const stepSize = this.printHeight * givenStepSize
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + stepSize)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + stepSize)
          ctx.stroke()

          ctx.fillStyle = '#fcedce'
          ctx.rect(x, y, xmax, stepSize)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText('A: ' + subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y + stepSize,
            givenStepSize
          )
        }

        case 'TaskNode': {
          const stepSize = this.printHeight * givenStepSize
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(xmax, y)
          ctx.moveTo(x, y)
          ctx.lineTo(x, y + stepSize)
          ctx.moveTo(xmax, y)
          ctx.lineTo(xmax, y + stepSize)
          ctx.stroke()

          ctx.fillStyle = '#fcedce'
          ctx.rect(x, y, xmax - x, stepSize)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y + stepSize,
            givenStepSize
          )
        }

        case 'BranchNode': {
          ctx.fillStyle = 'rgb(250, 218, 209)'
          ctx.beginPath() // to end open paths
          ctx.rect(x, y, xmax - x, 2 * this.printHeight)
          ctx.fill()
          ctx.fillStyle = 'black'
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + (xmax - x) / 2, y + 2 * this.printHeight)
          ctx.moveTo(xmax, y)
          ctx.lineTo(x + (xmax - x) / 2, y + 2 * this.printHeight)
          ctx.stroke()
          // center the text
          const textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(
            subTree.text,
            x + Math.abs(xmax - x - textWidth.width) / 2,
            y + defaultMargin
          )
          ctx.stroke()
          ctx.beginPath()
          ctx.fillText('Wahr', x + 15, y + this.printHeight + defaultMargin)
          ctx.fillText(
            'Falsch',
            xmax - 15 - ctx.measureText('Falsch').width,
            y + this.printHeight + defaultMargin
          )
          ctx.stroke()
          let trueChildY = 0
          let falseChildY = 0
          // render the child sub trees
          const trueDepth = this.preCountTreeDepth(subTree.trueChild)
          const falseDepth = this.preCountTreeDepth(subTree.falseChild)
          if (trueDepth > falseDepth) {
            trueChildY = this.renderTreeAsCanvas(
              subTree.trueChild,
              ctx,
              x,
              x + (xmax - x) / 2,
              y + 2 * this.printHeight,
              givenStepSize
            )
            falseChildY = this.renderTreeAsCanvas(
              subTree.falseChild,
              ctx,
              x + (xmax - x) / 2,
              xmax,
              y + 2 * this.printHeight,
              (this.preCountTreeDepth(subTree.trueChild) - this.preCountNonOneLiners(subTree.falseChild)) / this.preCountOneLiners(subTree.falseChild) * givenStepSize
            )
          } else {
            trueChildY = this.renderTreeAsCanvas(
              subTree.trueChild,
              ctx,
              x,
              x + (xmax - x) / 2,
              y + 2 * this.printHeight,
              (this.preCountTreeDepth(subTree.falseChild) - this.preCountNonOneLiners(subTree.trueChild)) / this.preCountOneLiners(subTree.trueChild) * givenStepSize
            )
            falseChildY = this.renderTreeAsCanvas(
              subTree.falseChild,
              ctx,
              x + (xmax - x) / 2,
              xmax,
              y + 2 * this.printHeight,
              givenStepSize
            )
          }

          // determine which child sub tree is deeper y wise
          let valueY, followY
          if (trueChildY < falseChildY) {
            valueY = falseChildY
            followY = trueChildY
          } else {
            valueY = trueChildY
            followY = falseChildY
          }

          ctx.rect(x, y, xmax - x, valueY - y)
          ctx.stroke()

          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            followY,
            givenStepSize
          )
        }

        case 'CountLoopNode':
        case 'HeadLoopNode': {
          const childY = this.renderTreeAsCanvas(
            subTree.child,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y + this.printHeight,
            givenStepSize
          )
          ctx.rect(x, y, xmax - x, childY - y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = 'rgb(220, 239, 231)'
          ctx.rect(x, y, xmax, this.printHeight - 1)
          ctx.rect(x, y, (xmax - x) / 12 - 1, childY - y)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            childY,
            givenStepSize
          )
        }

        case 'FootLoopNode': {
          const childY = this.renderTreeAsCanvas(
            subTree.child,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y,
            givenStepSize
          )
          ctx.rect(x, y, xmax - x, childY - y + this.printHeight)
          ctx.stroke()
          ctx.beginPath()
          ctx.fillStyle = 'rgb(220, 239, 231)'
          ctx.rect(x, y, (xmax - x) / 12, childY - y + this.printHeight)
          ctx.rect(x, childY, xmax, this.printHeight)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText(subTree.text, x + 15, childY + defaultMargin)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + (xmax - x) / 12, childY)
          ctx.lineTo(xmax, childY)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            childY + this.printHeight,
            givenStepSize
          )
        }

        case 'CaseNode': {
          ctx.fillStyle = 'rgb(250, 218, 209)'
          ctx.beginPath()
          ctx.rect(x, y, xmax - x, 2 * this.printHeight)
          ctx.fill()
          ctx.fillStyle = 'black'
          let caseCount = subTree.cases.length
          if (subTree.defaultOn) {
            caseCount = caseCount + 1
          }
          // calculate the x and y distance between each case
          // yStep ist used for the positioning of the vertical lines on the diagonal line
          const xStep = (xmax - x) / caseCount
          const yStep = this.printHeight / subTree.cases.length
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x, y)
          if (subTree.defaultOn) {
            ctx.lineTo(xmax - xStep, y + this.printHeight)
            ctx.lineTo(xmax, y)
            ctx.moveTo(xmax - xStep, y + this.printHeight)
            ctx.lineTo(xmax - xStep, y + 2 * this.printHeight)
            ctx.stroke()
            const textWidth = ctx.measureText(subTree.text)
            ctx.beginPath()
            ctx.fillText(
              subTree.text,
              xmax - xStep - textWidth.width * 1.3 / 2,
              y + defaultMargin * 0.7
            )
            ctx.stroke()
          } else {
            ctx.lineTo(xmax, y + this.printHeight)
            ctx.stroke()
            const textWidth = ctx.measureText(subTree.text)
            ctx.beginPath()
            ctx.fillText(
              subTree.text,
              xmax - textWidth.width,
              y + defaultMargin * 0.7
            )
            ctx.stroke()
          }

          let xPos = x
          // determine the deepest tree by the y coordinate
          const maxDepth = this.preCountTreeDepth(subTree) - 2
          const maxCase = this.getDeepestCase(subTree)
          let yFinally = y + 3 * this.printHeight
          for (const element of subTree.cases) {
            let childY
            if (maxCase === element) {
            // is the deepest tree
              childY = this.renderTreeAsCanvas(
                element,
                ctx,
                xPos,
                xPos + xStep,
                y + this.printHeight,
                givenStepSize
              )
            } else {
              if (maxDepth === this.preCountTreeDepth(element)) {
                // is not the deepest tree but has the same depth as the deepest tree
                const newStepSize = (this.preCountTreeDepth(element) * givenStepSize - this.preCountNonOneLiners(element)) / this.preCountOneLiners(element)
                childY = this.renderTreeAsCanvas(
                  element,
                  ctx,
                  xPos,
                  xPos + xStep,
                  y + this.printHeight,
                  newStepSize
                )
              } else {
                // is not the deepest tree
                const newStepSize = ((maxDepth - this.preCountNonOneLiners(element)) / this.preCountOneLiners(element) * givenStepSize)
                childY = this.renderTreeAsCanvas(
                  element,
                  ctx,
                  xPos,
                  xPos + xStep,
                  y + this.printHeight,
                  newStepSize
                )
              }
            }
            if (childY > yFinally) {
              yFinally = childY
            }
            xPos = xPos + xStep
          }
          if (subTree.defaultOn) {
            let childY
            if (maxCase === subTree.defaultNode) {
            // is the deepest tree
              childY = this.renderTreeAsCanvas(
                subTree.defaultNode,
                ctx,
                xPos,
                xPos + xStep,
                y + this.printHeight,
                givenStepSize
              )
            } else {
              if (maxDepth === this.preCountTreeDepth(subTree.defaultNode)) {
                // is not the deepest tree but has the same depth as the deepest tree
                const newStepSize = (this.preCountTreeDepth(subTree.defaultNode) * givenStepSize - this.preCountNonOneLiners(subTree.defaultNode)) / this.preCountOneLiners(subTree.defaultNode)
                childY = this.renderTreeAsCanvas(
                  subTree.defaultNode,
                  ctx,
                  xPos,
                  xPos + xStep,
                  y + this.printHeight,
                  newStepSize
                )
              } else {
                // is not the deepest tree
                const newStepSize = ((maxDepth - this.preCountNonOneLiners(subTree.defaultNode)) / this.preCountOneLiners(subTree.defaultNode) * givenStepSize)
                childY = this.renderTreeAsCanvas(
                  subTree.defaultNode,
                  ctx,
                  xPos,
                  xPos + xStep,
                  y + this.printHeight,
                  newStepSize
                )
              }
            }
            if (childY > yFinally) {
              yFinally = childY
            }
          }
          // draw the vertical lines
          for (let i = 1; i <= subTree.cases.length; i++) {
            ctx.beginPath()
            ctx.moveTo(x + i * xStep, y + i * yStep)
            ctx.lineTo(x + i * xStep, yFinally)
            ctx.stroke()
          }
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            yFinally,
            givenStepSize
          )
        }

        case 'InsertCase': {
          const textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(
            subTree.text,
            x + Math.abs(xmax - x - textWidth.width) / 2,
            y + defaultMargin
          )
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y + this.printHeight,
            givenStepSize
          )
        }

        case 'FunctionNode': {
          const childY = this.renderTreeAsCanvas(
            subTree.child,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y + this.printHeight
          )
          ctx.rect(x, y, xmax - x, childY - y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = 'white'
          ctx.rect(x, y, xmax, this.printHeight - 1)
          ctx.rect(x, y, (xmax - x) / 12 - 1, childY - y + this.printHeight)
          ctx.rect(x, childY, xmax, this.printHeight - 2)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          let paramsText = ''
          for (let index = 0; index < subTree.parameters.length; index++) {
            if (
              subTree.parameters.length === 0 ||
              index === subTree.parameters.length - 1
            ) {
              paramsText += subTree.parameters[index].parName
            } else {
              paramsText += subTree.parameters[index].parName + ', '
            }
          }
          ctx.fillText(
            'function ' + subTree.text + '(' + paramsText + ') {',
            x + 15,
            y + defaultMargin
          )
          ctx.fillText('}', x + 15, childY + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            childY + this.printHeight
          )
        }

        case 'TryCatchNode': {
          const trychildY = this.renderTreeAsCanvas(
            subTree.tryChild,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y + this.printHeight,
            givenStepSize
          )
          const catchchildY = this.renderTreeAsCanvas(
            subTree.catchChild,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            trychildY + this.printHeight,
            givenStepSize
          )
          ctx.rect(x, y, xmax - x, catchchildY - y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = 'rgb(250, 218, 209)'
          ctx.rect(x, y, xmax, this.printHeight - 1)
          ctx.rect(x, trychildY, xmax, this.printHeight - 1)
          ctx.rect(x, y, (xmax - x) / 12 - 1, catchchildY - y)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText('Try', x + 15, y + defaultMargin)
          ctx.fillText('Catch', x + 15, trychildY + defaultMargin)
          ctx.stroke()
          ctx.beginPath()
          ctx.moveTo(x + (xmax - x) / 12, trychildY)
          ctx.lineTo(xmax, trychildY)
          ctx.stroke()

          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            catchchildY,
            givenStepSize
          )
        }
      }
    }
  }

  /**
   * Count the depth of the current tree element
   *
   * @param    subTree   object of the current element / sub tree of the struktogramm
   * @return   int       depth of the current tree element
   */
  preCountTreeDepth (subTree) {
    if (subTree === null) {
      return 0
    } else {
      switch (subTree.type) {
        case 'FunctionNode':
        case 'InsertNode':
        case 'InsertCase':
          return this.preCountTreeDepth(subTree.followElement)

        case 'Placeholder': {
          return 1
        }

        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode': {
          return 1 + this.preCountTreeDepth(subTree.followElement)
        }

        case 'BranchNode': {
          const trueChild = this.preCountTreeDepth(subTree.trueChild)
          const falseChild = this.preCountTreeDepth(subTree.falseChild)
          if (trueChild < falseChild) {
            return 2 + falseChild
          } else {
            return 2 + trueChild
          }
        }

        case 'CountLoopNode':
        case 'HeadLoopNode':
        case 'FootLoopNode': {
          return (
            1 +
            this.preCountTreeDepth(subTree.child) +
            this.preCountTreeDepth(subTree.followElement)
          )
        }

        case 'TryCatchNode': {
          return (
            2 +
            this.preCountTreeDepth(subTree.tryChild) +
            this.preCountTreeDepth(subTree.catchChild) +
            this.preCountTreeDepth(subTree.followElement)
          )
        }

        case 'CaseNode': {
          const maxList = []
          for (const element of subTree.cases) {
            maxList.push(this.preCountTreeDepth(element))
          }
          if (subTree.defaultOn) {
            maxList.push(this.preCountTreeDepth(subTree.defaultNode))
          }
          return (
            2 +
            Math.max(...maxList)
          )
        }
      }
    }
  }

  /**
   * Return the case with the deepest depth
   *
   * @param {*} subTree
   * @returns
   */
  getDeepestCase (subTree) {
    const maxList = []
    const normalNodes = []
    for (const element of subTree.cases) {
      maxList.push(this.preCountTreeDepth(element))
      normalNodes.push(this.preCountOneLiners(element))
    }
    if (subTree.defaultOn) {
      maxList.push(this.preCountTreeDepth(subTree.defaultNode))
      normalNodes.push(this.preCountOneLiners(subTree.defaultNode))
    }
    const maxDeph = Math.max(...maxList)
    for (let index = 0; index < maxList.length; index++) {
      if (maxList[index] === maxDeph) {
        maxList[index] += normalNodes[index]
      }
    }
    const index = maxList.indexOf(Math.max(...maxList))
    if (index === maxList.length - 1) {
      return subTree.defaultNode
    } else {
      return subTree.cases[index]
    }
  }

  /**
   * Count the depth of the current tree element
   *
   * @param    subTree   object of the current element / sub tree of the struktogramm
   * @return   int       depth of the current tree element
   */
  preCountNonOneLiners (subTree) {
    if (subTree === null) {
      return 0
    } else {
      switch (subTree.type) {
        case 'FunctionNode':
        case 'InsertNode':
        case 'InsertCase':
          return this.preCountNonOneLiners(subTree.followElement)

        case 'Placeholder': {
          return 0
        }

        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode': {
          return this.preCountNonOneLiners(subTree.followElement)
        }

        case 'BranchNode': {
          const trueChild = this.preCountNonOneLiners(subTree.trueChild)
          const falseChild = this.preCountNonOneLiners(subTree.falseChild)
          if (trueChild < falseChild) {
            return 2 + falseChild
          } else {
            return 2 + trueChild
          }
        }

        case 'CountLoopNode':
        case 'HeadLoopNode':
        case 'FootLoopNode': {
          return (
            1 +
              this.preCountNonOneLiners(subTree.child) +
              this.preCountNonOneLiners(subTree.followElement)
          )
        }

        case 'TryCatchNode': {
          return (
            2 +
            this.preCountNonOneLiners(subTree.tryChild) +
            this.preCountNonOneLiners(subTree.catchChild) +
            this.preCountNonOneLiners(subTree.followElement)
          )
        }

        case 'CaseNode': {
          const maxList = []
          for (const element of subTree.cases) {
            maxList.push(this.preCountNonOneLiners(element))
          }
          if (subTree.defaultOn) {
            maxList.push(this.preCountNonOneLiners(subTree.defaultNode))
          }
          return (
            2 +
              // Math.max(...maxList)
              this.preCountNonOneLiners(this.getDeepestCase(subTree))
          )
        }
      }
    }
  }

  /**
   * Count the depth of the current tree element
   *
   * @param    subTree   object of the current element / sub tree of the struktogramm
   * @return   int       depth of the current tree element
   */
  preCountOneLiners (subTree) {
    if (subTree === null) {
      return 0
    } else {
      switch (subTree.type) {
        case 'FunctionNode':
        case 'InsertNode':
        case 'InsertCase':
          return this.preCountOneLiners(subTree.followElement)

        case 'Placeholder': {
          return 1
        }

        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode': {
          return 1 + this.preCountOneLiners(subTree.followElement)
        }

        case 'BranchNode': {
          const trueChild = this.preCountOneLiners(subTree.trueChild)
          const falseChild = this.preCountOneLiners(subTree.falseChild)
          if (trueChild < falseChild) {
            return falseChild
          } else {
            return trueChild
          }
        }

        case 'CountLoopNode':
        case 'HeadLoopNode':
        case 'FootLoopNode': {
          return (
            this.preCountOneLiners(subTree.child) +
            this.preCountOneLiners(subTree.followElement)
          )
        }

        case 'TryCatchNode': {
          return (
            this.preCountOneLiners(subTree.tryChild) +
            this.preCountOneLiners(subTree.catchChild) +
            this.preCountOneLiners(subTree.followElement)
          )
        }

        case 'CaseNode': {
          const maxList = []
          for (const element of subTree.cases) {
            maxList.push(this.preCountOneLiners(element))
          }
          if (subTree.defaultOn) {
            maxList.push(this.preCountOneLiners(subTree.defaultNode))
          }
          return (
            Math.max(...maxList)
          )
        }
      }
    }
  }

  /**
   * Create a PNG file of the current model and append a button for downloading
   */
  exportAsPng (model) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width =
      document.getElementById('structogram').parentElement.parentElement
        .clientWidth
    canvas.width = width
    canvas.height = document.getElementById('structogram').clientHeight

    ctx.font = '16px sans-serif'
    ctx.lineWidth = '1'
    // render the tree on the canvas
    const lastY = this.renderTreeAsCanvas(model, ctx, 0, width, 0)
    ctx.rect(0, 0, width, lastY + 1)
    ctx.strokeStyle = 'black'
    ctx.lineWidth = 1
    ctx.stroke()

    // define filename
    const exportFileDefaultName =
      'struktog_' + new Date(Date.now()).toJSON().substring(0, 10) + '.png'

    // create button / anker element
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', canvas.toDataURL('image/png'))
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  /**
   * Create a PNG file of the current model with htmtToImage and append a button for downloading
   */
  exportAsPngWithPackage () {
    htmlToImage.toPng(document.getElementById('structogram'))
      .then(function (dataUrl) {
        const linkElement = document.createElement('a')
        linkElement.setAttribute('href', dataUrl)
        // define filename
        const exportFileDefaultName = 'struktog_' + new Date(Date.now()).toJSON().substring(0, 10) + '.png'
        linkElement.setAttribute('download', exportFileDefaultName)
        linkElement.click()
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

  resetButtons () {}
  displaySourcecode () {}
  setLang () {}
}
