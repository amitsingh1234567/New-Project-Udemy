import { NgModule, } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeadersComponent } from './headers/headers.component';
import { ObservableComponent } from './observable/observable.component';
import { ListComponent } from './observable/list/list.component';
import { FromEventComponent } from './observable/from-event/from-event.component';
import { IntervalComponent } from './interval/interval.component';
import { OfFromComponent } from './of-from/of-from.component';
import { ToArrayComponent } from './to-array/to-array.component';
import { CutomObservableComponent } from './observable/cutom-observable/cutom-observable.component';
import { MapComponent } from './map/map.component';



const routes: Routes = [
  {path:'', component: HeadersComponent},
  {path:'observable', component: ObservableComponent,
  children:[
    {path:'', component: ListComponent},
    {path:'fromEvent', component: FromEventComponent},
    {path:'interval', component: IntervalComponent},
    {path:'of-from', component: OfFromComponent},
    {path:'to-array', component: ToArrayComponent},
    {path:'custom-observable', component: CutomObservableComponent},
    {path:'map', component: MapComponent},
  ]},
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
  
}
