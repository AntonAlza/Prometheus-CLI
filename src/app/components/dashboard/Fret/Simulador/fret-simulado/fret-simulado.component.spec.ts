import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FretSimuladoComponent } from './fret-simulado.component';

describe('FretSimuladoComponent', () => {
  let component: FretSimuladoComponent;
  let fixture: ComponentFixture<FretSimuladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FretSimuladoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FretSimuladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
