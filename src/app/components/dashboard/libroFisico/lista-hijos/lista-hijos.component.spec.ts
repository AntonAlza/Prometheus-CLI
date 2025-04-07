import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaHijosComponent } from './lista-hijos.component';

describe('ListaHijosComponent', () => {
  let component: ListaHijosComponent;
  let fixture: ComponentFixture<ListaHijosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaHijosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaHijosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
