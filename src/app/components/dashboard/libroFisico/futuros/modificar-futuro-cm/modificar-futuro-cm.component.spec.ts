import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarFuturoCMComponent } from './modificar-futuro-cm.component';

describe('ModificarFuturoCMComponent', () => {
  let component: ModificarFuturoCMComponent;
  let fixture: ComponentFixture<ModificarFuturoCMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarFuturoCMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarFuturoCMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
