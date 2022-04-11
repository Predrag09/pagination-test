import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;
  let debugElement: DebugElement;
  let componentElement: HTMLElement;

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

    debugElement = fixture.debugElement;
    componentElement = debugElement.nativeElement;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init form and subscribe to value changes of totalPagesControl on init', () => {
    spyOn<any>(component, 'initializeForm');
    spyOn<any>(component, 'totalPagesControlValueChanges');

    component.ngOnInit();

    expect(component['initializeForm']).toHaveBeenCalled();
    expect(component['totalPagesControlValueChanges']).toHaveBeenCalled();
  });

  describe('selectPage', () => {
    it('should emit an event when page is selected', () => {
      spyOn(component.onSelectPage, 'emit');

      component.selectPage(testNumber);

      expect(component.onSelectPage.emit).toHaveBeenCalledWith(testNumber);
    });

    it('should set currentPage property when page is selected', () => {
      component.selectPage(testNumber);

      expect(component.currentPage).toEqual(testNumber);
    });
  });

  describe('submitForm', () => {
    it('should call selectPage and setValidatorsForCurrentPage methods when form is submitted', () => {
      spyOn(component, 'selectPage');
      spyOn<any>(component, 'setValidatorsForCurrentPage');

      component.submitForm();

      expect(component.selectPage).toHaveBeenCalled();
      expect(component['setValidatorsForCurrentPage']).toHaveBeenCalled();
    });

    it('should set totalPages property when form is submitted', () => {
      component.submitForm();

      expect(component.totalPages).toEqual(component.totalPagesControl.value);
    });
  })

  describe('onWindowResize', () => {
    it('should call calculateStartingAndLastPage and generatePageNumbers methods upon window resize', () => {
      spyOn<any>(component, 'calculateStartingAndLastPage');
      spyOn<any>(component, 'generatePageNumbers');

      component['onWindowResize']();

      expect(component['calculateStartingAndLastPage']).toHaveBeenCalled();
      expect(component['generatePageNumbers']).toHaveBeenCalled();
    });

    it('should set innerWidth property depending on window width upon window resize', () => {
      component['onWindowResize']();

      expect(component['innerWidth']).toEqual(window.innerWidth);
    });
  })

  describe('calculateStartingAndLastPage and generatePageNumbers', () => {
    it('should display pages for mobile', () => {
      component['calculateStartingAndLastPage'](
        component['maxMobilePages'],
        component['mobileChangeTriggerPage'],
      );
      component['generatePageNumbers']();

      expect(component['pageNumbers']).toEqual(
        [1, 2, 3, 4, 5, 6, 7]
      );
    });

    it('should display pages for larger screens', () => {
      component['calculateStartingAndLastPage'](
        component['maxDesktopPages'],
        component['desktopChangeTriggerPage'],
      );
      component['generatePageNumbers']();

      expect(component['pageNumbers']).toEqual(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      );
    });
  })

  describe('carret', () => {
    it('should carret for going to previous page be disabled initially', () => {
      const carret = componentElement.querySelector('.carret');

      expect(carret).toHaveClass('disabled');
    });

    it('should carret for going to next page be disabled if currentPage has same value as lastPage', () => {
      const carret = componentElement.querySelector('.carret:nth-child(2)');

      component.currentPage = 10;
      component.lastPage = 10;

      fixture.detectChanges();

      expect(carret).toHaveClass('disabled');
    });
  })
});
