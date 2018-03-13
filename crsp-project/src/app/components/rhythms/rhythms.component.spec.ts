import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RhythmsComponent } from './rhythms.component';

describe('RhythmsComponent', () => {
  let component: RhythmsComponent;
  let fixture: ComponentFixture<RhythmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RhythmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RhythmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
