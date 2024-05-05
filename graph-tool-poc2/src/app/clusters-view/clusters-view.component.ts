import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-clusters-view',
  templateUrl: './clusters-view.component.html',
  styleUrls: ['./clusters-view.component.scss']
})
export class ClustersViewComponent implements OnInit{

  

  constructor(public readonly dataService: DataService) { }

  ngOnInit(): void {

  }

  public addCluster() {
    this.dataService.AddCluster();
  }

  public onClickCluster(clusterId: string) {
    this.dataService.SelectCluster(clusterId)
  }
}
