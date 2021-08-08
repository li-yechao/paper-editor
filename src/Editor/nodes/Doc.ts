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

import Node, { StrictNodeSpec } from './Node'

export interface DocAttrs {}

export default class Doc extends Node<DocAttrs> {
  /**
   * Create Doc node.
   * @param content : The content expression for this node, like: title tag_list block+;
   */
  constructor(public readonly content: string) {
    super()
  }

  get name(): string {
    return 'doc'
  }

  get schema(): StrictNodeSpec<DocAttrs> {
    return {
      attrs: {},
      content: this.content,
    }
  }
}
