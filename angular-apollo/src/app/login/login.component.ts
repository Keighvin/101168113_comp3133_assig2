import { HttpClient } from '@angular/common/http';
import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Apollo, gql, Query } from 'apollo-angular';
import moment from 'moment';
import { shareReplay } from 'rxjs';
import { User } from '../types';
import { AuthService } from './AuthService';
export const query =  gql`
mutation signin($email:String!,$password:String!)
{
  signin (email:$email,password:$password) {
    token
    user_id
    type
  }
}
`;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  form:FormGroup;

    constructor(private fb:FormBuilder, 
                 private authService: AuthService, 
                 private router: Router,
                 private apollo: Apollo,private route: ActivatedRoute) {

        this.form = this.fb.group({
            email: ['',Validators.required],
            password: ['',Validators.required]
        });
    }
    login() {
      const val = this.form.value;

      if (val.email && val.password) {
        return this.apollo.watchQuery<Query>({
          query:query,
            variables: {email : val.email,password:val.password,},
          })
          .valueChanges
          .pipe(shareReplay(1));
          

      }
      return
  }
  ngOnInit(): void {
    this.login();
    throw new Error('Method not implemented.');
  }

   
   
}
