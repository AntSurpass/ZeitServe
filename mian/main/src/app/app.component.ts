import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { slideInAnimation } from './common/animations/routerAnimation';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [ slideInAnimation ]
})
export class AppComponent {

  navStart: Observable<NavigationStart>;

  currentUrl: string = '';

  adminMode = false;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;

    this.navStart = this.router.events.pipe(
      filter(evt => evt instanceof NavigationStart)
    ) as Observable<NavigationStart>;
  }

  ngOnInit() {
    this.navStart.subscribe(route => {
      route.url.indexOf('/admin') > -1 ? this.adminMode = true : this.adminMode = false;
    });
  }
  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
