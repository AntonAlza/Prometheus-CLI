import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionOperacionesComponent } from './gestion-operaciones.component';

describe('GestionOperacionesComponent', () => {
  let component: GestionOperacionesComponent;
  let fixture: ComponentFixture<GestionOperacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionOperacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
