import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./page/home/home.component";
import { InlineSVGModule } from "ng-inline-svg";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { StripeComponent } from "./shared/stripe/stripe.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainComponent } from './page/main/main.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, StripeComponent, MainComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    InlineSVGModule.forRoot(),
    FormsModule,
    NgbModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
