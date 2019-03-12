import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import * as Bcrypt from 'bcryptjs';
import { environment } from '../../../environments/environment';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent implements OnInit {

  @ViewChild('usernameBox') usernameBox: ElementRef;

  @ViewChild('passwordBox') passwordBox: ElementRef;

  // username = localStorage.getItem('__username') || '';

  // password = localStorage.getItem('__password') || '';

  constructor(private adminSrv: AdminService, private router: Router) { }

  ngOnInit() {
  }

  login(ev: MouseEvent, username, password) {
    ev.preventDefault();
    if(username === '' || password === '') return;
    this.adminSrv.login({username, password: Bcrypt.hashSync(password, environment.salt)}).subscribe(res => {
      let data = res.json();
      if(data.code === 1) {
        this.router.navigateByUrl('/admin/home');
        // localStorage.setItem('__username', username);
        // localStorage.setItem('__password', password);
        return;
      }
      console.log('login failed.');
    }, err => {

    });
  }

}
