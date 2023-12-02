import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IdValidatorService {
  private http = inject(HttpClient);
  private endpoint =
    'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp/products/verification';

  getVerification(id: string) {
    return this.http.get(`${this.endpoint}?id=${id}`);
  }
}
