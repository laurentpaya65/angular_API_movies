import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';

//  routage URL <==> composants
//  <router-outler></router-outlet>
const routes: Routes = [
  {path: '', component:ListComponent},
  {path: 'detail/:id/:type', component:DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
