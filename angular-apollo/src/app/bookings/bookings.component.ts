import { Component, Input, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { Observable } from 'rxjs';
import {  shareReplay, map, pluck } from 'rxjs/operators';
import { Listing,Query }  from '../types';
import { ActivatedRoute, Router } from '@angular/router';

export const query =  gql`
query listing($listing_id:ID!)
{
  listing (listing_id:$listing_id) {
    listing_id
    }
  }
`;
export const query2 =  gql`
query booking_by_listing($listing_id:String)
{
  booking_by_listing (listing_id:$listing_id) {
    booking_start
      booking_end
      booking_date
      user{
        username
      }

  }
}
`;
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  listings:Observable<any> | undefined;
  bookings: Observable<any> | undefined;
  loading$: Observable<boolean>| undefined;
  error$: Observable<any>| undefined;
  @Input() id:Observable<String> | undefined;
  constructor(private router: Router,private apollo: Apollo,private route: ActivatedRoute) { }

  ngOnInit(): void {
  this.route.params.subscribe( params =>
        this.id=params['id']);
        console.log(this.id);
        const source = this.getListing();
        
        this.loading$ = source.pipe(pluck('loading'));
        this.error$ = source.pipe(pluck('errors'));
        this.listings = source.pipe(pluck('data', 'listing'));

        const source2 = this.getListing();
        
        this.loading$ = source2.pipe(pluck('loading'));
        this.error$ = source2.pipe(pluck('errors'));
        this.bookings = source2.pipe(pluck('data', 'listing'));
     
        console.log(this.bookings)
      }
      getListing(){
        return this.apollo.watchQuery<Query>({
          query:query,
            variables: {listing_id : this.id,},
          })
          .valueChanges
          .pipe(shareReplay(1));
      }
      getBooking()
      {
        return this.apollo.watchQuery<Query>({
          query:query2,
            variables: {listing_id : this.listings,},
          })
          .valueChanges
          .pipe(map(result => result.data.bookings));
      }

}
