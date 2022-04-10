import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators'

import { HttpResponse } from '../interfaces/http-response';

@Injectable({
	providedIn: 'root'
})
export class ItemsService {
	private apiRoute = `https://api.instantwebtools.net/v1/passenger?page={{pageNumber}}&size=10`

	constructor(private http: HttpClient) { }

	getItems(pageNumber: number): Observable<HttpResponse<any>> {
		const url = this.apiRoute.replace('{{pageNumber}}', pageNumber.toString());

		return this.http.get<HttpResponse<any>>(url).pipe(
			shareReplay(),
		);
	}
}
