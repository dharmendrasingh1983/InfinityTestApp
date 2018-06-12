import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { DbHelper } from '../services/dbHelper';
import { InterfaceInputComponent } from './components/interfaceInput/interfaceInput';
import { DeviceInputComponent } from './components/deviceInput.ts/deviceInput';
import { RouterModule, Routes } from '@angular/router';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { InputValueValidator } from '../shared/inputValueValidator';
import { UniqInputValidator } from '../shared/uniqInputValidator';
import { NopageErrorComponent } from './no-page/nopage-error/nopage-error.component';





const routes: Routes = [
  { path: 'device', component: DeviceInputComponent },
  { path: 'empModule', loadChildren: './emp-module/emp-module.module#EmpModuleModule' },
  { path: '', redirectTo: '/device', pathMatch: 'full' },
  { path: '**', component: NopageErrorComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    InterfaceInputComponent,
    DeviceInputComponent,
    InputValueValidator,
    UniqInputValidator,
    NopageErrorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot(),
    AngularFontAwesomeModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [DbHelper],
  bootstrap: [AppComponent]
})
export class AppModule { }
