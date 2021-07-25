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

import { InputRule, wrappingInputRule } from 'prosemirror-inputrules'
import { NodeType } from 'prosemirror-model'
import Node, { StrictNodeSpec } from './Node'

export interface TodoListAttrs {}

export default class TodoList extends Node<TodoListAttrs> {
  get name(): string {
    return 'todo_list'
  }

  get schema(): StrictNodeSpec<TodoListAttrs> {
    return {
      attrs: {},
      content: 'todo_item+',
      group: 'block',
      parseDOM: [{ tag: 'ul[data-type="todo_list"]' }],
      toDOM: () => ['ul', { 'data-type': 'todo_list' }, 0],
    }
  }

  inputRules({ type }: { type: NodeType }): InputRule[] {
    return [wrappingInputRule(/^(\[\s?\])\s$/i, type)]
  }
}