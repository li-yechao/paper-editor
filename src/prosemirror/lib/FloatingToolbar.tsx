// Copyright 2021 LiYechao
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import styled from '@emotion/styled'
import { Box, ButtonGroup, Popper, Tooltip, TooltipProps } from '@material-ui/core'
import { debounce } from 'lodash'
import { EditorView } from 'prosemirror-view'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useToggle } from 'react-use'
import { MenuComponentType } from './createMenuComponent'

export interface FloatingToolbarProps {
  editorView: EditorView
  menus: MenuComponentType[]
}

export const FloatingToolbar = (props: FloatingToolbarProps) => {
  const popperProps = usePopperProps(props.editorView)
  const isSelecting = useIsSelecting(props.editorView)

  return (
    <Tooltip
      {...popperProps}
      PopperComponent={_Popper}
      PopperProps={{ ...popperProps.PopperProps, active: !isSelecting } as any}
      title={
        <>
          <ButtonGroup variant="text" color="inherit">
            {props.menus.map((menu, index) => (
              <menu.button key={index} editorView={props.editorView} />
            ))}
          </ButtonGroup>
          {props.menus.map((menu, index) => {
            return (
              menu.expand &&
              menu.isExpandVisible?.(props.editorView) && (
                <Box key={index} borderTop={1} borderColor="rgba(0, 0, 0, 0.23)">
                  <menu.expand editorView={props.editorView} />
                </Box>
              )
            )
          })}
        </>
      }
    />
  )
}

function usePopperProps(editorView: EditorView) {
  const defaultProps: Omit<TooltipProps, 'title'> = {
    open: false,
    placement: 'top',
    arrow: true,
    disableFocusListener: true,
    disableHoverListener: true,
    disableTouchListener: true,
    children: <div />,
  }

  const [props, setProps] = useState(defaultProps)

  useEffect(
    debounce(() => {
      const props = { ...defaultProps }

      const { selection } = editorView.state
      if (!selection.empty && !(selection as any).node) {
        const node = editorView.domAtPos(selection.from).node
        const anchorEl = node instanceof Element ? node : node.parentElement

        if (anchorEl) {
          const fromPos = editorView.coordsAtPos(selection.from)
          const toPos = editorView.coordsAtPos(selection.to)
          const { width, left, top } = anchorEl.getBoundingClientRect()
          const offsetX = (toPos.left - fromPos.left) / 2 + fromPos.left - left - width / 2
          const offsetY = top - fromPos.top + 4

          props.open = true
          props.PopperProps = {
            anchorEl,
            keepMounted: true,
            modifiers: {
              offset: { offset: `${offsetX},${offsetY}` },
              preventOverflow: { boundariesElement: 'viewport' },
            },
          }
        }
      }

      setProps(props)
    }, 700)
  )

  return props
}

function useIsSelecting(editorView: EditorView) {
  const [isSelecting, toggleIsSelection] = useToggle(false)
  useEffect(() => {
    const onMouseDown = () => toggleIsSelection(true)
    const onMouseUp = () => toggleIsSelection(false)
    editorView.dom.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      editorView.dom.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])
  return isSelecting
}

const _Popper = styled(Popper, { shouldForwardProp: p => p !== 'active' })<{ active?: boolean }>`
  user-select: none;
  pointer-events: ${props => (props.active ? 'all' : 'none')};

  > .MuiTooltip-tooltip {
    padding: 0;
  }
`

export default FloatingToolbar