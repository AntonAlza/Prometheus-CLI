import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarFuturoComponent } from './listar-futuro.component';

describe('ListarFuturoComponent', () => {
  let component: ListarFuturoComponent;
  let fixture: ComponentFixture<ListarFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarFuturoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
