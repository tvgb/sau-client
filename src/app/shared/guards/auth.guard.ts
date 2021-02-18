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
		state: RouterStateSnapshot): Promise<boolean> {

		return this.authService.isAuthenticated()
			.then((isAuthenticated) => {

				if (isAuthenticated) {
					return true;
				}

				this.navController.navigateBack('/login');
				return false;
			})
			.catch(() => {
				this.navController.navigateBack('/login');
				return false;
			});
	}
}
