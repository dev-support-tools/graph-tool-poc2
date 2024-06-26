import { Injectable } from '@angular/core';
import { NodeEx, NodeType } from './map-view/nodeex';
import { EdgeEx, EdgeType } from './map-view/edgeex';
import { ClusterNode, Edge } from '@swimlane/ngx-graph';
import { Observable, Subject, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  private windowWidth = 0;
  private windowHeight = 0;
  
  public SetWindowSize(width: number, height: number) {
    console.log(width);
    this.windowWidth = width;
    this.windowHeight = height;
  }

  public get contentHeight(): number {
    return this.windowHeight;
  }
  
  public get contentWidth(): number {
    return this.windowWidth;
  }

  private selectedFile = 'data.json';
  public get SelectedFile(): string {
    return this.selectedFile;
  }

  public SelectFile(fileName: string) {
    this.selectedFile = fileName;
  }

  private extendedNodes: NodeEx[] = [
    {
      id: '1',
      label: 'Node 1',
      isSelected: false,
      isChildrenHidden: false,
      images: [],
      nodeType: NodeType.Normal,
    }
  ];
  
  private setShowChildNodes(node: NodeEx, nodes: NodeEx[]): void {
    // ノード追加
    nodes.push(node);
    if(node.isChildrenHidden === false){
      let edges = this.extendedEdges.filter(edge => edge.source === node.id);
      for (let edge of edges) {
        if(edge.linkType === 0){
          edge.stroke = 'black';
          edge.strokeWidth = 4;
          edge.strokeDasharray = '';
        }else if(edge.linkType === 1){
          edge.stroke = 'red';
          edge.strokeWidth = 2;
          edge.strokeDasharray = '3,3';
        }
        let childNode = this.extendedNodes.find(node => node.id === edge.target);
        this.visibleEdges.push(edge);
        if (childNode) {
          this.setShowChildNodes(childNode, nodes);  
        }
      }
    }
  }
  
  private visibleNodes: NodeEx[] = [];
  private refreshVisibleNodes() {
    this.visibleEdges = [];
    this.visibleNodes = [];
    this.setShowChildNodes(this.extendedNodes[0], this.visibleNodes);
  }
  public get nodes(): NodeEx[] {
    return this.visibleNodes;
  }

  private extendedEdges: EdgeEx[] = [];
  private visibleEdges: EdgeEx[] = [];
  public get links(): Edge[] {
    return this.visibleEdges;
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
      linkType: EdgeType.Sub,
    };
    this.extendedEdges = [...this.extendedEdges, new_link];
    this.refreshVisibleNodes();
  }

  // ノードを非表示
  public HiddenChildren() {
    let selectNode = this.extendedNodes.find(node => node.id === this.selectedNodeId);
    if(selectNode){
      selectNode.isChildrenHidden = true;
    }
    this.refreshVisibleNodes()
  }

  // ノードを表示
  public ShowChildren() {
    let selectNode = this.extendedNodes.find(node => node.id === this.selectedNodeId);
    if(selectNode){
      selectNode.isChildrenHidden = false;
    }
    this.refreshVisibleNodes();
  }

  public get ChildrenLink(): EdgeEx[] {
    return this.extendedEdges.filter(edge => edge.source === this.selectedNodeId);
  }

  public deleteChildLink(childNodeId: EdgeEx) {
    this.extendedEdges = this.extendedEdges.filter(edge => edge.id !== childNodeId.id);
    this.extendedEdges = [...this.extendedEdges];
    this.refreshVisibleNodes();
  }

  public get ParentsLink(): EdgeEx[] {
    return this.extendedEdges.filter(edge => edge.target === this.selectedNodeId);
  }

  public getNode(nodeId: string): NodeEx | undefined {
    let selectedNode = this.extendedNodes.find(node => node.id === nodeId);
    if (!selectedNode) {
      return undefined;
    }
    if (selectedNode.label === undefined) {
      return undefined;
    }
    return selectedNode;
  }

  public getSelectedNode(): NodeEx | undefined {
    let selectedNode = this.extendedNodes.find(node => node.id === this.SelectedNodeId);
    if (!selectedNode) {
      return undefined;
    }
    if (selectedNode.label === undefined) {
      return undefined;
    }
    return selectedNode;
  }

  public changeSelectedNode(): Observable<string> {
    return this.notificationSubject.asObservable();
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
    this.refreshVisibleNodes();
  }

  private notificationSubject = new Subject<string>();

  constructor(private httpClient: HttpClient) { }

  public addFile() {
    this.httpClient.post('./api/file/add', {}).subscribe((data) => {
    });
  }

  public loadFileList(): Observable<string[]> {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
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
    });
  }

  public Capture(path: string) {
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
    const rootPath = this.selectedFile.replace('.json', '')
    const requestBody = {
      path: rootPath,
    };
    this.httpClient.post('./api/opretion/capture', requestBody, httpOptions).subscribe((data: any) => {
      const fileName = data.filename as string;
      const url = `api/images/${rootPath}/${fileName}`
      const node = this.extendedNodes.find(node => node.id === this.selectedNodeId);
      if (node) {
        if (node.images === undefined) {
          node.images = [];
        }
        node.images.push({
          filename: fileName,
          name: '',
          text: '',
          url: url,
        });
      }
    });
  }

  public addImage() {
    const node = this.extendedNodes.find(node => node.id === this.selectedNodeId);
    if (node) {
      if (node.images === undefined) {
        node.images = [];
      }
      node.images.push({
        filename: '',
        name: '',
        text: '',
        url: '',
      });
    }

  }

  public RemoveImage(fileName: string) {
    const rootPath = this.selectedFile.replace('.json', '')
    const requestBody = {
      path: rootPath,
      fileName: fileName,
    };

    this.httpClient.post('./api/operation/removeimage', requestBody).subscribe(() => {
      const node = this.extendedNodes.find(node => node.id === this.selectedNodeId);
      if (node) {
        node.images = node.images.filter(image => image.filename !== fileName);
      }
    });
  }

  public Load() : Observable<void> {
    const requestBody = {
      fileName: this.selectedFile
    };
    let result = this.httpClient.post('./api/data/load', requestBody).subscribe((data: any) => {
      if (data === null || data === undefined || data.nodes === undefined) {
        this.extendedNodes = [];
        this.extendedNodes.push({
          id: '1',
          label: 'Node 1',
          isSelected: false,
          isChildrenHidden: false,
          images: [],
          nodeType: NodeType.Normal,
        });
        this.extendedNodes = [...this.extendedNodes];
        this.extendedEdges = [];
        this.clusters = [];
        this.selectedNodeId = '';
        this.refreshVisibleNodes();
        return;
      }

      this.extendedNodes = data.nodes;
      this.extendedEdges = data.edges;
      this.clusters = data.clusters;

      this.selectedNodeId = data.selectedNodeId;
      this.extendedNodes = [...this.extendedNodes];
      this.refreshVisibleNodes();
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
    this.isInputState = true;
    this.notificationSubject.next('Edit');
  }

  public NotificationObservable(): Observable<string> {
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
    this.refreshVisibleNodes();
    this.notificationSubject.next('Select');
  }

  public addNode() {
    const nodeId = this.selectedNodeId;
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
    }
    
    let selected_node_id = nodeId.toString();
    let new_node_id = this.extendedNodes.length + 1;
    let new_node: NodeEx = {
      id: new_node_id.toString(),
      label: `New Node ${new_node_id.toString()}`,
      isSelected: true,
      isChildrenHidden: false,
      images: [],
      nodeType: NodeType.Normal,
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
      label: '',
      order: edgeOrder,
      linkType: EdgeType.Normal,
    };
    this.extendedEdges = [...this.extendedEdges, new_link];
    this.extendedNodes = [...this.extendedNodes];
    this.selectedNodeId = new_node_id.toString();
    this.refreshVisibleNodes();
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
    this.refreshVisibleNodes();

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
        this.refreshVisibleNodes();
        return;
      }
    }
  }

  public MoveSelectedNodeRight(){

    // 選択されたノードの子リンクを取得し、order順で並べ、最初のノードを選択
    let child_edges = this.extendedEdges.filter(edge => edge.source === this.selectedNodeId);
    if (child_edges.length === 0) {
      return;
    }
    let child_edges_sorted = child_edges.sort((a, b) => a.order - b.order);
    this.selectedNodeId = child_edges_sorted[0].target;
    for(let i = 0; i < this.extendedNodes.length; i++){
      this.extendedNodes[i].isSelected = false;
    }
    for(let i = 0; i < this.extendedNodes.length; i++){
      if (this.extendedNodes[i].id == this.selectedNodeId){
        this.extendedNodes[i].isSelected = true;
      }
    }
    this.extendedNodes = [...this.extendedNodes];
    this.refreshVisibleNodes();
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
    this.refreshVisibleNodes();
  }
}
