import { SortableSpec } from '@ng-dnd/sortable';

import { PromptItem } from '../prompt-card-item.interface';

export interface PromptSortable {
  spec: SortableSpec<PromptItem>;
  list: PromptItem[];
  tempList: PromptItem[];
}

export interface PromptCardItem extends PromptItem {
  showButtons?: boolean;
  originalIndex?: number;
  element?: HTMLElement;
  isLeftSide?: boolean;
  isLeftBack?: boolean;
}