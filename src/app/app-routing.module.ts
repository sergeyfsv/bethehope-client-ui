import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./page/home/home.component";
import { MainComponent } from './page/main/main.component';

const routes: Routes = [
  {
    path: "",
    component: MainComponent
  },
  {
    path: ":company/:shorthand",
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
