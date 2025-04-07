import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocesoMtmComponent } from './reproceso-mtm.component';

describe('ReprocesoMtmComponent', () => {
  let component: ReprocesoMtmComponent;
  let fixture: ComponentFixture<ReprocesoMtmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReprocesoMtmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReprocesoMtmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
