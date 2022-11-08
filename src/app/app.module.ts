import { NgModule } from '@angular/core';
import { SharedModule } from './modules/shared.module';
import { AppComponent } from './app.component';
import { AppRoutingModule, routingAppComponents } from './app-routing.module';
import { SelectionComponent } from './pages/grid-selection/selection.component';
import { SEToolkitModule } from '@churchillliving/se-ui-toolkit';
import { BrowserModule } from '@angular/platform-browser';
import { TabViewModule } from 'primeng/tabview';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../environments/environment';
import { ConfirmationService } from 'primeng/api';
import { IframeComponent } from './components/iframe/iframe.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  declarations: [
    routingAppComponents,
    AppComponent,
    SelectionComponent,
    IframeComponent,
  ],

  imports: [
    SharedModule,
    AppRoutingModule,
    BrowserModule,
    TabViewModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ConfirmDialogModule,
    MessagesModule,
    ToastrModule.forRoot(),
    SEToolkitModule.forRoot(environment),
  ],
  providers: [
    ConfirmationService,
    DecimalPipe,
    DatePipe,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
