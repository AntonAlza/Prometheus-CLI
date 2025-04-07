import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePreciosComponent } from './detalle-precios.component';

describe('DetallePreciosComponent', () => {
  let component: DetallePreciosComponent;
  let fixture: ComponentFixture<DetallePreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePreciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
