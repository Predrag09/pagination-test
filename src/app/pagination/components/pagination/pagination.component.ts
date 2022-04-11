import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  HostListener,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() items!: any[] | null;
  @Input() totalPages!: number;

  @Output() onSelectPage = new EventEmitter<number>();

  form!: FormGroup;

  pageNumbers: number[] = [];
  currentPage = 1;
  lastPage!: number;

  private startingPage!: number;
  private innerWidth!: number;

  private readonly initalStartingPage = 1;
  private readonly maxDesktopPages = 10;
  private readonly maxMobilePages = 7;

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

    if (changes.totalPages && this.totalPages) {
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

  @HostListener('window:resize')
  private onWindowResize() {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 568) {
      this.calculateStartingAndLastPage(this.maxMobilePages, 4);
      this.generatePageNumbers();
    } else {
      this.calculateStartingAndLastPage(this.maxDesktopPages, 5);
      this.generatePageNumbers();
    }
  }

  private calculateStartingAndLastPage(maxPages: number, changeTriggerPage: number): void {
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

    this.startingPage = this.initalStartingPage;
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
        Validators.min(this.maxDesktopPages),
        Validators.required
      ]
    );
    this.totalPagesControl.setValue(this.totalPages);
    this.totalPagesControl.updateValueAndValidity();
  }

  private initializeForm(): void {
    this.form = this.formBuilder.group({
      currentPage: this.initalStartingPage,
      totalPages: null,
    });
  }

  private totalPagesControlValueChanges(): void {
    if (this.form) {
      this.totalPagesControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
        ).subscribe(() => {
          this.setValidatorsForCurrentPage();
        });
    }
  }
}
