import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PaginationModule } from './pagination/pagination.module';
import { ItemsComponent } from './items/items.component';
import { ShellComponent } from './shell/shell.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemsComponent,
    ShellComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    PaginationModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
