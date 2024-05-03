import { Component, HostListener } from '@angular/core';
import { Graph } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { NodeEx } from './nodeex';
import { EdgeEx } from './edgeex';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  public layoutSettings = {
    orientation: 'LR',
    ranker: 'tight-tree',
    align: 'UL',
    compound: false,
    edgePadding: 0,
    multigraph: true,
  };

  public extendedNodes: NodeEx[] = [
    {
      id: '1',
      label: 'Node 1',
      isSelected: false
    }
  ];
  public get nodes(): Node[] {
    return this.extendedNodes;
  }

  private extendedEdges: EdgeEx[] = [];
  public get links(): Edge[] {
    return this.extendedEdges;
  }

  public clusters: ClusterNode[] = [];

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    event.stopPropagation();
    event.preventDefault();
    if (event.key === 'Tab') {
      this.addNode(parseInt(this.selectedNodeId));
      return;
    }
    if (event.key === 'ArrowLeft') {
      for(let link of this.links){
        if (link.target === this.selectedNodeId){
          this.selectedNodeId = link.source;
          for(let i = 0; i < this.extendedNodes.length; i++){
            this.extendedNodes[i].isSelected = false;
            if (this.extendedNodes[i].id == this.selectedNodeId){
              this.extendedNodes[i].isSelected = true;
            }
          }
          this.extendedNodes = [...this.extendedNodes];
          return;
        }
      }
      return;
    }
    if (event.key === 'ArrowRight') {
      for(let link of this.links){
        if (link.source === this.selectedNodeId){
          this.selectedNodeId = link.target;
          for(let i = 0; i < this.extendedNodes.length; i++){
            this.extendedNodes[i].isSelected = false;
            if (this.extendedNodes[i].id == this.selectedNodeId){
              this.extendedNodes[i].isSelected = true;
            }
          }
          this.extendedNodes = [...this.extendedNodes];
          return;
        }
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      console.log(this.links);
      // 選択されたノードの親ノードと選択されたノードorderを取得
      let parent_node_id = '';
      let selectedNodeOrderNumber = 0;
      let parent_edge = this.extendedEdges.filter(edge => edge.target === this.selectedNodeId);
      if (parent_edge.length > 0) {
        parent_node_id = parent_edge[0].source;
        selectedNodeOrderNumber = parent_edge[0].order;
      }

      // 選択されたノードの同列のノードでorderが1つ大きいノードを取得
      let next_node_id = '';
      let next_edge = event.key === 'ArrowDown' ? 
        this.extendedEdges.filter(edge => edge.source === parent_node_id && edge.order > selectedNodeOrderNumber) :
        this.extendedEdges.filter(edge => edge.source === parent_node_id && edge.order < selectedNodeOrderNumber);
      if (next_edge.length > 0) {
        // 最小のorderを取得
        let next_order = event.key === 'ArrowDown' ?  Math.min(...next_edge.map(edge => edge.order)) : 
          Math.max(...next_edge.map(edge => edge.order));
        let next_edge2 = this.extendedEdges.find(edge => edge.source === parent_node_id && edge.order === next_order);
        if (next_edge2) {
          let next_selected_node_id = next_edge2.target;
          this.selectedNodeId = next_selected_node_id;
          for(let i = 0; i < this.extendedNodes.length; i++){
            if (this.extendedNodes[i].id === next_selected_node_id){
              this.extendedNodes[i].isSelected = true;
              continue;
            }
            this.extendedNodes[i].isSelected = false;
            this.extendedEdges = [...this.extendedEdges];
          }
        }
      }
      return;
    }

    


    console.log(event);
    console.log(`keydown ${event}`);
    // KeyDownイベントを伝播しないようにする
    event.stopPropagation();
    event.preventDefault();
  }

  // 状態(選択、入力、コマンド入力中)
  public isInputState = false;
  private isAddCommand = false;
  public selectedNodeId = '';




  // ＋ボタンを押したときの処理
  onNodeKeypress($event: any, node: NodeEx) {
    console.log($event);
    console.log(node);
  }

  // ノードを選択したときの処理
  onNodeSelect($event: any) {
    this.selectedNodeId = $event.id;
    if (this.isAddCommand) {
      this.addNode($event.id);
      this.isAddCommand = false;
      return;
    }
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
      if (this.extendedNodes[i].id == $event.id){
        this.extendedNodes[i].isSelected = true;
      }
    }
    this.extendedNodes = [...this.extendedNodes];
  }

  private addNode(nodeId: number) {
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
    }
    
    let selected_node_id = nodeId.toString();
    let new_node_id = this.extendedNodes.length + 1;
    let new_node = {
      id: new_node_id.toString(),
      label: `New Node ${new_node_id.toString()}`,
      isSelected: true,
      
    };
    this.extendedNodes.push(new_node);

    let edgeOrder = 0;
    if (this.extendedEdges.length > 0) {
      let sameSouorceEdges = this.extendedEdges.filter(edge => edge.source === selected_node_id);
      if (sameSouorceEdges.length > 0) {
        edgeOrder = Math.max(...sameSouorceEdges.map(edge => edge.order)) + 1;
      }
    }
        
    let new_link_id = `from_${selected_node_id}_to_${new_node_id}`;
    let new_link: EdgeEx = {
      id: new_link_id,
      source: selected_node_id,
      target: new_node_id.toString(),
      label: 'is parent of',
      order: edgeOrder
    };
    this.extendedEdges.push(new_link);
    this.extendedEdges = [...this.extendedEdges, new_link];
    this.extendedNodes = [...this.extendedNodes];
    this.selectedNodeId = new_node_id.toString();
  }

  onNodeAdd($event: any) {
    console.log('onNodeAdd');
    this.isAddCommand = true;
    this.isInputState = true;
    console.log($event);
  }

  onKeypress($event: any) {
    console.log($event);
    // KeyPressイベントを伝播しないようにする
    $event.stopPropagation();
  }

}
