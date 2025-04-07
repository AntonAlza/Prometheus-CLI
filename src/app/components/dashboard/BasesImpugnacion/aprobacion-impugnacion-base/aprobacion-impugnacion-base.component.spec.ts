import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobacionImpugnacionBaseComponent } from './aprobacion-impugnacion-base.component';

describe('AprobacionImpugnacionBaseComponent', () => {
  let component: AprobacionImpugnacionBaseComponent;
  let fixture: ComponentFixture<AprobacionImpugnacionBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprobacionImpugnacionBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobacionImpugnacionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
