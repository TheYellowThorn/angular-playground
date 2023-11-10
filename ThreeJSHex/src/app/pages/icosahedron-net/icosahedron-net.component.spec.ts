import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcosahedronNetComponent } from './icosahedron-net.component';

describe('IcosahedronNetComponent', () => {
  let component: IcosahedronNetComponent;
  let fixture: ComponentFixture<IcosahedronNetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IcosahedronNetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IcosahedronNetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
