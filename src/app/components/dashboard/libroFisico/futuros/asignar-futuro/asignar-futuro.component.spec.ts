import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarFuturoComponent } from './asignar-futuro.component';

describe('AsignarFuturoComponent', () => {
  let component: AsignarFuturoComponent;
  let fixture: ComponentFixture<AsignarFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarFuturoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
