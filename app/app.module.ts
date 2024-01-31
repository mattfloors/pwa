import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';


import { TabNavigationComponent } from './shared/tab-navigation/tab-navigation.component';
import { TabNavigationItemComponent } from './shared/tab-navigation/tab-navigation-item/tab-navigation-item.component';
import { ThemeChangeComponent } from './shared/theme-change/theme-change.component';
import { LanguageChangeComponent } from './shared/language-change/language-change.component';

import { NotFoundComponent } from './views/not-found/not-found.component';
import { MeteoComponent } from './views/meteo/meteo.component';
import { MessagesComponent } from './views/messages/messages/messages.component';
import { MessageContainerComponent } from './views/messages/message-container.component';
import { ServicesComponent } from './views/services/services.component';
import { HomepageComponent } from './views/homepage/homepage.component';
import { ExpiredComponent } from './views/expired/expired.component';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './shared/login/login.component';
import { ReservationComponent } from './shared/reservation/reservation.component';
import { ServiceComponent } from './views/services/service/service.component';
import { TabNavigationContentComponent } from './shared/tab-navigation/tab-navigation-content/tab-navigation-content.component';
import { OrderComponent } from './views/orders/order/order.component';

import { OrderItemComponent, OrderMenuComponent } from './views/orders/order-items/order-items.component';
import { LoggedInComponent } from './templates/loggedin/loggedin.component';
import { ParseMessagePipe } from './pipes/messages.pipe';
import { MessageComponent } from './views/messages/message/message.component';
import { UiService } from './services/ui.service';
import { SanitizerPipe } from './pipes/sanitizers.pipe';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';
import { AuthorizationInterceptor } from './interceptors/authorization.interceptor';
import { PageActionsComponent } from './shared/page-actions/page-actions.component';
import { OrdersComponent } from './views/orders/orders.component';
import { QRCodeComponent } from './shared/qr-code-reader/qr-code-reader.component';

import { SurveyComponent } from './views/survey/survey.component';
import { SurveyItemComponent } from './views/survey/survey-item/survey-item.component';
import { OrderCartComponent } from './views/orders/order-cart/order-cart.component';
import { OrderNoteComponent } from './views/orders/order-note/order-note.component';
import { GroupByPipe } from './pipes/groupBy.pipe';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { OrderInfosComponent } from './views/orders/order-infos/order-infos.component';
import { OrderPositionListComponent } from './views/orders/order-position-list/order-position-list.component';
import { FlexModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { Effects, Reducers } from './store';
import { PostInterceptor } from './interceptors/post.interceptor';

import { provideFirebaseApp, getApp, initializeApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { config } from './../config'; // firebaseConf
import { MessagingService } from './services/push.service';
import { LandingComponent } from './views/landing/landing.component';
import { CurrencyPipe } from './pipes/currency.pipe';
import { DialogComponent } from './shared/dialog/dialog.component';
import { LoginPageComponent } from './views/login/login.component';
import { ExpansionDirective } from './directives/expansion.directive';
import { ExternalAppComponent } from './views/externalapp/externalapp.component';
import { OrderCategoriesComponent } from './views/orders/order-categories/order-categories.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { ErrorComponent } from './views/error/error.component';
import { OrderDetailComponent } from './views/orders/order-details/order-details.component';
import { QuarModule } from '@altack/quar';
import { ConfigService } from './services/config.service';
registerLocaleData(localeIt);
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export const configFactory = (configService: ConfigService) => {
  return () => configService.loadConfig();
};

@NgModule({
  declarations: [
    AppComponent,
    TabNavigationComponent,
    TabNavigationItemComponent,
    TabNavigationContentComponent,
    NotFoundComponent,
    HomepageComponent,
    LandingComponent,
    ExpiredComponent,
    ErrorComponent,
    LoggedInComponent,
    MeteoComponent,
    MessagesComponent,
    ParseMessagePipe,
    GroupByPipe,
    SanitizerPipe,
    CurrencyPipe,
    MessageComponent,
    MessageContainerComponent,
    PageActionsComponent,
    ServicesComponent,
    ServiceComponent,
    LoginComponent,
    LoginPageComponent,
    DialogComponent,
    ReservationComponent,
    QRCodeComponent,
    OrdersComponent,
    OrderComponent,
    OrderCartComponent,
    OrderNoteComponent,
    OrderInfosComponent,
    OrderDetailComponent,
    OrderItemComponent,
    OrderMenuComponent,
    OrderPositionListComponent,
    OrderCategoriesComponent,
    ThemeChangeComponent,
    LanguageChangeComponent,
    ExternalAppComponent,
    SurveyComponent,
    SurveyItemComponent,

    ExpansionDirective,
    AutofocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule,
    MatChipsModule,
    FlexModule,
    // NgxScannerQrcodeModule,
    QuarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatListModule,
    MatBadgeModule,
    MatTableModule,
    MatCardModule,
    MatDividerModule,
    MatMenuModule,
    MatSnackBarModule,
    MatRippleModule,
    MatBottomSheetModule,
    MatProgressBarModule,
    StoreModule.forRoot(Reducers),
    EffectsModule.forRoot(Effects),
    TranslateModule.forRoot({
      defaultLanguage: 'en-US',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      isolate: false
    }),
    AngularFireModule.initializeApp(config),
    // provideFirebaseApp( () => initializeApp(firebaseConf) )
  ],
  providers: [
    {
      provide: MessagingService
    },
    { 
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorsInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: PostInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: localeIt
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(overlayContainer: OverlayContainer, uiService: UiService) {
  }
}
