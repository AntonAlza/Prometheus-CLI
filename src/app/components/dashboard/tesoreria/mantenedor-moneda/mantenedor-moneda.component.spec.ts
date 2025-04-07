import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorMonedaComponent } from './mantenedor-moneda.component';

describe('MantenedorMonedaComponent', () => {
  let component: MantenedorMonedaComponent;
  let fixture: ComponentFixture<MantenedorMonedaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenedorMonedaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenedorMonedaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
