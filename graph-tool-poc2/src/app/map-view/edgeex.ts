import { Edge, Node } from '@swimlane/ngx-graph';




export interface EdgeEx extends Edge {
    order: number;
    linkType: number; // 0: 通常リンク, 1: サブリンク
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
}