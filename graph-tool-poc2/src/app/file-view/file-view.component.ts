import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-file-view',
  templateUrl: './file-view.component.html',
  styleUrls: ['./file-view.component.scss']
})
export class FileViewComponent implements OnInit{

  public fileList: string[] = [];

  constructor(readonly dataService: DataService) { 

  }

  ngOnInit(): void {
    console.log('FileViewComponent');
    this.dataService.loadFileList().subscribe((data) => {
      this.fileList = data;
      console.log(data);
    });
  }

  onFileClick(fileName: string) {
    console.log(fileName);
    this.dataService.SelectFile(fileName);
    this.dataService.Load().subscribe();
  }

  onClickAdd() {
    this.dataService.addFile();
  }


}
