import { Component, OnInit } from '@angular/core';
import {Apollo, gql} from 'apollo-angular';
import { Observable } from 'rxjs';
import {  map } from 'rxjs/operators';
import { Listing,Query }  from '../types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.css']
})
export class ListingsComponent implements OnInit {
  listings: Observable<Listing[]> | undefined;
  constructor(private router: Router,private apollo: Apollo) { }
    ngOnInit() {
      this.listings=this.apollo.watchQuery<Query>({
        query: gql`
            {
              listings {
                listing_id
                listing_title
                price
              }
            }
          `,
        })
        .valueChanges
        .pipe(map(result => result.data.listings));
        console.log(this.listings)
      }
  }


