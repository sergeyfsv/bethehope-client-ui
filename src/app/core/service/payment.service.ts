import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class PaymentService {
  stripe = Stripe(`${environment.stripePublishableKey}`);
  constructor(private http: HttpClient) {
    console.log(`${environment.stripePublishableKey}`);
  }

  createCharge(chargeObj) {
    return this.http
      .post(`${environment.userApi}/donate`, chargeObj)
      .toPromise();
  }
}
