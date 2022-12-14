/** @jsxImportSource minimal-view */

import { Dep, element, view, web } from 'minimal-view'

import { Canvy, CanvyElement, EditorScene, Marker } from 'canvy'

export interface EditorDetailData {
  editorValue: string
}

export const Code = web('code', view(
  class props {
    font!: string
    fontSize!: number
    scene!: EditorScene
    value!: Dep<string>
    editor!: Dep<CanvyElement>
    singleComment!: string
    onWheel?: (ev: WheelEvent) => void = () => { }
    onEnterMarker?: (ev: { detail: { marker: Marker, markerIndex: number } }) => void = () => { }
    onLeaveMarker?: (ev: { detail: { marker: Marker, markerIndex: number } }) => void = () => { }
  },

  class local {
    host = element
    waitingEditor?: CanvyElement
  },

  function actions({ $, fn, fns }) {
    return fns(new class actions {
      onCodeChange =
        fn(({ value }) => function onCodeChange(this: CanvyElement) {
          if (this.ready && this.value != null) {
            value.value = this.value
          }
        })

      onEvent =
        fn(({ onWheel }) => function onCodeEvent(this: CanvyElement, { detail: ev }) {
          if (ev.name === 'mousewheel') {
            onWheel(ev.data)
          }
        })
    })
  },

  function effects({ $, fx, fn, refs }) {
    $.css = /*css*/`
    & {
      box-sizing: border-box;
      max-width: 100%;
      flex: 1;
    }
    `

    const off = fx(function waitForEditor({ editor, waitingEditor }) {
      return waitingEditor.$.effect(({ ready }) => {
        if (ready) {
          off()
          editor.current = waitingEditor
        }
      })
    })

    fx(function drawCode({ value, font, fontSize, scene, onEnterMarker, onLeaveMarker }) {
      $.view = <Canvy
        key="text"
        ref={refs.waitingEditor}
        part="canvy"
        scene={scene}
        font={font}
        fontSize={fontSize}
        onevent={$.onEvent}
        onentermarker={onEnterMarker}
        onleavemarker={onLeaveMarker}
        onchange={$.onCodeChange}
        onedit={$.onCodeChange}
        initialValue={value.value as string}
      />
    })
  }))
