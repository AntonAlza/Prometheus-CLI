import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFuturoComponent } from './crear-futuro.component';

describe('CrearFuturoComponent', () => {
  let component: CrearFuturoComponent;
  let fixture: ComponentFixture<CrearFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearFuturoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
