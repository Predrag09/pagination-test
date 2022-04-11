import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Item } from '../interfaces/item';
import { ItemsService } from '../services/items.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  items$!: Observable<Item[]>;
  totalPages!: number;

  private readonly initialStartingPage = 1;

  constructor(private itemsService: ItemsService) { }

  ngOnInit(): void {
    this.getItems(this.initialStartingPage);
  }

  getItems(pageNumber: number): void {
    this.items$ = this.itemsService.getItems(pageNumber).pipe(
      tap(response => {
        this.totalPages = response.totalPages;
      }),
      map(response => response.data),
    );
  }
}
