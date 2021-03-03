import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Plugins } from '@capacitor/core';
import { cordovaInstance } from '@ionic-native/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase/app';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private userData: any;

	constructor(private fireAuth: AngularFireAuth, private fireStore: AngularFirestore, private navController: NavController) {
		this.fireAuth.authState.subscribe((user) => {
			if (user) {
				localStorage.setItem('user', JSON.stringify(user));
				this.userData = user;
			} else {
				this.navController.navigateBack('/login');
				localStorage.removeItem('user');
			}
		});
	}

	getUserId(): string {
		if (this.userData) {
			return this.userData.uid;
		} else {
			const user = JSON.parse(localStorage.getItem('user'));
			if (user) {
				this.userData = user;
				return this.userData.uid;
			}
		}
	}

	signIn(email: string, password: string): Promise<boolean> {
		return this.fireAuth.signInWithEmailAndPassword(email, password)
		.then(() => {
			return true;
		}).catch(() => {
			return false;
		});
	}

	signOut(): Promise<boolean> {
		return this.fireAuth.signOut().then(() => {
			return true;
		}).catch(() => {
			return false;
		});
	}

	isAuthenticated(): boolean {
		if (this.userData) {
			return true;
		} else if (this.checkLocalStorage) {
			return true;
		}

		return false;
	}

	checkLocalStorage(): boolean {
		const user = localStorage.getItem('user');
		if (user) {
			this.userData = user;
			return true;
		} else {
			this.userData = null;
			return false;
		}
	}
}
