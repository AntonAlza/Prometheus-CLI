import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValorizacionDerivadosComponent } from './valorizacion-derivados.component';

describe('ValorizacionDerivadosComponent', () => {
  let component: ValorizacionDerivadosComponent;
  let fixture: ComponentFixture<ValorizacionDerivadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValorizacionDerivadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValorizacionDerivadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
