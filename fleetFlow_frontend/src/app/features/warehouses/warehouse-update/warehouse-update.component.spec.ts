import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehouseUpdateComponent } from './warehouse-update.component';

describe('WarehouseUpdateComponent', () => {
  let component: WarehouseUpdateComponent;
  let fixture: ComponentFixture<WarehouseUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehouseUpdateComponent]
    });
    fixture = TestBed.createComponent(WarehouseUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
