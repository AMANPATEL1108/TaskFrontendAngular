import { TestBed } from '@angular/core/testing';

import { TaskMenuService } from './task-menu.service';

describe('TaskMenuService', () => {
  let service: TaskMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
