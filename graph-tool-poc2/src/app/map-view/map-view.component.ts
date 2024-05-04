import { Component, HostListener } from '@angular/core';
import { DagreClusterLayout, DagreLayout, Graph, Orientation } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode, Layout } from '@swimlane/ngx-graph';

import { NodeEx } from './nodeex';
import { EdgeEx } from './edgeex';
import { DataService } from '../data.service';


export class customLayout extends DagreLayout {
  public override run(graph: Graph): Graph {
    try {
      return super.run(graph);
    }
    catch (e) {
      console.log(e);
      return graph;
    }
  }
}


@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.scss']
})
export class MapViewComponent {

  public isEdit = false;

  public customLayout = new customLayout();



  constructor(public readonly DataService: DataService) {


  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {
    if (this.DataService.IsInputState) {
      if (event.key === 'Escape') {
        this.DataService.ChangeInputState();
        return;
      }
      return;
    }
    if(event.key == "F2"){
      this.isEdit = true;
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    if (event.key === 'Tab') {
      this.DataService.addNode();
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.DataService.MoveSelectedNodeLeft();
      return;
    }
    if (event.key === 'ArrowRight') {
      this.DataService.MoveSelectedNodeRight();
      return;
    }

    if (event.key === 'ArrowUp') {
      this.DataService.MoveSelectedNodeUP();
      return;
    }

    if (event.key === 'ArrowDown') {
      this.DataService.ModeNodeDown();
      return;
    }

    if (event.key === 'Delete') {
      this.DataService.deleteNode();
      return;
    }

    // KeyDownイベントを伝播しないようにする
    event.stopPropagation();
    event.preventDefault();
  }
  addNode() {
    this.DataService.addNode();
  }
  selectedNodeId(): any {
    this.DataService.deleteNode();
  }

  // ＋ボタンを押したときの処理
  onNodeKeypress($event: any, node: NodeEx) {

  }

  // ノードを選択したときの処理
  onNodeSelect($event: any) {
    this.DataService.SelectNode($event.id);
    if (this.DataService.IsAddCommand) {
      this.DataService.addNode();
      return;
    }
  }

  onNodeAdd($event: any) {
    this.DataService.ChangeAddCommandState();
  }

  onKeypress($event: any) {
    // KeyPressイベントを伝播しないようにする
    $event.stopPropagation();
  }

}
