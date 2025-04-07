import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteContabilidadIfdComponent } from './reporte-contabilidad-ifd.component';

describe('ReporteContabilidadIfdComponent', () => {
  let component: ReporteContabilidadIfdComponent;
  let fixture: ComponentFixture<ReporteContabilidadIfdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteContabilidadIfdComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteContabilidadIfdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
