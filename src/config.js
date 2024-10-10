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
class Config {
  constructor () {
    this.data = {
      InsertNode: {
        color: 'rgb(255,255,243)'
      },
      Placeholder: {
        color: 'rgb(255,255,243)'
      },
      InsertCase: {
        color: 'rgb(250, 218, 209)'
      },
      InputNode: {
        use: true,
        id: 'InputButton',
        text: 'Eingabe-Feld',
        icon: 'taskIcon',
        color: 'rgb(253, 237, 206)'
      },
      OutputNode: {
        use: true,
        id: 'OutputButton',
        text: 'Ausgabe-Feld',
        icon: 'taskIcon',
        color: 'rgb(253, 237, 206)'
      },
      BlockCallNode: {
        use: true,
        id: 'BlockCallButton',
        text: 'Blockaufruf',
        icon: 'taskIcon',
        color: 'rgb(253, 237, 206)'
      },
      TaskNode: {
        use: true,
        id: 'TaskButton',
        text: 'Anweisung',
        icon: 'taskIcon',
        color: 'rgb(253, 237, 206)'
      },
      CountLoopNode: {
        use: true,
        id: 'CountLoopButton',
        text: 'Zählergesteuerte Schleife',
        icon: 'countLoopIcon',
        color: 'rgb(220, 239, 231)'
      },
      HeadLoopNode: {
        use: true,
        id: 'HeadLoopButton',
        text: 'Kopfgesteuerte Schleife',
        icon: 'countLoopIcon',
        color: 'rgb(220, 239, 231)'
      },
      FootLoopNode: {
        use: true,
        id: 'FootLoopButton',
        text: 'Fußgesteuerte Schleife',
        icon: 'footLoopIcon',
        color: 'rgb(220, 239, 231)'
      },
      BranchNode: {
        use: true,
        id: 'BranchButton',
        text: 'Verzweigung',
        icon: 'branchIcon',
        color: 'rgb(250, 218, 209)'
      },
      CaseNode: {
        use: true,
        id: 'CaseButton',
        text: 'Fallunterscheidung',
        icon: 'caseIcon',
        color: 'rgb(250, 218, 209)'
      },
      FunctionNode: {
        use: true,
        id: 'FunctionButton',
        text: 'Funktionsblock',
        icon: 'funcIcon',
        color: 'rgb(255, 255, 255)'
      },
      TryCatchNode: {
        use: true,
        id: 'TryCatchButton',
        text: 'Try-Catch-Block',
        icon: 'tryCatchIcon',
        color: 'rgb(250, 218, 209)'
      }
    }

    this.alternatives = {
      python: {
        InsertNode: {
          color: 'rgb(255,255,243)'
        },
        Placeholder: {
          color: 'rgb(255,255,243)'
        },
        InsertCase: {
          color: 'rgb(250, 218, 209)'
        },
        InputNode: {
          use: true,
          id: 'InputButton',
          text: 'Eingabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        OutputNode: {
          use: true,
          id: 'OutputButton',
          text: 'Ausgabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        BlockCallNode: {
          use: true,
          id: 'BlockCallButton',
          text: 'Blockaufruf',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        TaskNode: {
          use: true,
          id: 'TaskButton',
          text: 'Anweisung',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        CountLoopNode: {
          use: false,
          id: 'CountLoopButton',
          text: 'Zählergesteuerte Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        HeadLoopNode: {
          use: true,
          id: 'HeadLoopButton',
          text: 'Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        FootLoopNode: {
          use: false,
          id: 'FootLoopButton',
          text: 'Fußgesteuerte Schleife',
          icon: 'footLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        BranchNode: {
          use: true,
          id: 'BranchButton',
          text: 'Verzweigung',
          icon: 'branchIcon',
          color: 'rgb(250, 218, 209)'
        },
        CaseNode: {
          use: true,
          id: 'CaseButton',
          text: 'Fallunterscheidung',
          icon: 'caseIcon',
          color: 'rgb(250, 218, 209)'
        },
        FunctionNode: {
          use: false,
          id: 'FunctionButton',
          text: 'Funktionsblock',
          icon: 'funcIcon',
          color: 'rgb(255, 255, 255)'
        },
        TryCatchNode: {
          use: true,
          id: 'TryCatchButton',
          text: 'Try-Catch-Block',
          icon: 'tryCatchIcon',
          color: 'rgb(250, 218, 209)'
        }
      },
      python_func: {
        InsertNode: {
          color: 'rgb(255,255,243)'
        },
        Placeholder: {
          color: 'rgb(255,255,243)'
        },
        InsertCase: {
          color: 'rgb(250, 218, 209)'
        },
        InputNode: {
          use: true,
          id: 'InputButton',
          text: 'Eingabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        OutputNode: {
          use: true,
          id: 'OutputButton',
          text: 'Ausgabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        BlockCallButton: {
          use: true,
          id: 'BlockCallButton',
          text: 'Blockaufruf',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        TaskNode: {
          use: true,
          id: 'TaskButton',
          text: 'Anweisung',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        CountLoopNode: {
          use: true,
          id: 'CountLoopButton',
          text: 'Zählergesteuerte Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        HeadLoopNode: {
          use: true,
          id: 'HeadLoopButton',
          text: 'Kopfgesteuerte Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        FootLoopNode: {
          use: true,
          id: 'FootLoopButton',
          text: 'Fußgesteuerte Schleife',
          icon: 'footLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        BranchNode: {
          use: true,
          id: 'BranchButton',
          text: 'Verzweigung',
          icon: 'branchIcon',
          color: 'rgb(250, 218, 209)'
        },
        CaseNode: {
          use: true,
          id: 'CaseButton',
          text: 'Fallunterscheidung',
          icon: 'caseIcon',
          color: 'rgb(250, 218, 209)'
        },
        FunctionNode: {
          use: true,
          id: 'FunctionButton',
          text: 'Funktionsblock',
          icon: 'funcIcon',
          color: 'rgb(255, 255, 255)'
        },
        TryCatchNode: {
          use: true,
          id: 'TryCatchButton',
          text: 'Try-Catch-Block',
          icon: 'tryCatchIcon',
          color: 'rgb(250, 218, 209)'
        }
      },
      standard: {
        InsertNode: {
          color: 'rgb(255,255,243)'
        },
        Placeholder: {
          color: 'rgb(255,255,243)'
        },
        InsertCase: {
          color: 'rgb(250, 218, 209)'
        },
        InputNode: {
          use: true,
          id: 'InputButton',
          text: 'Eingabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        OutputNode: {
          use: true,
          id: 'OutputButton',
          text: 'Ausgabe-Feld',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        BlockCallNode: {
          use: true,
          id: 'BlockCallButton',
          text: 'Blockaufruf',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        TaskNode: {
          use: true,
          id: 'TaskButton',
          text: 'Anweisung',
          icon: 'taskIcon',
          color: 'rgb(253, 237, 206)'
        },
        CountLoopNode: {
          use: true,
          id: 'CountLoopButton',
          text: 'Zählergesteuerte Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        HeadLoopNode: {
          use: true,
          id: 'HeadLoopButton',
          text: 'Kopfgesteuerte Schleife',
          icon: 'countLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        FootLoopNode: {
          use: true,
          id: 'FootLoopButton',
          text: 'Fußgesteuerte Schleife',
          icon: 'footLoopIcon',
          color: 'rgb(220, 239, 231)'
        },
        BranchNode: {
          use: true,
          id: 'BranchButton',
          text: 'Verzweigung',
          icon: 'branchIcon',
          color: 'rgb(250, 218, 209)'
        },
        CaseNode: {
          use: true,
          id: 'CaseButton',
          text: 'Fallunterscheidung',
          icon: 'caseIcon',
          color: 'rgb(250, 218, 209)'
        },
        FunctionNode: {
          use: false,
          id: 'FunctionButton',
          text: 'Funktionsblock',
          icon: 'funcIcon',
          color: 'rgb(255, 255, 255)'
        },
        TryCatchNode: {
          use: false,
          id: 'TryCatchButton',
          text: 'Try-Catch-Block',
          icon: 'tryCatchIcon',
          color: 'rgb(250, 218, 209)'
        }
      }
    }
  }

  get () {
    return this.data
  }

  loadConfig (id) {
    if (id in this.alternatives) {
      this.data = this.alternatives[id]
    }
  }
}

export const config = new Config()
