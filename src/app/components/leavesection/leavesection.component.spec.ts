import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesectionComponent } from './leavesection.component';

describe('LeavesectionComponent', () => {
  let component: LeavesectionComponent;
  let fixture: ComponentFixture<LeavesectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesectionComponent]
    });
    fixture = TestBed.createComponent(LeavesectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
