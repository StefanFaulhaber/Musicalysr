/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PopularitygraphComponent } from './popularitygraph.component';

describe('PopularitygraphComponent', () => {
  let component: PopularitygraphComponent;
  let fixture: ComponentFixture<PopularitygraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularitygraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularitygraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
