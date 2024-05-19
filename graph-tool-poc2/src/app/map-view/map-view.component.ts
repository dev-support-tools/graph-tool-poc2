import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
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
export class MapViewComponent implements OnInit, AfterViewInit {
  @ViewChild('contentRoot') contentRoot: ElementRef | undefined;

  public isEdit = false;

  public customLayout = new customLayout();

  
  constructor(public readonly dataService: DataService) {


  }
  ngAfterViewInit(): void {
    const width = this.contentRoot?.nativeElement.clientWidth;
    const height = this.contentRoot?.nativeElement.clientHeight;
    this.dataService.SetWindowSize(width, height);
  }
  ngOnInit(): void {
    this.dataService.Load().subscribe(() => {
      
    });
  }

  @HostListener('keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    event.stopPropagation();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydownEvent(event: KeyboardEvent) {

    if (event.ctrlKey && event.key === 's') {
      this.dataService.Save();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && event.key === 'ArrowLeft') {
      this.dataService.HiddenChildren();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.shiftKey && event.key === 'ArrowRight') {
      this.dataService.ShowChildren();
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
      this.dataService.ClearInputState();
      this.dataService.ClearSelectedCluster();
      console.log("Escape")
      return;
    }
    if (this.dataService.IsInputState) {
      return;
    }
    if(event.key == "F2"){
      this.isEdit = true;
      this.dataService.ChangeEditState();
      return;
    }
    if (event.key === 'Tab') {
      this.dataService.addNode();
      return;
    }
    if (event.key === 'ArrowLeft') {
      this.dataService.MoveSelectedNodeLeft();
      return;
    }
    if (event.key === 'ArrowRight') {
      this.dataService.ShowChildren();
      this.dataService.MoveSelectedNodeRight();
      // KeyDownイベントを伝播しないようにする
      event.stopPropagation();
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowUp') {
      this.dataService.MoveSelectedNodeUP();
      return;
    }

    if (event.key === 'ArrowDown') {
      this.dataService.ModeNodeDown();
      return;
    }

    if (event.key === 'Delete') {
      this.dataService.deleteNode();
      return;
    }
  }
  addNode() {
    this.dataService.addNode();
  }
  selectedNodeId(): any {
    this.dataService.deleteNode();
  }

  // ＋ボタンを押したときの処理
  onNodeKeypress($event: any, node: NodeEx) {

  }

  // ノードを選択したときの処理
  onNodeSelect($event: any) {
    // クラスターを選択したとき
    if(this.dataService.IsClusterSelectMode){
      this.dataService.AddClusterNode($event.id);
      return;
    }

    // サブのノードを選択したとき
    if(this.dataService.IsRelateNode){
      if (this.dataService.SelectedNodeId == $event.id) {
        return;
      }
      this.dataService.RelateNode($event.id);
      this.dataService.ChangeRelateNodeOff();
      return;
    }
    // ノードを選択したとき
    this.dataService.SelectNode($event.id);
    if (this.dataService.IsAddCommand) {
      this.dataService.ChangeAddCommandOff();
      this.dataService.addNode();
      return;
    }
  }

  onNodeOpen() {
    this.dataService.ShowChildren();
  }

  onNodeClose() {
    this.dataService.HiddenChildren();
  }

  onNodeAdd($event: any) {
    this.dataService.ChangeAddCommandState();
  }

  onRelateNode($event: any) {
    this.dataService.ChangeRelateNodeState();
  }

  onKeypress($event: any) {
    // KeyPressイベントを伝播しないようにする
    $event.stopPropagation();
  }

}
