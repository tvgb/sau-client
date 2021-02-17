import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private navController: NavController) { }

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean> {

		return this.authService.isAuthenticated().pipe(
			map((isAuthenticated) => {
				if (isAuthenticated) {
					return true;
				}

				this.navController.navigateBack('/login');
				return false;

			}),
			catchError(() => {
				this.navController.navigateBack('/login');
				return of(false);
			})
		);
	}
}
