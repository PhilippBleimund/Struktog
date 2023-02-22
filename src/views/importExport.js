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
  renderTreeAsCanvas (subTree, ctx, x, xmax, y, overhead = 0, oneLineNodes = 1) {
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
            overhead,
            oneLineNodes
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
          const stepSize =
            this.printHeight + (this.printHeight * overhead) / oneLineNodes
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
            overhead,
            oneLineNodes
          )
        }

        case 'OutputNode': {
          const stepSize =
            this.printHeight + (this.printHeight * overhead) / oneLineNodes
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
            overhead,
            oneLineNodes
          )
        }

        case 'TaskNode': {
          const stepSize =
            this.printHeight + (this.printHeight * overhead) / oneLineNodes
          console.log('stepSize ' + stepSize)
          console.log('overhead ' + overhead)
          console.log('oneLineNodes ' + oneLineNodes)
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
          ctx.fillText(subTree.text, x + 15, y + defaultMargin)
          ctx.stroke()
          return this.renderTreeAsCanvas(
            subTree.followElement,
            ctx,
            x,
            xmax,
            y + stepSize,
            overhead,
            oneLineNodes
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
          if (
            this.preCountTreeDepth(subTree.trueChild) >
            this.preCountTreeDepth(subTree.falseChild)
          ) {
            trueChildY = this.renderTreeAsCanvas(
              subTree.trueChild,
              ctx,
              x,
              x + (xmax - x) / 2,
              y + 2 * this.printHeight
            )
            falseChildY = this.renderTreeAsCanvas(
              subTree.falseChild,
              ctx,
              x + (xmax - x) / 2,
              xmax,
              y + 2 * this.printHeight,
              this.preCountTreeDepth(subTree.trueChild) -
                this.preCountTreeDepth(subTree.falseChild),
              // count all InputNode, OutputNode, TaskNode in the falseChild
              this.countOneLineNodes(subTree.falseChild)
            )
          } else {
            trueChildY = this.renderTreeAsCanvas(
              subTree.trueChild,
              ctx,
              x,
              x + (xmax - x) / 2,
              y + 2 * this.printHeight,
              this.preCountTreeDepth(subTree.falseChild) -
                this.preCountTreeDepth(subTree.trueChild),
              // count all InputNode, OutputNode, TaskNode in the trueChild
              this.countOneLineNodes(subTree.trueChild)
            )
            falseChildY = this.renderTreeAsCanvas(
              subTree.falseChild,
              ctx,
              x + (xmax - x) / 2,
              xmax,
              y + 2 * this.printHeight
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
            y + this.printHeight
          )
          ctx.rect(x, y, xmax - x, childY - y)
          ctx.stroke()

          ctx.beginPath()
          ctx.fillStyle = 'rgb(220, 239, 231)'
          ctx.rect(x, y, xmax, this.printHeight - 1)
          ctx.rect(x, y, (xmax - x) / 12 - 1, childY - y + this.printHeight)
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
            childY
          )
        }

        case 'FootLoopNode': {
          const childY = this.renderTreeAsCanvas(
            subTree.child,
            ctx,
            x + (xmax - x) / 12,
            xmax,
            y
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
            childY + this.printHeight
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
          } else {
            ctx.lineTo(xmax, y + this.printHeight)
          }
          ctx.stroke()
          const textWidth = ctx.measureText(subTree.text)
          ctx.beginPath()
          ctx.fillText(
            subTree.text,
            xmax - xStep - textWidth.width / 2,
            y + defaultMargin
          )
          ctx.stroke()
          let xPos = x
          // determine the deepest tree by the y coordinate
          const maxDepth = this.preCountTreeDepth(subTree)
          console.log('maxDepth', maxDepth)
          let yFinally = y + 3 * this.printHeight
          for (const element of subTree.cases) {
            const childY = this.renderTreeAsCanvas(
              element,
              ctx,
              xPos,
              xPos + xStep,
              y + this.printHeight,
              maxDepth - 2 - this.preCountTreeDepth(element),
              this.countOneLineNodes(element)
            )
            if (childY > yFinally) {
              yFinally = childY
            }
            xPos = xPos + xStep
          }
          if (subTree.defaultOn) {
            const childY = this.renderTreeAsCanvas(
              subTree.defaultNode,
              ctx,
              xPos,
              xmax,
              y + this.printHeight,
              maxDepth - 2 - this.preCountTreeDepth(subTree.defaultNode),
              this.countOneLineNodes(subTree.defaultNode)
            )
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
            yFinally
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
            overhead,
            oneLineNodes
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
          console.log(subTree)
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
          return 2 + Math.max(...maxList)
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
        default: {
          return this.countOneLineNodes(subTree.followElement)
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
