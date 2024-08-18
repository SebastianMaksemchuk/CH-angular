import { TestBed, ComponentFixture } from '@angular/core/testing';
import { TitleDirective } from './title.directive';
import { Component } from '@angular/core';

@Component({
  template: `<div chaTitle>Test Element</div>`
})
class TestComponent {}

describe('TitleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TitleDirective, TestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();

    element = fixture.nativeElement.querySelector('div');
  });

  it('should set font size to 20px', () => {
    expect(element.style.fontSize).toBe('20px');
  });
});
