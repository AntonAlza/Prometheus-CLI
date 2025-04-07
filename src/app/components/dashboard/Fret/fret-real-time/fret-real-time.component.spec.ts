import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FretRealTimeComponent } from './fret-real-time.component';

describe('FretRealTimeComponent', () => {
  let component: FretRealTimeComponent;
  let fixture: ComponentFixture<FretRealTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FretRealTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FretRealTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
