import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService, RoomStatus, ScheduledEvent } from 'src/app/services/data/data.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserIdleService } from 'angular-user-idle';
import { SelectTime, BookService } from 'src/app/services/book/book.service';
import { MatBottomSheet, MatDialog } from '@angular/material';
import { KeyboardSheetComponent } from '../keyboard-sheet/keyboard-sheet.component';
import { FormControl } from '@angular/forms';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-book-page',
  templateUrl: './book-page.component.html',
  styleUrls: ['./book-page.component.scss']
})
export class BookPageComponent implements OnInit {
  startTimeControl = new FormControl('');
  endTimeControl = new FormControl('');

  @ViewChild('eventTitle', { static: false }) inputTitle: ElementRef;

  newBookingEvent: ScheduledEvent;
  timeIncrements: SelectTime[];

  status: RoomStatus;
  day: Date = new Date();
  eventTitleValue: string = "";

  constructor(private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private dataService: DataService,
    private router: Router,
    private usrIdle: UserIdleService,
    private bookService: BookService,
    private bottomSheet: MatBottomSheet,
    public dialogRef: MatDialog) {

    this.matIconRegistry.addSvgIcon(
      "BackArrow",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/BackArrow.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "SaveTray",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/SaveTray.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "Cancel",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/Cancel.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "Help",
      this.domSanitizer.bypassSecurityTrustResourceUrl("./assets/helpOutline.svg")
    );

    this.usrIdle.startWatching();
    this.usrIdle.onTimerStart().subscribe();
    this.usrIdle.onTimeout().subscribe(() => {
      console.log('Page timeout. Redirecting to main...');
      this.usrIdle.stopWatching();
      this.routeToMain();
    });
  }

  ngOnInit() {
    this.status = this.dataService.getRoomStatus();
    this.newBookingEvent = new ScheduledEvent();
    this.timeIncrements = this.bookService.getTimeIncrements();
  }

  showKeyboard(): void {
    this.inputTitle.nativeElement.blur();
    this.bottomSheet.open(KeyboardSheetComponent).afterDismissed().subscribe((result) => {
      if (result != undefined) {
        this.eventTitleValue = result as string;
      }
    });
  }

  routeToMain(): void {
    this.router.navigate(['/']);
  }

  requestHelp(): void {
    const dialog = this.dialogRef.open(HelpDialogComponent, {});
  }

  saveEventData(): void {
    let bookEvent = this.getEventData();
    if (bookEvent != null) {
      console.log("New event: ", bookEvent);
      this.openBookDialog(bookEvent);
    } else {
      console.log("Null event");
    }
  }

  getEventData(): ScheduledEvent {
    if (this.inputTitle.nativeElement.value == "") {
      this.newBookingEvent.title = "Book Now Meeting";
    } else {
      this.newBookingEvent.title = this.inputTitle.nativeElement.value;
    }
    if (this.getSelectedTimes()) {
      return this.newBookingEvent;
    }
    return null;
  }

  getSelectedTimes(): boolean {
    if (this.startTimeControl.value.value == undefined || this.endTimeControl.value.value == undefined) return false;
    let timeString = this.startTimeControl.value.value;
    this.newBookingEvent.startTime = new Date();
    this.newBookingEvent.startTime.setHours(parseInt(timeString.substr(0, 2)), parseInt(timeString.substr(3, 2)), 0, 0);
    timeString = this.endTimeControl.value.value;
    this.newBookingEvent.endTime = new Date();
    this.newBookingEvent.endTime.setHours(parseInt(timeString.substr(0, 2)), parseInt(timeString.substr(3, 2)), 0, 0);
    return true;
  }

  startSelected(): void {
    const endId = this.checkEndTime(this.startTimeControl.value.id, this.endTimeControl.value.id);
    this.endTimeControl.setValue(this.timeIncrements[endId]);
  }

  checkEndTime(startId: number, endId: number): number {
    if (endId == undefined) return (startId + 1);
    if (startId >= endId) return (startId + 1);
    if (endId > startId + 4) return (startId + 1); // Only allow a meeting to be max 2 hours
    for (let i = startId + 1; i < endId; i++) {
      if (!this.timeIncrements[i].validEnd) return (startId + 1);
    }
    return endId;
  }

  endSelected(): void {
    const startId = this.checkStartTime(this.startTimeControl.value.id, this.endTimeControl.value.id);
    this.startTimeControl.setValue(this.timeIncrements[startId]);
  }

  checkStartTime(startId: number, endId: number): number {
    if (startId == null) return (endId - 1);
    if (startId >= endId) return (endId - 1);
    if (startId < endId - 4) return (endId - 1); // Only allow a meeting to be max 2 hours
    for (let i = startId + 1; i < endId; i++) {
      if (!this.timeIncrements[i].validStart) return (endId - 1);
    }
    return startId;
  }

  openBookDialog(event: ScheduledEvent): void {
    const dialog = this.dialogRef.open(BookDialogComponent, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: event
    });

    dialog.afterClosed().subscribe(result => {
      console.log('Book dialog was closed');
      if (result == 'success') {
        this.routeToMain();
      }
    });
  }

}