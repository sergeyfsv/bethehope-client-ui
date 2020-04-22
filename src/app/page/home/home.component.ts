import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/service/user.service';
import * as _ from 'lodash';
import { PaymentService } from 'src/app/core/service/payment.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  orgData = [];
  amount = 20; // Total amount
  email: String;
  shorthand = this.route.snapshot.paramMap.get('shorthand');
  QRName: String = '';
  QrgName: String = '';
  QRDescription = '';
  QRPoster = '';
  customAmount: Boolean = false;

  constructor(
    private UserService: UserService,
    private route: ActivatedRoute
  ) { }

  async ngOnInit(): Promise<any> {
    try {
      const qrResp = await this.UserService.getQRCodeByShorthand(
        this.shorthand.toLowerCase()
      ).toPromise();
      const qr = _.get(qrResp, 'qr');
      this.QRName = _.get(qr, 'name');
      this.QrgName = _.get(qr, 'organization.name');
      this.QRDescription = _.get(qr, 'description');
      this.QRPoster = _.get(qr, 'poster');
    } catch (error) { }
  }

  updateAmount(val, custom) {
    this.amount = val;
    this.customAmount = custom;
  }

  updateCustomAmount(event) {
    this.amount = event.target.value;
    this.customAmount = true;
  }

  updateToCustom() {
    this.customAmount = true;
  }

  openDescription() {
    return swal.fire({
      padding: '45px 10px 30px 10px',
      text: this.QRDescription,
      showCloseButton: true,
      showConfirmButton: false
    });
  }

  openPoster() {
    return swal.fire({
      imageUrl: this.QRPoster,
      imageWidth: 400,
      showCloseButton: true,
      showConfirmButton: false
    });
  }
}
