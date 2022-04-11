import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../types';
import { Observable } from 'rxjs';
import {  shareReplay, map, pluck } from 'rxjs/operators';
import * as moment from "moment";

@Injectable()
export class AuthService {
    
    constructor(private http: HttpClient) {
    }
      
    /*login(email:string, password:string ) {
        return this.http.post<User>('login', {email, password}).pipe(res => this.setSession)
            // this is just the HTTP call, 
            // we still need to handle the reception of the token
            ;
    }
    private setSession(authResult: { expiresIn: moment.DurationInputArg1; idToken: string; }) {
        const expiresAt = moment().add(authResult.expiresIn,'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()) );
    }          

    logout() {
        localStorage.removeItem("id_token");
        localStorage.removeItem("expires_at");
    }

    public isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem("expires_at");
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }    */
//}
          
          
}