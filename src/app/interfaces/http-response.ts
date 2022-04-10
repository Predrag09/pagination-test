export interface HttpResponse<T> {
    totalPages: number,
    totalPassengers: number;
    data: T[];
}
