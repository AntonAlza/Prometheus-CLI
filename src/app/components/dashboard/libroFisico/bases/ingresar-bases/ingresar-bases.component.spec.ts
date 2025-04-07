import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IngresarBasesComponent } from './ingresar-bases.component';

describe('IngresarBasesComponent', () => {
  let component: IngresarBasesComponent;
  let fixture: ComponentFixture<IngresarBasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IngresarBasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarBasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
