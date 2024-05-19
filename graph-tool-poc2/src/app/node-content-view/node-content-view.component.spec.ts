import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeContentViewComponent } from './node-content-view.component';

describe('NodeContentViewComponent', () => {
  let component: NodeContentViewComponent;
  let fixture: ComponentFixture<NodeContentViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NodeContentViewComponent]
    });
    fixture = TestBed.createComponent(NodeContentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
