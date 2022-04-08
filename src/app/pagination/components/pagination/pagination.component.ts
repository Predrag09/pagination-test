import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  @Input() items: string[] = [];

  @Output() onSelectPage = new EventEmitter<number>();

  currentPage = 1;
  readonly itemsPerPage = 2;
  readonly maxPageSize = 10;

  ngOnInit(): void {
  }

  selectPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.onSelectPage.emit(pageNumber);
  }
}
