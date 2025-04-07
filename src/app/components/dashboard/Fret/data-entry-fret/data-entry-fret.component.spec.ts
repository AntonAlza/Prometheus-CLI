import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryFretComponent } from './data-entry-fret.component';

describe('DataEntryFretComponent', () => {
  let component: DataEntryFretComponent;
  let fixture: ComponentFixture<DataEntryFretComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataEntryFretComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryFretComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
