import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Apollo, gql, Query } from 'apollo-angular';
import { Router } from 'express';
import { shareReplay } from 'rxjs/operators';
import { AuthService } from '../login/AuthService';

export const query = gql`mutation signupUser ($email:String!, $password:String!, $username:String!, $firstname:String!, $lastname:String!, $type:String!) {
  signup(email:$email, password:$password, username:$username, firstname:$firstname, lastname:$lastname, type:$type){


      user_id
      email
      password
      username
      firstname
      lastname
      type
      
    
  }`
  export const testemail = gql`query user_by_email ($email:String!) {
    user_by_email(email:$email){
        email     
    }`
    export const testusername = gql`query user_by_username ($username:String!) {
      user_by_username(username:$username){
          username    
      }`
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form:FormGroup;
  typemsg:String="";
  usermsg:String="";
  emailmsg:String="";
  constructor(private fb:FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private apollo: Apollo,private route: ActivatedRoute) { this.form = this.fb.group({
      username:['',Validators.required],
      firstname:['',Validators.required],
      lastname:['',Validators.required],
      email: ['',Validators.required],
      password: ['',Validators.required],
      type:['',Validators.required]
  });}

  ngOnInit(): void {
    this.signup()
    throw new Error('Method not implemented.');
  }
  signup(){
    const val = this.form.value;

    if (val.username&&val.firstname&&val.lastname && val.email&&val.password&&val.typeval.email && val.password&&val.type) {
      if ( this.apollo.watchQuery<Query>({
        query:testemail,
          variables: {email:val.email},
        })
        .valueChanges
        .pipe(shareReplay(1))===val.email)
        {
          return this.emailmsg = "Email taken"
        }
      if ( this.apollo.watchQuery<Query>({
        query:testusername,
          variables: {email:val.username},
        })
        .valueChanges
        .pipe(shareReplay(1))===val.username)
        {
          return this.usermsg = "Username taken"
        }
      if (val.type=== 'admin'||val.type === 'user'){
        return this.apollo.watchQuery<Query>({
          query:query,
            variables: {username:val.username,firstname:val.firstname,lastname:val.lastname, email : val.email,password:val.password,type:val.type},
          })
          .valueChanges
          .pipe(shareReplay(1));
      }
      return this.typemsg="enter user or admin"
        

    }
    return
  }

}
/* A validation 
const emailExists= await users.find(user=>user.email===args.email);
const usernameExists=await users.find(user=>user.username === args.username);
if (emailExists)
      {
        if(usernameExists){
          msg='Username and email are already taken';
          console.log(msg);
          return msg;
        }
        msg='Email has alredy been taken';
        console.log(msg);
        return msg;
      }
      if(usernameExists){
        msg='Username has already been taken';
        console.log(msg);
        return msg;
      }*/