import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentDashboardComponent } from './document-dashboard.component';

describe('DocumentDashboardComponent', () => {
  let component: DocumentDashboardComponent;
  let fixture: ComponentFixture<DocumentDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentDashboardComponent]
    });
    fixture = TestBed.createComponent(DocumentDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
