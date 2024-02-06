import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeIconsComponent } from './type-icons.component';

describe('TypeIconsComponent', () => {
  let component: TypeIconsComponent;
  let fixture: ComponentFixture<TypeIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeIconsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
