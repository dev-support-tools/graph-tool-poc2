import { Component, HostListener } from '@angular/core';
import { Graph } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { NodeEx } from './nodeex';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    console.log(event);
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    console.log(`keydown ${event}`);
    // KeyDownイベントを伝播しないようにする
    event.stopPropagation();
    event.preventDefault();
  }


  public extendedNodes: NodeEx[] = [
    {
      id: '1',
      label: 'Node 1',
      isSelected: false
    }
  ];
  public links: Edge[] = [];
  public clusters: ClusterNode[] = [];

  public get nodes(): Node[] {
    return this.extendedNodes;
  }

  onNodeKeypress($event: any, node: NodeEx) {
    console.log($event);
    console.log(node);
  }

  onNodeSelect($event: any) {
    console.log($event);

    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
      if (this.extendedNodes[i].id == $event.id){
        this.extendedNodes[i].isSelected = true;
      }
    }
  }

  onNodeAdd($event: any) {
    console.log($event);
    
    let selected_node_id = $event.id;
    let new_node_id = this.extendedNodes.length + 1;
    let new_node = {
      id: new_node_id.toString(),
      label: `New Node ${new_node_id.toString()}`,
      isSelected: false
    };
    this.extendedNodes.push(new_node);

    this.extendedNodes = [...this.extendedNodes];

    
    let new_link_id = `from_${selected_node_id}_to_${new_node_id}`;
    let new_link = {
      id: new_link_id,
      source: selected_node_id,
      target: new_node_id.toString(),
      label: 'is parent of'
    };
    this.links.push(new_link);
  }

  onKeypress($event: any) {
    console.log($event);
    // KeyPressイベントを伝播しないようにする
    $event.stopPropagation();
  }

}
