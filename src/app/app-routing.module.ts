// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrreryComponent } from './orrery/orrery.component';
import { DetailedInfoComponent } from './detailed-info/detailed-info.component';

const routes: Routes = [
  { path: '', redirectTo: '/orrery', pathMatch: 'full' }, // Redirect root to /orrery
  { path: 'orrery', component: OrreryComponent },           // Orrery Route
  { path: 'detailed-info', component: DetailedInfoComponent }, // Detailed Info Route
  { path: '**', redirectTo: '/orrery' } // Wildcard Route for 404 - Optional
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
