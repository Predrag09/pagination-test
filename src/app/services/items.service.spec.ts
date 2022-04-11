import { HttpClientModule } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ItemsService } from './items.service';

describe('ItemsService', () => {
  let httpMock: HttpTestingController;
  let service: ItemsService;

  const results = { pageParam: 'page', pageValue: '1', sizeParam: 'size', sizeValue: '10' };
  const url = `https://api.instantwebtools.net/v1/passenger?${results.pageParam}=${results.pageValue}&${results.sizeParam}=${results.sizeValue}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, HttpClientTestingModule],
    });

    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ItemsService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch list of items', () => {
    service.getItems(+results.pageValue).subscribe();
    const request = httpMock.expectOne(url);

    expect(request.request.method).toBe('GET');
  });
});
