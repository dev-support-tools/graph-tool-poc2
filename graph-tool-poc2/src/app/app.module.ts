import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './map-view/map-view.component';
import { NodeEditViewComponent } from './node-edit-view/node-edit-view.component';
import { DataService } from './data.service';
import { ClustersViewComponent } from './clusters-view/clusters-view.component';
import { FileViewComponent } from './file-view/file-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    NodeEditViewComponent,
    ClustersViewComponent,
    FileViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxGraphModule,
    MatIconModule,
    FormsModule,
    HttpClientModule,
    MatTableModule,
    MatExpansionModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
