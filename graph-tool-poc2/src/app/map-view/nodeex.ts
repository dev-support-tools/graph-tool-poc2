import { Node } from '@swimlane/ngx-graph';

export interface Image{
    filename: string;
    name: string;
    text: string;
    url: string;
}

export interface NodeEx extends Node {
    isSelected: boolean;
    isChildrenHidden: boolean;
    images: Image[];
}