import { Button } from '@material-ui/core'
import { EditorState, Transaction } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React from 'react'

export type MenuComponentType = {
  button: React.ComponentType<{
    className?: string
    editorView: EditorView
  }>
  expand?: React.ComponentType<{ editorView: EditorView }>
  isExpandVisible?: (editorView: EditorView) => boolean
}

export default function createMenuComponent({
  children,
  isActive,
  toggleMark,
}: {
  children: React.ReactNode
  isActive?: (state: EditorState) => boolean
  toggleMark?: (state: EditorState, dispatch?: (tr: Transaction) => void) => boolean
}): MenuComponentType {
  return {
    button: ({ className, editorView }) => {
      const active = isActive?.(editorView.state)
      return (
        <Button
          className={className}
          style={{ opacity: active ? 1 : 0.6 }}
          color="inherit"
          onClick={() => {
            if (toggleMark) {
              const top = window.scrollY
              toggleMark(editorView.state, editorView.dispatch)
              window.scrollTo({ top })
              editorView.focus()
            }
          }}
        >
          {children}
        </Button>
      )
    },
  }
}