import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdaysectionComponent } from './birthdaysection.component';

describe('BirthdaysectionComponent', () => {
  let component: BirthdaysectionComponent;
  let fixture: ComponentFixture<BirthdaysectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BirthdaysectionComponent]
    });
    fixture = TestBed.createComponent(BirthdaysectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
