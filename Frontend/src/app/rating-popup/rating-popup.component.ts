import {Component, Inject,} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent} from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';
import {WebsocketService} from '@app/service/websocket.service';
import {UserRating} from '@app/models/UserRating';
import {RideRequest} from '@app/models/ride-request';
import {UpdatedRatingMessage} from '@app/models/updatedRatingMessage';
import {CompletedRequestService} from '@app/service/completed-request.service';
import {NgIf} from '@angular/common';


@Component({
  selector: 'app-rating-popup',
  imports: [
    MatDialogContent,
    FormsModule,
    NgIf
  ],
  templateUrl: './rating-popup.component.html',
  styleUrl: './rating-popup.component.css'
})
export class RatingPopupComponent {

  rating : number = 5;

  constructor(
    private dialog : MatDialogRef<RatingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {role: string, rideRequest: RideRequest},
    private webSocketService : WebsocketService,
    private completedRequestService: CompletedRequestService
  ) {
  }

  onCancel(){
    this.dialog.close();
  }

  onRate() {
    console.log(this.data.role)
    let rating : UserRating;

    rating = {
      customerId: this.data.rideRequest.customerID!,
      driverId: this.data.rideRequest.driverID!,
      role: this.data.role,
      rating: this.rating
    }

    let updateRatingMessage : UpdatedRatingMessage = {
      requestId: this.data.rideRequest!.id!,
      rating: this.rating
    }

    if(this.data.role == "CUSTOMER"){
      this.completedRequestService.addRatingFromCustomer(updateRatingMessage).subscribe()
    }
    else{
      this.completedRequestService.addRatingFromDriver(updateRatingMessage).subscribe()
    }

    this.webSocketService.sendRating(rating);
    console.log("Rating gesendet: " + JSON.stringify(rating));
    this.dialog.close();
  }
}
