import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-node-edit-view',
  templateUrl: './node-edit-view.component.html',
  styleUrls: ['./node-edit-view.component.scss']
})
export class NodeEditViewComponent implements OnInit{

  @ViewChild('textInput') textInput: ElementRef | undefined;

  constructor(public readonly dataService: DataService) { 

  }
  ngOnInit(): void {
    this.dataService.NotificationObservable.subscribe((data) => {
      console.log('NodeEditViewComponent:NotificationObservable');
      console.log(this.textInput);
      this.textInput?.nativeElement.focus();
    });
  }


}
