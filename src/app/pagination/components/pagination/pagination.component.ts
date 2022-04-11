import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
  OnDestroy,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges, OnDestroy {
  @Input() items!: any[] | null;
  @Input() totalPages!: number;

  @Output() onSelectPage = new EventEmitter<number>();

  form!: FormGroup;

  pageNumbers: number[] = [];
  currentPage = 1;
  lastPage!: number;

  private startingPage!: number;
  private innerWidth!: number;

  private readonly initialStartingPage = 1;
  private readonly maxDesktopPages = 10;
  private readonly desktopChangeTriggerPage = 5;
  private readonly maxMobilePages = 7;
  private readonly mobileChangeTriggerPage = 4;
  private readonly breakpoint = 568;

  private destroy$ = new Subject<boolean>();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.initializeForm();
    this.totalPagesControlValueChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && this.items) {
      this.onWindowResize();
      this.generatePageNumbers();
    }

    if (changes.totalPages && this.totalPages && this.form) {
      this.setValidatorsForCurrentPage();
      this.setValidatorsAndValueForTotalPages();
    }
  }

  selectPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.onSelectPage.emit(pageNumber);
  }

  submitForm(): void {
    this.selectPage(this.currentPageControl.value);
    this.totalPages = this.totalPagesControl.value;

    this.setValidatorsForCurrentPage();
  }

  get currentPageControl(): AbstractControl {
    return this.form.controls.currentPage;
  }

  get totalPagesControl(): AbstractControl {
    return this.form.controls.totalPages;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  @HostListener('window:resize')
  private onWindowResize() {
    this.innerWidth = window.innerWidth;

    this.innerWidth < this.breakpoint
      ? this.calculateStartingAndLastPage(this.maxMobilePages, this.mobileChangeTriggerPage)
      : this.calculateStartingAndLastPage(this.maxDesktopPages, this.desktopChangeTriggerPage);

    this.generatePageNumbers();
  }

  private calculateStartingAndLastPage(maxPages: number, changeTriggerPage: number): void {
    if (this.totalPages < this.maxDesktopPages) {
      this.startingPage = 1;
      this.lastPage = this.totalPages;

      return;
    }

    if (this.currentPage > changeTriggerPage && this.currentPage < this.totalPages - changeTriggerPage + 1) {
      this.startingPage = this.currentPage - changeTriggerPage + 1;
      this.lastPage = this.currentPage + maxPages - changeTriggerPage;

      return;
    }

    if (this.currentPage >= this.totalPages - changeTriggerPage + 1) {
      this.startingPage = this.totalPages - maxPages + 1;
      this.lastPage = this.startingPage + maxPages - 1;

      return;
    }

    this.startingPage = this.initialStartingPage;
    this.lastPage = this.startingPage + maxPages - 1;
  }

  private generatePageNumbers(): void {
    this.pageNumbers = [];

    for (let i = this.startingPage; i <= this.lastPage; i++) {
      this.pageNumbers.push(i);
    }
  }

  private setValidatorsForCurrentPage(): void {
    this.currentPageControl.setValidators(
      [
        Validators.max(this.totalPagesControl.value),
        Validators.min(1),
        Validators.required
      ]);

    this.currentPageControl.updateValueAndValidity();
  }

  private setValidatorsAndValueForTotalPages(): void {
    this.totalPagesControl.setValidators(
      [
        Validators.max(this.totalPages),
        Validators.min(1),
        Validators.required
      ]
    );

    this.totalPagesControl.setValue(this.totalPages);
    this.totalPagesControl.updateValueAndValidity();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      currentPage: this.initialStartingPage,
      totalPages: null,
    });
  }

  private totalPagesControlValueChanges(): void {
    if (this.form) {
      this.totalPagesControl.valueChanges
        .pipe(
          takeUntil(this.destroy$),
          debounceTime(500),
          distinctUntilChanged(),
        ).subscribe(() => {
          this.setValidatorsForCurrentPage();
        });
    }
  }
}
