import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebugConsoleComponent } from './debug-console.component';

describe('DebugConsoleComponent', () => {
  let component: DebugConsoleComponent;
  let fixture: ComponentFixture<DebugConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebugConsoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
