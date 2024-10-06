import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { FormsModule } from '@angular/forms'; // If you are using ngModel
import { AppComponent } from './app.component';
import { OrreryComponent } from './orrery/orrery.component';
import { DetailedInfoComponent } from './detailed-info/detailed-info.component';
import { AppRoutingModule } from './app-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { AccuracyChartComponent } from './accuracy-chart/accuracy-chart.component'; // Import MatIconModule

@NgModule({
  declarations: [
    AppComponent,
    OrreryComponent,
    DetailedInfoComponent,
    AccuracyChartComponent,



    // Other components
  ],
  imports: [
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    HttpClientModule, // Include HttpClientModule here
    FormsModule,
    MatIconModule,
    AppRoutingModule,  // Include FormsModule if you're using ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
