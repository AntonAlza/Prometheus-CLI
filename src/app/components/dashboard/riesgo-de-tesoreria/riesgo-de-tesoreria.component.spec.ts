import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiesgoDeTesoreriaComponent } from './riesgo-de-tesoreria.component';

describe('RiesgoDeTesoreriaComponent', () => {
  let component: RiesgoDeTesoreriaComponent;
  let fixture: ComponentFixture<RiesgoDeTesoreriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiesgoDeTesoreriaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiesgoDeTesoreriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
