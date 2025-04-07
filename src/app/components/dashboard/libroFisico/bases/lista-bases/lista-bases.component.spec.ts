import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaBasesComponent } from './lista-bases.component';

describe('ListaBasesComponent', () => {
  let component: ListaBasesComponent;
  let fixture: ComponentFixture<ListaBasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaBasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaBasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
