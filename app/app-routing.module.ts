import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomepageComponent } from './views/homepage/homepage.component';
import { NotFoundComponent } from './views/not-found/not-found.component';
import { ServicesComponent } from './views/services/services.component';
import { ServiceComponent } from './views/services/service/service.component';
import { MeteoComponent } from './views/meteo/meteo.component';
import { AuthGuard } from './guards/auth.guard';
import { ExpiredComponent } from './views/expired/expired.component';
import { ClaimGuard } from './guards/claim.guard';
import { OrderComponent } from './views/orders/order/order.component';
import { LoggedInComponent } from './templates/loggedin/loggedin.component';
import { MessageContainerComponent } from './views/messages/message-container.component';
import { MessagesComponent } from './views/messages/messages/messages.component';
import { RoomServiceResolver } from './resolvers/room-service.resolver';
import { OrderResolver } from './resolvers/order.resolver';
import { OrdersComponent } from './views/orders/orders.component';
import { SurveyComponent } from './views/survey/survey.component';
import { ServiceResolver } from './resolvers/service.resolver';
import { ServicesResolver } from './resolvers/services.resolver';
import { AreaPositionResolver } from './resolvers/area-position.resolver';
import { OrderPositionListComponent } from './views/orders/order-position-list/order-position-list.component';
import { AreaCheckGuard, AreaRoomCheckGuard } from './guards/area-check.guard';
import { LandingComponent } from './views/landing/landing.component';
import { MessagesResolver } from './resolvers/messages.resolver';
import { CanDeactivateGuard } from './guards/deactivate.guard';
import { LoginPageComponent } from './views/login/login.component';
import { ExternalAppComponent } from './views/externalapp/externalapp.component';
import { CheckGuard } from './guards/check.guard';
import { UnitsResolver } from './resolvers/units.resolver';
import { ErrorComponent } from './views/error/error.component';
import { MainPageResolver } from './resolvers/main-page.resolver';
import { ReservationSettingsResolver } from './resolvers/reservation-settings.resolver';

const routes: Routes = [
  { path: '', component: LandingComponent, canActivate: [ ClaimGuard ] },
  { path: 'login', component: LoginPageComponent },
  { path: 'app', component: LoggedInComponent, resolve:{ 
      Data: MainPageResolver, 
      Reservation: ReservationSettingsResolver 
    },canActivate: [ AuthGuard ],
    children: [
      { data: {pageName: ''}, path: '', component: HomepageComponent },
      { data: {pageName: 'welcome'}, path: 'welcome', component: HomepageComponent },
      { data: {pageName: 'messages'}, path: 'messages', component: MessageContainerComponent, resolve: { Data: UnitsResolver } },
      { data: {pageName: 'messages'}, path: 'messages/:id', component: MessagesComponent, resolve: { Data: MessagesResolver } },
      { data: {pageName: 'services'}, path: 'services', component: ServicesComponent, resolve: { service: ServicesResolver } },
      { data: {pageName: 'services'}, path: 'services/:id', component: ServiceComponent, resolve: { service: ServiceResolver } },
      { data: {pageName: 'meteo'}, path: 'meteo', component: MeteoComponent },
      { data: {pageName: 'order'}, path: 'order', component: OrdersComponent },
      { data: {pageName: 'order'}, path: 'order/:position/:id', component: OrderComponent, canDeactivate: [ CanDeactivateGuard ], canActivate:[AreaCheckGuard], resolve: { Data: OrderResolver } },
      { data: {pageName: 'order'}, path: 'order/:position', component: OrderPositionListComponent, resolve: { Data: AreaPositionResolver } },
      { data: {pageName: 'room_service'}, path: 'room_service', component: OrderComponent, canDeactivate: [ CanDeactivateGuard ], canActivate: [AreaRoomCheckGuard], resolve: { Data: RoomServiceResolver } },
      { data: {pageName: 'survey'}, path: 'survey', component: SurveyComponent },
      { data: {pageName: 'checkin', key: 'checkin'}, path: 'checkin', component: ExternalAppComponent, canActivate: [ CheckGuard ] },
      { data: {pageName: 'checkout', key: 'checkout'}, path: 'checkout', component: ExternalAppComponent, canActivate: [ CheckGuard ] },
    ]
  },
  { path: 'expired', component: ExpiredComponent },
  { path: 'error', component: ErrorComponent },
  { path: '403', component: ExpiredComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
