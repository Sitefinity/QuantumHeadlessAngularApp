# QuantumHeadlessAngularApp

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.5. It uses the [Sitefinity WebServices SDK](https://www.npmjs.com/package/sitefinity-webservices-sdk) and data from the Sitefinity hosted trial (Quantum project)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Steps of running the application

1. Create a hosted trial (Sitefinity sandbox): https://www.progress.com/sitefinity-cms/try-now/sandbox
2. Verify that your hosted trial is configured properly:
* Go to Administration -> Settings -> Advanced -> WebServices -> Routes -> Frontend -> Services -> default
* Set _Access Control Allow Origin (CORS):_ *
* Go to Authentication -> SecurityTokenService -> IdentityServer -> Clients -> sitefinity -> _Allowed cors origins_
* Add **http://localhost:4200** and **http://quantum-headless.sitefinity.site**

3. Download this repo.
4. Run the project: 
  `ng serve`
5. Enter the url of the Sitefinity sandbox and save.

## Test it online

1. Go to: <a href="http://quantum-headless.sitefinity.site" target="_blank"> http://quantum-headless.sitefinity.site </a>
2. Enter the url of the Sitefinity sandbox and save.
