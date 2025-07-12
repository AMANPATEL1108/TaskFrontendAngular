import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditusersComponent } from './editusers.component';

describe('EditusersComponent', () => {
  let component: EditusersComponent;
  let fixture: ComponentFixture<EditusersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditusersComponent]
    });
    fixture = TestBed.createComponent(EditusersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
