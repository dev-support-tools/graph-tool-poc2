import { Node } from '@swimlane/ngx-graph';

export interface NodeEx extends Node {
    isSelected: boolean;
    isChildrenHidden: boolean;
}