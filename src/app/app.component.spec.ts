import { TestBed } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { ItemsComponent } from './items/items.component';
import { PaginationComponent } from './pagination/components/pagination/pagination.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        PaginationComponent,
        ItemsComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'pagination-test'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('pagination-test');
  });
});
