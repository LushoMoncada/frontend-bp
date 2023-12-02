import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IProduct, IProductDTO } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private endpoint =
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp';
  private headers = new HttpHeaders({
    authorId: '100',
  });

  getProducts() {
    return this.http.get<IProduct[]>(`${this.endpoint}/products`, {
      headers: this.headers,
    });
  }

  createProduct(params: IProductDTO) {
    return this.http.post<IProduct>(`${this.endpoint}/products`, params, {
      headers: this.headers,
    });
  }

  editProduct(params: IProductDTO) {
    return this.http.put<IProduct>(`${this.endpoint}/products`, params, {
      headers: this.headers,
    });
  }

  deleteProduct(id: string) {
    return this.http.delete(`${this.endpoint}/products?id=${id}`, {
      headers: this.headers,
    });
  }
}
