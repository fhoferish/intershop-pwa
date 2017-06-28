import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule, Http } from '@angular/http';

// Imports for loading & configuring the in-memory web api
//import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
//import { InMemoryDataService }  from './services/in-memory-data.service';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FamilyPageComponent } from './pages/family-page/family-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { RegistrationPageComponent } from './pages/registration-page/registration-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

import { AppRoutingModule }     from './app-routing.module';

// AoT requires an exported function for factories
export function createTranslateLoader(http: Http) {
    return new TranslateHttpLoader(http, '/assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    FamilyPageComponent,
    ErrorPageComponent,
    RegistrationPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    //InMemoryWebApiModule.forRoot(InMemoryDataService)
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [Http]
        }
    })
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
