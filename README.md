# BeTheHope Client UI

##### Home Page available at [https://bethehope.fund][https://bethehope.fund]
##### Client UI (Donation Page - Single Instance) deployed at [https://bethehope.fund/CAcares/covid][https://bethehope.fund/CAcares/covid] 
##### General format: `https://bethehope.fund/<org_shorthand>/<campaign_code>`
##### Short URL format: `http://bth.fund/<org_shorthand>/<campaign_code>`

##### Note: Automatic redirection added from `http://bth.fund` to `https://bethehope.fund`

---
## Screenshots
On phone (iPhone 8 with Apple Pay enabled):

<img src="https://i.imgur.com/LdAeA1u.png" width="40%"/>

On desktop (modified to provide a better user experience viewing this mobile-first site on desktop):

<img src="https://i.imgur.com/0XYs5iX.png"/>

---

## Running Locally

Make sure you have [Node.js](http://nodejs.org/) (atleast v12.13.0, npm v6.12.0) installed.

```sh
git clone git@github.com:bethehope/bethehope-client-ui.git
cd bethehope-client-ui
npm install
ng serve
```

## Environment Configuration
Inside the `src`, there's an `environment` folder with three different environment files. I only used the `environment.ts` and `environment.prod.ts` for the project. It contains the following keys:
```
stripePublishableKey
userApi
```
You can get the Stripe key (`stripePublishableKey`) after you create a project on Stripe, but since it's a public key, you can share it with the UI.
BeTheHope API (`userApi`) is deployed at [https://bethehope.herokuapp.com](https://bethehope.herokuapp.com)

## Deployment
This project is hosted on Firebase hosting. To deploy:
```
ng build --prod
firebase deploy
```

[https://bethehope.fund/CAcares/covid]: https://bethehope.fund/CAcares/covid "https://bethehope.fund/CAcares/covid"
[https://bethehope.fund]: https://bethehope.fund "https://bethehope.fund"
[https://bethehope.fund]: https://bethehope.fund "https://bethehope.fund"
