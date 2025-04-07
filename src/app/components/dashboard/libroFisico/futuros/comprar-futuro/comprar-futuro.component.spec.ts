import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprarFuturoComponent } from './comprar-futuro.component';

describe('ComprarFuturoComponent', () => {
  let component: ComprarFuturoComponent;
  let fixture: ComponentFixture<ComprarFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComprarFuturoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComprarFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
