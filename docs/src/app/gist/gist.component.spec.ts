import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GistComponent } from './gist.component';

describe('GistComponent', () => {
  let component: GistComponent;
  let fixture: ComponentFixture<GistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
