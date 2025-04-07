import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsociarFacturasRTDComponent } from './asociar-facturas-rtd.component';

describe('AsociarFacturasRTDComponent', () => {
  let component: AsociarFacturasRTDComponent;
  let fixture: ComponentFixture<AsociarFacturasRTDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsociarFacturasRTDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsociarFacturasRTDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
