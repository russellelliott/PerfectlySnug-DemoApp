
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Import the plugins to use in the app.
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { WifiWizard2 } from '@ionic-native/wifi-wizard-2/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

//Providers need to be defined to use the plugins in your app.
//For instance, when importing QRScanner, QRScanner must also be included in the providers list to use in the app.
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    QRScanner,
    WifiWizard2,
    InAppBrowser
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}