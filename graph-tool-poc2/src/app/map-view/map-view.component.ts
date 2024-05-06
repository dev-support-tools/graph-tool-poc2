import { Component, HostListener, OnInit } from '@angular/core';
import { DagreClusterLayout, DagreLayout, Graph, Orientation } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode, Layout, MiniMapPosition } from '@swimlane/ngx-graph';

import { NodeEx } from './nodeex';
import { EdgeEx } from './edgeex';
import { DataService } from '../data.service';


export class customLayout extends DagreClusterLayout {
  public override run(graph: Graph): Graph {
    try {
      const result = super.run(graph);
      return result;
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
export class MapViewComponent implements OnInit {

  public isEdit = false;

  public customLayout = new customLayout();

  
  constructor(public readonly DataService: DataService) {


  }
  ngOnInit(): void {
    this.DataService.Load().subscribe(() => {
      
    });
  }

  @HostListener('keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {

    if (event.ctrlKey && event.key === 's') {
      this.DataService.Save();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && event.key === 'ArrowLeft') {
      this.DataService.HiddenChildren();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
      this.DataService.ShowChildren();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.key === 'F2' || 
      event.key === 'Tab' ||
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'Delete'
    ) {
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.DataService.ClearInputState();
      this.DataService.ClearSelectedCluster();
      console.log("Escape")
      return;
    }
    if (this.DataService.IsInputState) {
      return;
    }
    if(event.key == "F2"){
      this.isEdit = true;
      this.DataService.ChangeEditState();
      return;
    }
    if (event.key === 'Tab') {
      this.DataService.addNode();
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.DataService.MoveSelectedNodeLeft();
      return;
    }
    if (event.key === 'ArrowRight') {
      this.DataService.ShowChildren();
      this.DataService.MoveSelectedNodeRight();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
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
    // クラスターを選択したとき
    if(this.DataService.IsClusterSelectMode){
      this.DataService.AddClusterNode($event.id);
      return;
    }

    // サブのノードを選択したとき
    if(this.DataService.IsRelateNode){
      if (this.DataService.SelectedNodeId == $event.id) {
        return;
      }
      this.DataService.RelateNode($event.id);
      this.DataService.ChangeRelateNodeOff();
      return;
    }
    // ノードを選択したとき
    this.DataService.SelectNode($event.id);
    if (this.DataService.IsAddCommand) {
      this.DataService.ChangeAddCommandOff();
      this.DataService.addNode();
      return;
    }
  }

  onNodeOpen() {
    this.DataService.ShowChildren();
  }

  onNodeClose() {
    this.DataService.HiddenChildren();
  }

  onNodeAdd($event: any) {
    this.DataService.ChangeAddCommandState();
  }

  onRelateNode($event: any) {
    this.DataService.ChangeRelateNodeState();
  }

  onKeypress($event: any) {
    // KeyPressイベントを伝播しないようにする
    $event.stopPropagation();
  }

}
