import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor(private http: HttpClient) {}

  getQRCodeByShorthand(shorthand) {
    return this.http.get(`${environment.userApi}/qr/${shorthand}`);
  }
}
