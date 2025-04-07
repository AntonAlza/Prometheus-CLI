import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleFretComponent } from './detalle-fret.component';

describe('DetalleFretComponent', () => {
  let component: DetalleFretComponent;
  let fixture: ComponentFixture<DetalleFretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleFretComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleFretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
