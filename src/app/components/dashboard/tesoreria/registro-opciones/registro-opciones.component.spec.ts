import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOpcionesComponent } from './registro-opciones.component';

describe('RegistroOpcionesComponent', () => {
  let component: RegistroOpcionesComponent;
  let fixture: ComponentFixture<RegistroOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroOpcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
