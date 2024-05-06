import { Node } from '@swimlane/ngx-graph';

export const NodeType = {
    Normal: 0,
    Sub: 1,
    Image: 2
} as const;

export type NodeType = typeof NodeType[keyof typeof NodeType];

// EdgeTypeの値を見て文字列を返す関数。
export const NodeTypeToString = (type: NodeType) => {
    switch (type) {
        case NodeType.Normal:
            return 'Normal';
        case NodeType.Sub:
            return 'Sub';
        case NodeType.Image:
            return 'Image';
    }
};

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
    nodeType: NodeType; // 0: 通常ノード, 1: サブノード, 2: 画像ノード
}