import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VenderFuturoComponent } from './vender-futuro.component';

describe('VenderFuturoComponent', () => {
  let component: VenderFuturoComponent;
  let fixture: ComponentFixture<VenderFuturoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VenderFuturoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VenderFuturoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
