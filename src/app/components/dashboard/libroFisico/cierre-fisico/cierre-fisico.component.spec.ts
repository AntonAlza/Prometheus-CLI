import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreFisicoComponent } from './cierre-fisico.component';

describe('CierreFisicoComponent', () => {
  let component: CierreFisicoComponent;
  let fixture: ComponentFixture<CierreFisicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CierreFisicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CierreFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
