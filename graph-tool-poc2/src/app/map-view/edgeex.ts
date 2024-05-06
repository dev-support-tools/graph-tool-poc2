import { Edge, Node } from '@swimlane/ngx-graph';

export const EdgeType = {
    Normal: 0,
    Sub: 1
} as const;

export type EdgeType = typeof EdgeType[keyof typeof EdgeType];

// EdgeTypeの値を見て文字列を返す関数。
export const EdgeTypeToString = (type: EdgeType) => {
    switch (type) {
        case EdgeType.Normal:
            return 'Normal';
        case EdgeType.Sub:
            return 'Sub';
    }
};



export interface EdgeEx extends Edge {
    order: number;
    linkType: EdgeType; // 0: 通常リンク, 1: サブリンク
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
}