import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoFacturasComponent } from './pago-facturas.component';

describe('PagoFacturasComponent', () => {
  let component: PagoFacturasComponent;
  let fixture: ComponentFixture<PagoFacturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoFacturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoFacturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
