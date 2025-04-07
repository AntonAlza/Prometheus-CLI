import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionDataEntryComponent } from './configuracion-data-entry.component';

describe('ConfiguracionDataEntryComponent', () => {
  let component: ConfiguracionDataEntryComponent;
  let fixture: ComponentFixture<ConfiguracionDataEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfiguracionDataEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguracionDataEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
