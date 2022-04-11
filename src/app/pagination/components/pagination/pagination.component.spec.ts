import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  const testNumber = 5;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [PaginationComponent],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit an event when page is selected', () => {
    spyOn(component.onSelectPage, 'emit');

    component.selectPage(testNumber);

    expect(component.onSelectPage.emit).toHaveBeenCalledWith(testNumber);
  });

  it('should call selectPage when form is submitted', () => {
    spyOn(component, 'selectPage');

    component.submitForm();

    expect(component.selectPage).toHaveBeenCalled();
  });
});
