import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserIdleModule } from 'angular-user-idle';

import { HttpClientModule } from '@angular/common/http';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';

import {
  MatToolbarModule,
  MatCardModule,
  MatGridListModule,
  MatButtonModule,
  MatIconModule,
  MatSelectModule,
  MatFormFieldModule,
  MatBottomSheetModule,
  MatInputModule,
  MatDialogModule,
  MatProgressSpinnerModule
} from '@angular/material';

import { TimeComponent } from './components/time/time.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { BookPageComponent } from './components/book-page/book-page.component';
import { SchedulePageComponent } from './components/schedule-page/schedule-page.component';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { KeyboardSheetComponent } from './components/keyboard-sheet/keyboard-sheet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BookDialogComponent } from './components/book-dialog/book-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    TimeComponent,
    MainPageComponent,
    BookPageComponent,
    SchedulePageComponent,
    ScheduleListComponent,
    KeyboardSheetComponent,
    BookDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    UserIdleModule.forRoot({ idle: 60, timeout: 1, ping: 30 }),
    HttpClientModule,
    ScrollDispatchModule,
    MatToolbarModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatBottomSheetModule,
    MatInputModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [KeyboardSheetComponent, BookDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
