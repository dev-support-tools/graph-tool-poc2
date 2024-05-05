import { Injectable } from '@angular/core';
import { NodeEx } from './map-view/nodeex';
import { EdgeEx } from './map-view/edgeex';
import { ClusterNode, Edge } from '@swimlane/ngx-graph';
import { Observable, Subject, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private selectedFile = 'data.json';
  public get SelectedFile(): string {
    return this.selectedFile;
  }
  public SelectFile(fileName: string) {
    this.selectedFile = fileName;
  }

  public extendedNodes: NodeEx[] = [
    {
      id: '1',
      label: 'Node 1',
      isSelected: false,
    }
  ];
  public get nodes(): NodeEx[] {
    return this.extendedNodes;
  }

  private extendedEdges: EdgeEx[] = [];
  public get links(): Edge[] {
    return this.extendedEdges;
  }

  // クラスター関係
  private selectedCluster: ClusterNode | null = null;
  private clusters: ClusterNode[] = [];
  public get Clusters(): ClusterNode[] {
    return this.clusters;
  }
  public SelectCluster(clusterId: string) {
    for(let i = 0; i < this.clusters.length; i++){
      
      if (this.clusters[i].id == clusterId){
        this.selectedCluster = this.clusters[i];
        console.log(this.selectedCluster);
      }
    }
  }
  public get IsClusterSelectMode(): boolean {
    if (this.selectedCluster === null) {
      return false;
    }
    return this.selectedCluster?.id !== '';
  }
  public AddCluster() {
    console.log(this.clusters);
    let clusterLength = this.clusters.length;
    let cluster = {
      id: `cluster${clusterLength}`,
      childNodeIds: [],
      label: `Cluster ${clusterLength}`
    };
    this.clusters.push(cluster);
    this.clusters = [...this.clusters];
  }
  public AddClusterNode(nodeId: string): void {
    // ノードをクラスターに追加
    if (this.selectedCluster) {
      // nodeIdからノードを取得
      let node = this.extendedNodes.find(node => node.id === nodeId);
      if (node) {
        if(this.selectedCluster !== undefined && this.selectedCluster.childNodeIds !== undefined){
          this.selectedCluster.childNodeIds.push(nodeId);
        }
      }
    }
    this.extendedNodes = [...this.extendedNodes];
    this.clusters = [...this.clusters];
  }
  public ClearSelectedCluster() {
    this.selectedCluster = null;
  }


  // 状態(選択、入力、コマンド入力中)
  private isInputState = false;
  public get IsInputState(): boolean {
    return this.isInputState;
  }
  public ChangeInputState() {
    this.isInputState = !this.isInputState;
  }
  public ClearInputState() {
    this.isInputState = false;
  }
  // 選択状態
  private selectedNodeId = '';
  public get SelectedNodeId(): string {
    return this.selectedNodeId;
  }

  // 追加コマンド状態
  private isAddCommand = false;
  public get IsAddCommand(): boolean {
    return this.isAddCommand;
  }
  public ChangeAddCommandState() {
    this.isAddCommand = true;
  }

  public ChangeAddCommandOff() {
    this.isAddCommand = false;
  }

  // 関連ノード追加
  private isRelateNode = false;
  public get IsRelateNode(): boolean {
    return this.isRelateNode;
  }  
  public ChangeRelateNodeState() {
    this.isRelateNode = true;
  }
  public ChangeRelateNodeOff() {
    this.isRelateNode = false;
  }
  public RelateNode(nodeId: string) {
    let selected_node_id = this.selectedNodeId.toString();
    let new_node_id = nodeId;
    let new_link_id = `from_${selected_node_id}_to_${new_node_id}`;
    let new_link: EdgeEx = {
      id: new_link_id,
      source: selected_node_id,
      target: new_node_id.toString(),
      label: 'is parent of',
      order: 0,
      stroke: 'red',
      strokeWidth: 2,
      strokeDasharray: '3,3'
    };
    this.extendedEdges = [...this.extendedEdges, new_link];
  }



  public get SelectedNodeText(): string {
    if (this.selectedNodeId === '') {
      return '';
    }
    let selectedNode = this.extendedNodes.find(node => node.id === this.selectedNodeId);
    if (!selectedNode) {
      return '';
    }
    if (selectedNode.label === undefined) {
      return '';
    }
    return selectedNode.label;
  }

  public set SelectedNodeText(value: string){
    let selectedNode = this.extendedNodes.find(node => node.id === this.selectedNodeId);
    if (selectedNode) {
      selectedNode.label = value;
    }
    this.extendedNodes = [...this.extendedNodes];
    
  }

  private notificationSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  public addFile() {
    console.log('addFile');
    this.httpClient.post('./api/file/add', {}).subscribe((data) => {
      console.log(data);
    });
  }

  public loadFileList(): Observable<string[]> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    
    console.log('loadFileList');
    return this.httpClient.get('./api/file/list', httpOptions).pipe(
      map((data: any) => {
        console.log(data);
        return data as string[];
      }));
  }

  public Save() {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    const requestBody = {
      fileName: this.selectedFile,
      nodes: this.extendedNodes,
      edges: this.extendedEdges,
      clusters: this.clusters,
      selectedNodeId: this.selectedNodeId
    };
    this.httpClient.post('./api/data/save', requestBody, httpOptions).subscribe((data) => {
      console.log(data);
    });
  }

  public Load() : Observable<void> {
    const requestBody = {
      fileName: this.selectedFile
    };
    let result = this.httpClient.post('./api/data/load', requestBody).subscribe((data: any) => {
      console.log(data);
      if (data === null || data === undefined || data.nodes === undefined) {
        this.extendedNodes = [];
        this.extendedNodes.push({
          id: '1',
          label: 'Node 1',
          isSelected: false,
        });
        this.extendedEdges = [];
        this.clusters = [];
        this.selectedNodeId = '';
        return;
      }

      this.extendedNodes = data.nodes;
      this.extendedEdges = data.edges;
      this.clusters = data.clusters;
      this.selectedNodeId = data.selectedNodeId;
      this.extendedNodes = [...this.extendedNodes];
      this.extendedEdges = [...this.extendedEdges];
      if(this.clusters === undefined){
        this.clusters = [];
      }else{
        this.clusters = [...this.clusters];
      }
      
    });
    return of();
  }

  public ChangeEditState() {
    this.notificationSubject.next('Edit');
  }

  public get NotificationObservable() {
    return this.notificationSubject.asObservable();
  }


  public SelectNode(nodeId: string) {
    this.selectedNodeId = nodeId;
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
      if (this.extendedNodes[i].id == nodeId){
        this.extendedNodes[i].isSelected = true;
      }
    }
    this.extendedNodes = [...this.extendedNodes];
  }

  public addNode() {
    const nodeId = this.selectedNodeId;
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
      order: edgeOrder,
      stroke: 'black',
      strokeWidth: 4,
      strokeDasharray: ''
    };
    this.extendedEdges = [...this.extendedEdges, new_link];
    this.extendedNodes = [...this.extendedNodes];
    this.selectedNodeId = new_node_id.toString();
    console.log(this.extendedEdges);
  }

  // ノードを削除
  public deleteNode() {
    const nodeId = this.selectedNodeId

    // 親ノードを選択
    let parent_edges = this.extendedEdges.filter(edge => edge.target === nodeId);
    if (parent_edges.length > 0) {
      this.selectedNodeId = parent_edges[0].source;
    }
    // ノードを選択
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
      if (this.extendedNodes[i].id == this.selectedNodeId){
        this.extendedNodes[i].isSelected = true;
      }
    }

    // ノードを削除
    this.extendedNodes = this.extendedNodes.filter(node => node.id !== nodeId);
    this.extendedNodes = [...this.extendedNodes];

    // 子ノードを列挙
    let child_edges = this.extendedEdges.filter(edge => edge.source === nodeId);

    for(let child_edge of child_edges){
      // 子ノードを削除
      this.deleteNode();
      // 子ノードとのリンクを削除
      this.extendedEdges = [...this.extendedEdges.filter(edge => edge.id !== child_edge.id)];
    }

    // 親ノードとのリンクを削除
    for(let parent_edge of parent_edges){
      // 子ノードとのリンクを削除
      this.extendedEdges = this.extendedEdges.filter(edge => edge.id !== parent_edge.id);
    }

    this.extendedEdges = [...this.extendedEdges];
    this.extendedNodes = [...this.extendedNodes];

  }

  public MoveSelectedNodeLeft(){
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
  }

  public MoveSelectedNodeRight(){
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

  public MoveSelectedNodeUP () {
    // 選択されたノードの親ノードと選択されたノードorderを取得
    this.MoveNode('ArrowUp');
  }

  public ModeNodeDown() {
    this.MoveNode('ArrowDown');
  }


  private MoveNode(moveDirection: string) {
    let parent_node_id = '';
    let selectedNodeOrderNumber = 0;
    let parent_edge = this.extendedEdges.filter(edge => edge.target === this.selectedNodeId);
    if (parent_edge.length > 0) {
      parent_node_id = parent_edge[0].source;
      selectedNodeOrderNumber = parent_edge[0].order;
    }

    // 選択されたノードの同列のノードでorderが1つ大きいノードを取得
    let next_node_id = '';
    let next_edge = moveDirection === 'ArrowDown' ?
      this.extendedEdges.filter(edge => edge.source === parent_node_id && edge.order > selectedNodeOrderNumber) :
      this.extendedEdges.filter(edge => edge.source === parent_node_id && edge.order < selectedNodeOrderNumber);
    if (next_edge.length > 0) {
      // 最小のorderを取得
      let next_order = moveDirection === 'ArrowDown' ? Math.min(...next_edge.map(edge => edge.order)) :
        Math.max(...next_edge.map(edge => edge.order));
      let next_edge2 = this.extendedEdges.find(edge => edge.source === parent_node_id && edge.order === next_order);
      if (next_edge2) {
        let next_selected_node_id = next_edge2.target;
        this.selectedNodeId = next_selected_node_id;
        for (let i = 0; i < this.extendedNodes.length; i++) {
          if (this.extendedNodes[i].id === next_selected_node_id) {
            this.extendedNodes[i].isSelected = true;
            continue;
          }
          this.extendedNodes[i].isSelected = false;
          this.extendedEdges = [...this.extendedEdges];
        }
      }
    }
  }
}
