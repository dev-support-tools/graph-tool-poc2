import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { EdgeTypeToString } from '../map-view/edgeex';
import { NodeEx, NodeType, NodeTypeToString } from '../map-view/nodeex';

@Component({
  selector: 'app-node-edit-view',
  templateUrl: './node-edit-view.component.html',
  styleUrls: ['./node-edit-view.component.scss']
})
export class NodeEditViewComponent implements OnInit{

  public EdgeTypeToString = EdgeTypeToString;


  linkChildrenColumns: string[] = ['operation', 'id', 'order', 'label', 'kinds', 'nodeLabel'];
  linkParentColumns: string[] = ['operation', 'id', 'order', 'label', 'kinds', 'nodeLabel'];


  @ViewChild('textInput') textInput: ElementRef | undefined;


  public get NodeType(): NodeType{
    return this.dataService.getSelectedNode()?.nodeType ?? NodeType.Normal;
  }

  public set NodeType(value: number){
    const node = this.dataService.getSelectedNode();
    if(node != undefined){
      node.nodeType = value as NodeType;
    }
  }

  constructor(public readonly dataService: DataService) { 

  }
  ngOnInit(): void {
    this.dataService.NotificationObservable().subscribe((data) => {
      console.log('NodeEditViewComponent:NotificationObservable');
      console.log(this.textInput);
      this.textInput?.nativeElement.focus();
      this.textInput?.nativeElement.select();
    });
  }

  addImage(){
    this.dataService.Capture(this.dataService.SelectedNodeText);
  }

  removeImage(fileName: string){
    this.dataService.RemoveImage(fileName);
  }
}
