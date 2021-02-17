import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

	constructor(private authService: AuthService) { }

	ngOnInit() {
		const email = 'vgb@outlook.com';
		const pw = '123456';
		this.authService.signOut();
		// this.authService.signIn(email, pw);
	}
}
