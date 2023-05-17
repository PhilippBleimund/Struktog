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
    const webdriverImportInput = document.createElement('input')
    webdriverImportInput.classList.add('webdriver-input')
    webdriverImportInput.setAttribute('type', 'file')
    webdriverImportInput.addEventListener('change', (e) =>
      this.presenter.readFile(e)
    )
    webdriverImportInput.style.display = 'none'
    document.getElementById('optionButtons').appendChild(webdriverImportInput)
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
      this.exportAsPng(this.presenter.getModelTree())
    )
    document.getElementById('optionButtons').appendChild(exportDiv)
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
              (this.preCountTreeDepth(subTree.trueChild) - this.preCountNonOneLiners(subTree.falseChild)) / this.countOneLineNodes(subTree.falseChild) * givenStepSize
            )
          } else {
            trueChildY = this.renderTreeAsCanvas(
              subTree.trueChild,
              ctx,
              x,
              x + (xmax - x) / 2,
              y + 2 * this.printHeight,
              (this.preCountTreeDepth(subTree.falseChild) - this.preCountNonOneLiners(subTree.trueChild)) / this.countOneLineNodes(subTree.trueChild) * givenStepSize
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
          if (trueChildY < falseChildY) {
            trueChildY = falseChildY
          }
          ctx.rect(x, y, xmax - x, trueChildY - y)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            trueChildY
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
          let yFinally = y + 3 * this.printHeight
          for (const element of subTree.cases) {
            let childY
            if (maxDepth === this.preCountTreeDepth(element)) {
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
              // is not the deepest tree
              childY = this.renderTreeAsCanvas(
                element,
                ctx,
                xPos,
                xPos + xStep,
                y + this.printHeight,
                (maxDepth - this.preCountNonOneLiners(element)) / this.preCountOneLiners(element) * givenStepSize
              )
            }
            if (childY > yFinally) {
              yFinally = childY
            }
            xPos = xPos + xStep
          }
          if (subTree.defaultOn) {
            let childY
            if (maxDepth === this.preCountTreeDepth(subTree.defaultNode)) {
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
              // is not the deepest tree
              childY = this.renderTreeAsCanvas(
                subTree.defaultNode,
                ctx,
                xPos,
                xPos + xStep,
                y + this.printHeight,
                (maxDepth - this.preCountNonOneLiners(subTree.defaultNode)) / this.preCountOneLiners(subTree.defaultNode)
              )
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
          console.log(subTree)
          const trychildY = this.renderTreeAsCanvas(
            subTree.tryChild,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y + this.printHeight,
            overhead - 1 - this.countNonOneLineNodes(subTree.tryChild),
            this.countOneLineNodes(subTree.tryChild)
          )
          ctx.rect(x, y, xmax - x, trychildY - y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = 'rgb(220, 239, 231)'
          ctx.rect(x, y, xmax, this.printHeight - 1)
          ctx.rect(x, y, (xmax - x) / 12 - 1, trychildY - y + this.printHeight)
          ctx.fill()

          ctx.fillStyle = 'black'
          ctx.beginPath()
          ctx.fillText('try', x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            trychildY
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
   * Count the OneLineNodes in the current tree element
   *
   * @param    subTree   object of the current element / sub tree of the struktogramm
   * @return   int       depth of the current tree element
   */
  countOneLineNodes (subTree) {
    if (subTree === null) {
      return 0
    } else {
      switch (subTree.type) {
        case 'InputNode':
        case 'OutputNode':
        case 'TaskNode': {
          return 1 + this.countOneLineNodes(subTree.followElement)
        }
        case 'Placeholder': {
          return 0
        }
        case 'BranchNode': {
          const trueChild = this.preCountNonOneLiners(subTree.trueChild)
          const falseChild = this.preCountNonOneLiners(subTree.falseChild)
          if (trueChild < falseChild) {
            return this.countOneLineNodes(subTree.falseChild)
          } else {
            return this.countOneLineNodes(subTree.trueChild)
          }
        }

        case 'CountLoopNode':
        case 'HeadLoopNode':
        case 'FootLoopNode': {
          return (
            this.countOneLineNodes(subTree.child) +
              this.countOneLineNodes(subTree.followElement)
          )
        }

        case 'CaseNode': {
          const maxList = []
          for (const element of subTree.cases) {
            maxList.push(this.countOneLineNodes(element))
          }
          if (subTree.defaultOn) {
            maxList.push(this.countOneLineNodes(subTree.defaultNode))
          }
          return (
            Math.max(...maxList)
          )
        }
        default: {
          return this.countOneLineNodes(subTree.followElement)
        }
      }
    }
  }

  countNonOneLineNodes (subTree) {
    if (subTree === null || subTree === undefined) {
      return 0
    } else {
      switch (subTree.type) {
        case 'CaseNode':
        case 'BranchNode':
        case 'CountLoopNode':
        case 'HeadLoopNode':
        case 'FootLoopNode': {
          return this.preCountTreeDepth(subTree) + this.countNonOneLineNodes(subTree.followElement)
        }
        default: {
          return this.countNonOneLineNodes(subTree.followElement)
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
              Math.max(...maxList)
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

  resetButtons () {}
  displaySourcecode () {}
  setLang () {}
}
