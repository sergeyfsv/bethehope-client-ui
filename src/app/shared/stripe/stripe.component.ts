import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  NgZone,
  Input,
  SimpleChanges
} from "@angular/core";
import { PaymentService } from "src/app/core/service/payment.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import swal from "sweetalert2";

@Component({
  selector: "app-stripe",
  templateUrl: "./stripe.component.html",
  styleUrls: ["./stripe.component.css"]
})
export class StripeComponent implements AfterViewInit, OnInit {
  @Input() amount: number;
  email: String;
  label: string = "Test Transaction"; // Label for product/purchase
  card;
  cardErrors;

  elements: any;
  paymentRequest: any;
  prButton: any;
  showPaymentRequest: boolean = false;
  shorthand: String;
  everythingLoaded: boolean = false;
  showCreditCardBoxBool: boolean = false;
  showAppleIcon: boolean = false;

  constructor(
    private pmt: PaymentService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  // Element used to mount the button
  @ViewChild("payElement", { static: true })
  payElement;
  @ViewChild("cardElement", { static: true })
  cardElement;

  ngOnInit(): void {
    this.shorthand = this.route.snapshot.paramMap.get("shorthand");
  }

  ngAfterViewInit(): void {
    var elements = this.pmt.stripe.elements({
      fonts: [
        {
          cssSrc: "https://rsms.me/inter/inter-ui.css"
        }
      ]
      // Stripe's examples are localized to specific languages, but if
      // you wish to have Elements automatically detect your user's locale,
      // use `locale: 'auto'` instead.
    });

    /**
     * Card Element
     */
    this.card = elements.create("card", {
      style: {
        base: {
          color: "#32325D",
          fontWeight: 500,
          fontFamily: "Inter UI, Open Sans, Segoe UI, sans-serif",
          fontSize: "16px",
          fontSmoothing: "antialiased",

          "::placeholder": {
            color: "#CFD7DF"
          }
        },
        invalid: {
          color: "#E25950"
        }
      }
    });

    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener("change", ({ error }) => {
      this.cardErrors = error && error.message;
    });

    /**
     * Payment Request Element
     */
    this.paymentRequest = this.pmt.stripe.paymentRequest({
      country: "CA",
      currency: "cad",
      total: {
        amount: 2000,
        label: "Donation"
      },
      requestPayerName: true,
      requestPayerEmail: true
    });

    // var paymentRequestElement = elements.create("paymentRequestButton", {
    //   paymentRequest: this.paymentRequest,
    //   style: {
    //     paymentRequestButton: {
    //       type: "donate",
    //       theme: "light",
    //       height: "40px"
    //     }
    //   }
    // });

    this.paymentRequest.canMakePayment().then(result => {
      this.ngZone.run(() => {
        if (result) {
          console.log("yes", result);
          if (result.applePay) {
            this.showAppleIcon = true;
          } else {
            this.showAppleIcon = false;
          }
          this.showPaymentRequest = true;
          // paymentRequestElement.mount(payElement.nativeElement);
          this.everythingLoaded = true;
          this.showCreditCardBoxBool = false;
        } else {
          this.showPaymentRequest = false;
          this.showCreditCardBoxBool = true;
          console.log("console.log", this.showPaymentRequest);
          this.everythingLoaded = true;
        }
      });
    });

    this.paymentRequest.on("token", ev => {
      if (this.amount < 1) {
        return swal.fire({
          title: "Sorry!",
          icon: "warning",
          text: "Sorry, we do not accept donations under $1.00.",
          showCloseButton: true,
          showConfirmButton: false
        });
      }
      if (this.amount > 1000) {
        return swal.fire({
          title: "Sorry!",
          icon: "warning",
          text: "Sorry, we do not accept donations above $1000 yet.",
          showCloseButton: true,
          showConfirmButton: false
        });
      }
      this.ngZone.run(async () => {
        console.log(ev);
        try {
          await this.pmt.createCharge({
            shorthand: this.shorthand,
            amount: this.amount * 100, // convert dollars to cents
            sourceToken: ev.token.id,
            email: ev.payerEmail,
            paymentMode: this.showAppleIcon ? "apple-pay" : "google-pay"
          });
          this.cardErrors = "";

          // close payment box
          ev.complete("success");

          // show confirmation box
          swal.fire({
            title: "Donation Received!",
            icon: "success",
            text:
              "Thank you for your generous contribution. Donors like you are a reason for countless smiles across the planet!",
            showCloseButton: true,
            showConfirmButton: false
          });
        } catch (err) {
          console.log(err);
          // this.cardErrors = "Sorry, donation could not be processed.";
          ev.complete("fail");
          swal.fire({
            title: "Sorry, it glitched!",
            icon: "warning",
            text:
              err && err.message
                ? `Error: ${err.message}`
                : "Something went wrong, please try again.",
            showCloseButton: true,
            showConfirmButton: false
          });
        }
      });
    });
  }

  openPaymentBox() {
    this.paymentRequest.show();
  }

  async getSource() { 
    if (this.amount < 1) {
      return swal.fire({
        title: "Sorry!",
        icon: "warning",
        text: "Sorry, we do not accept donations under $1.00.",
        showCloseButton: true,
        showConfirmButton: false
      });
    }
    if (this.amount > 1000) {
      return swal.fire({
        title: "Sorry!",
        icon: "warning",
        text: "Sorry, we do not accept donations above $1000 yet.",
        showCloseButton: true,
        showConfirmButton: false
      });
    }

    this.spinner.show();

    if (!this.email) {
      this.cardErrors = "Email not provided.";
      this.spinner.hide();
      return;
    }

    if (!this.validateEmail(this.email)) {
      this.cardErrors = "Email provided isn't valid.";
      this.spinner.hide();
      return;
    }

    const { token, error } = await this.pmt.stripe.createToken(this.card);

    if (error) {
      // Inform the customer that there was an error.
      this.cardErrors = error.message;
    } else {
      try {
        await this.pmt.createCharge({
          shorthand: this.shorthand,
          amount: this.amount * 100, // convert dollars to cents
          sourceToken: token.id,
          email: this.email,
          paymentMode: "direct"
        });
        this.email = "";
        this.cardErrors = "";
        this.card.clear();
        // show confirmation box
        swal.fire({
          title: "Donation Received!",
          icon: "success",
          text:
            "Thank you for your generous contribution. Donors like you are a reason for countless smiles across the planet!",
          showCloseButton: true,
          showConfirmButton: false
        });
      } catch (err) {
        this.cardErrors = "Sorry, donation could not be processed.";
        console.log(err);
        // this.cardErrors = "Sorry, donation could not be processed.";
        swal.fire({
          title: "Sorry, it glitched!",
          icon: "warning",
          text:
            err && err.message
              ? `Error: ${err.message}`
              : "Something went wrong, please try again.",
          showCloseButton: true,
          showConfirmButton: false
        });
      }
    }
    this.spinner.hide();
  }

  toggleCreditCardBox() {
    this.showCreditCardBoxBool = !this.showCreditCardBoxBool;
  }

  validateEmail = function(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes) {
      if (this.paymentRequest){
        this.paymentRequest.update({
          total: {
            amount: parseInt(changes.amount.currentValue) * 100, // convert dollars to cents,
            label: "Donation"
          }
        });
      }
    }
  }
}
