import { Edge, Node } from '@swimlane/ngx-graph';

export interface EdgeEx extends Edge {
    order: number;
    stroke: string;
    strokeWidth: number;
    strokeDasharray: string;
}