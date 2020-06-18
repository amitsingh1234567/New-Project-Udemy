import { NgModule, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TdfComponent } from './Tamplete-Driven-Form/tdf.component';
import { ReactiveComponent } from './Reactive Form/reactive.component';


const routes: Routes = [
 { path:'', component:TdfComponent},
  {path:'reactiveForm',component:ReactiveComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
  
}
