import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustersViewComponent } from './clusters-view.component';

describe('ClustersViewComponent', () => {
  let component: ClustersViewComponent;
  let fixture: ComponentFixture<ClustersViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClustersViewComponent]
    });
    fixture = TestBed.createComponent(ClustersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
