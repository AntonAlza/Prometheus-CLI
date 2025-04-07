import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRevertirEstadiosComponent } from './lista-revertir-estadios.component';

describe('ListaRevertirEstadiosComponent', () => {
  let component: ListaRevertirEstadiosComponent;
  let fixture: ComponentFixture<ListaRevertirEstadiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaRevertirEstadiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRevertirEstadiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
