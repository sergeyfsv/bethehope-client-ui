import { Component, AfterViewInit, ViewChild, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/service/user.service';
import { get } from 'lodash';
import { PaymentService } from 'src/app/core/service/payment.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  orgData = [];
  amount = 20; // Total amount
  customAmountVal;
  email: String;
  shorthand = this.route.snapshot.paramMap.get('shorthand');
  QRName: String = '';
  QrgName: String = '';
  QRDescription = '';
  QRPoster = '';
  customAmount: Boolean = false;

  constructor(
    private UserService: UserService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) { }

  async ngOnInit(): Promise<any> {
    try {
      this.spinner.show();
      const qrResp = await this.UserService.getQRCodeByShorthand(
        this.shorthand.toLowerCase()
      ).toPromise();
      const qr = get(qrResp, 'qr');
      this.QRName = get(qr, 'name');
      this.QrgName = get(qr, 'organization.name');
      this.QRDescription = get(qr, 'description');
      this.QRPoster = get(qr, 'poster');
      this.spinner.hide();
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
    this.customAmountVal = 50;
    this.amount = 50;
    console.log(this.amount);
  }

  openDescription() {
    return swal.fire({
      padding: '45px 10px 30px 10px',
      title: this.QRName,
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
