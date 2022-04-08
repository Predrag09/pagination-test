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
  @Input() list!: string[];

  @Output() onSelectPage = new EventEmitter<number>();

  readonly itemsPerPage = 2;

  ngOnInit(): void {
  }
}
