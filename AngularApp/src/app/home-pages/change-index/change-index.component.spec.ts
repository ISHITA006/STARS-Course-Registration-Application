import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeIndexComponent } from './change-index.component';

describe('ChangeIndexComponent', () => {
  let component: ChangeIndexComponent;
  let fixture: ComponentFixture<ChangeIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
