import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroOperacionesRTDComponent } from './registro-operaciones-rtd.component';

describe('RegistroOperacionesRTDComponent', () => {
  let component: RegistroOperacionesRTDComponent;
  let fixture: ComponentFixture<RegistroOperacionesRTDComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroOperacionesRTDComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroOperacionesRTDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
