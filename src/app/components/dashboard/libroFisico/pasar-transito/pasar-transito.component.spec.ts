import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasarTransitoComponent } from './pasar-transito.component';

describe('PasarTransitoComponent', () => {
  let component: PasarTransitoComponent;
  let fixture: ComponentFixture<PasarTransitoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasarTransitoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PasarTransitoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
