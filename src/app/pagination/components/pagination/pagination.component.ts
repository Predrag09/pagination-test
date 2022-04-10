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

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit, OnChanges {
  @Input() items!: any[] | null;
  @Input() totalPages!: number;

  @Output() onSelectPage = new EventEmitter<number>();

  pageNumbers: number[] = [];
  currentPage = 1;
  lastPage!: number;

  private startingPage!: number;
  private innerWidth!: number;

  private readonly maxDesktopPageSize = 10;
  private readonly maxMobilePageSize = 7;

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items && this.items) {
      this.onWindowResize();
      this.generatePageNumbers();
    }
  }

  selectPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.onSelectPage.emit(pageNumber);
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 568) {
      this.calculateStartingAndLastPage(this.maxMobilePageSize, 4);
      this.generatePageNumbers();
    } else {
      this.calculateStartingAndLastPage(this.maxDesktopPageSize, 5);
      this.generatePageNumbers();
    }
  }

  private calculateStartingAndLastPage(maxPageSize: number, changeTriggerPage: number): void {
    if (this.currentPage > changeTriggerPage && this.currentPage < this.totalPages - 4) {
      this.startingPage = this.currentPage - changeTriggerPage + 1;
      this.lastPage = this.currentPage + maxPageSize - changeTriggerPage;

      return;
    }

    if (this.currentPage >= this.totalPages - changeTriggerPage + 1) {
      this.startingPage = this.totalPages - maxPageSize + 1;
      this.lastPage = this.startingPage + maxPageSize - 1;

      return;
    }

    this.startingPage = 1;
    this.lastPage = this.startingPage + maxPageSize - 1;
  }

  private generatePageNumbers(): void {
    this.pageNumbers = [];

    for (let i = this.startingPage; i <= this.lastPage; i++) {
      this.pageNumbers.push(i);
    }
  }
}
