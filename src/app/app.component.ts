import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Initialize the coach with 80 seats: 11 rows (7 per row, last row with 3 seats)
  coach: { seatNumber: number; booked: boolean }[][] = [];
  message = '';

  constructor() {
    this.initializeSeats();
  }

  // Function to initialize seats (11 rows: 10 with 7 seats, last row with 3 seats)
  initializeSeats() {
    let seatCounter = 1;
    for (let i = 0; i < 10; i++) {
      const row = Array(7)
        .fill(0)
        .map(() => ({ seatNumber: seatCounter++, booked: false }));
      this.coach.push(row);
    }
    // Last row with 3 seats
    const lastRow = Array(3)
      .fill(0)
      .map(() => ({ seatNumber: seatCounter++, booked: false }));
    this.coach.push(lastRow);
  }

  // Function to book seats
  bookSeats(seatCount: number) {
    if (seatCount < 1 || seatCount > 7) {
      this.message = 'You can only book between 1 and 7 seats.';
      return;
    }

    const availableSeats = this.findAvailableSeats(seatCount);
    if (availableSeats.length === 0) {
      this.message = 'No available seats for this request.';
      return;
    }

    // Mark seats as booked
    availableSeats.forEach((seat) => (seat.booked = true));
    this.message = `Seats booked: ${availableSeats
      .map((seat) => seat.seatNumber)
      .join(', ')}`;
  }

  // Function to find available seats, prioritizing same row bookings
  findAvailableSeats(seatCount: number): any[] {
    // First, try to find all seats in one row
    for (let row of this.coach) {
      const freeSeatsInRow = row.filter((seat) => !seat.booked);
      if (freeSeatsInRow.length >= seatCount) {
        return freeSeatsInRow.slice(0, seatCount);
      }
    }

    // If seats are not available in one row, book nearby seats (across rows)
    let nearbySeats: any[] = [];
    for (let row of this.coach) {
      nearbySeats = nearbySeats.concat(row.filter((seat) => !seat.booked));
      if (nearbySeats.length >= seatCount) {
        return nearbySeats.slice(0, seatCount);
      }
    }

    return [];
  }

  // Utility function to display the seat availability status
  getSeatStatus(seat: any): string {
    return seat.booked ? 'Booked' : 'Available';
  }
}
