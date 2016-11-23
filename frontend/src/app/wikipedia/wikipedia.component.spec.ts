/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { WikipediaComponent } from './wikipedia.component';

describe('WikipediaComponent', () => {
  let component: WikipediaComponent;
  let fixture: ComponentFixture<WikipediaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WikipediaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WikipediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
