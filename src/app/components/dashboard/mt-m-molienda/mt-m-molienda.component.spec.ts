import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MtMMoliendaComponent } from './mt-m-molienda.component';

describe('MtMMoliendaComponent', () => {
  let component: MtMMoliendaComponent;
  let fixture: ComponentFixture<MtMMoliendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MtMMoliendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MtMMoliendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
