import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrecioCommodityComponent } from './precio-commodity.component';

describe('PrecioCommodityComponent', () => {
  let component: PrecioCommodityComponent;
  let fixture: ComponentFixture<PrecioCommodityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrecioCommodityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrecioCommodityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
