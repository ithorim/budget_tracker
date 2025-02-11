import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SettingsPageComponent } from './components/settings-page/settings-page.component';
import { EditTransactionModalComponent } from './components/transactions/edit-transaction-modal/edit-transaction-modal.component';
import { DeleteTransactionModalComponent } from './components/transactions/delete-transaction-modal/delete-transaction-modal.component';
import { AddTransactionModalComponent } from './components/transactions/add-transaction-modal/add-transaction-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
    DashboardComponent,
    NavbarComponent,
    TransactionsComponent,
    SettingsPageComponent,
    EditTransactionModalComponent,
    DeleteTransactionModalComponent,
    AddTransactionModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }