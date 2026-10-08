import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseAddComponent } from './warehouse-add.component';

describe('WarehouseAddComponent', () => {
  let component: WarehouseAddComponent;
  let fixture: ComponentFixture<WarehouseAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseAddComponent]
    });
    fixture = TestBed.createComponent(WarehouseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
