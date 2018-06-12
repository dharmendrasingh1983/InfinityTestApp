import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpComponentComponent } from './emp-component/emp-component.component';
import { Route, RouterModule } from '@angular/router';
import { EmpItemComponent } from './emp-item/emp-item.component';
import { EmpCreateComponent } from './emp-create/emp-create.component';

const childRoute: Route[] = [
  {
    path: '', component: EmpComponentComponent, pathMatch: 'prefix',
    children: [
      { path: '', redirectTo: '\empList', pathMatch: 'full' },
      { path: 'empList', component: EmpItemComponent },
      { path: 'empCreate', component: EmpCreateComponent }
    ]
  },
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(childRoute)
  ],

  declarations: [
    EmpComponentComponent,
    EmpItemComponent,
    EmpCreateComponent
  ],

})
export class EmpModuleModule { }
