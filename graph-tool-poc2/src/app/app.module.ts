import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapViewComponent } from './map-view/map-view.component';
import { NodeEditViewComponent } from './node-edit-view/node-edit-view.component';
import { DataService } from './data.service';
import { ClustersViewComponent } from './clusters-view/clusters-view.component';

@NgModule({
  declarations: [
    AppComponent,
    MapViewComponent,
    NodeEditViewComponent,
    ClustersViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgxGraphModule,
    MatIconModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
