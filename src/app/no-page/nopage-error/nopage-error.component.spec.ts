import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NopageErrorComponent } from './nopage-error.component';

describe('NopageErrorComponent', () => {
  let component: NopageErrorComponent;
  let fixture: ComponentFixture<NopageErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NopageErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NopageErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
