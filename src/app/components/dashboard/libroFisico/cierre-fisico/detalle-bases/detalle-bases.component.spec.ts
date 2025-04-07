import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleBasesComponent } from './detalle-bases.component';

describe('DetalleBasesComponent', () => {
  let component: DetalleBasesComponent;
  let fixture: ComponentFixture<DetalleBasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleBasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleBasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
