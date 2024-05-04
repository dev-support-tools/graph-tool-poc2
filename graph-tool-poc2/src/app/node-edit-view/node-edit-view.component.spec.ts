import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeEditViewComponent } from './node-edit-view.component';

describe('NodeEditViewComponent', () => {
  let component: NodeEditViewComponent;
  let fixture: ComponentFixture<NodeEditViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeEditViewComponent]
    });
    fixture = TestBed.createComponent(NodeEditViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
