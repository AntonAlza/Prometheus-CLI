import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoberturaPorFacturaComponent } from './cobertura-por-factura.component';

describe('CoberturaPorFacturaComponent', () => {
  let component: CoberturaPorFacturaComponent;
  let fixture: ComponentFixture<CoberturaPorFacturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoberturaPorFacturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoberturaPorFacturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
