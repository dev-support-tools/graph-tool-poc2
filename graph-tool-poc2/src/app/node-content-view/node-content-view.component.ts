import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { NodeEx, Image } from '../map-view/nodeex';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-node-content-view',
  templateUrl: './node-content-view.component.html',
  styleUrls: ['./node-content-view.component.scss']
})
export class NodeContentViewComponent implements OnInit{

  public selectedNode: NodeEx | undefined;
  public images: Image[] = [];
  public selectedImageNo: number = 0;

  displayedColumns: string[] = ['filename', 'name', 'text', 'image'];

  constructor(public readonly dataService: DataService, public dialog: MatDialog) { 

  }
  ngOnInit(): void {
    this.selectedNode = this.dataService.getSelectedNode();

    this.dataService.changeSelectedNode().subscribe(() => {
      this.selectedNode = this.dataService.getSelectedNode();
      if (this.selectedNode){
        this.images = this.selectedNode.images;
        return;
      }
      this.images = [];
    });
  }
  
  public get SelectedNode(): NodeEx | undefined {

    return this.selectedNode;
  }

  public get selectedImageUrl(): string {
    if (this.images.length > 0) {
      return this.images[this.selectedImageNo].url;
    }
    return '';
  
  }

  public get selectedNodeImages(): Image[] {
    if (this.selectedNode) {
      return this.selectedNode.images;
    }
    return [];
  }

  public selectRoew(row: Image) {
    this.selectedImageNo = this.images.indexOf(row);
  }

  public clickedRows(row: Image) {}
  

  public onClickImage() {
    const dialogRef = this.dialog.open(ImageDialogComponent, {
      width: '80%',
      height: '80%',
      data: {image: this.images[this.selectedImageNo]}
    });
  }


}
