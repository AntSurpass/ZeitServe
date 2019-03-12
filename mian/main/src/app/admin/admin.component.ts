import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  navStart: Observable<NavigationStart>;

  currentUrl: string = '';

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.navStart = this.router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
  }

  ngOnInit() {
    this.navStart.subscribe(route => {
      this.currentUrl = route.url;
    });
  }

}
