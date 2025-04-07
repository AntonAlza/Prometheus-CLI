import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MantenedorSubsidiariaComponent } from './mantenedor-subsidiaria.component';

describe('MantenedorSubsidiariaComponent', () => {
  let component: MantenedorSubsidiariaComponent;
  let fixture: ComponentFixture<MantenedorSubsidiariaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MantenedorSubsidiariaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MantenedorSubsidiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
