import { Component } from '@angular/core';

import { items } from './constants/items';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'pagination-test';
  readonly items = items;
}
