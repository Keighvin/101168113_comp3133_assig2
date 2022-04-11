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
    listing_title
    description
    city
    street
    postal_code
    price
    user{
      email
      username
    }
  }
}
`;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css']
})
export class ListingComponent implements OnInit {
  
  
  listings: Observable<any> | undefined;
  loading$: Observable<boolean>| undefined;
  error$: Observable<any>| undefined;
  @Input() id:Observable<String> | undefined;
  constructor(private router: Router,private apollo: Apollo,private route: ActivatedRoute) { }
    ngOnInit() {
      this.route.params.subscribe( params =>
        this.id=params['id']);
        console.log(this.id);
        const source = this.getListing();
        
        this.loading$ = source.pipe(pluck('loading'));
        this.error$ = source.pipe(pluck('errors'));
        this.listings = source.pipe(pluck('data', 'listing'));
     
        console.log(this.listings)
      }
      getListing(){
        return this.apollo.watchQuery<Query>({
          query:query,
            variables: {listing_id : this.id,},
          })
          .valueChanges
          .pipe(shareReplay(1));
      }
      

}
