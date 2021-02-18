import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase/app';

const { Network } = Plugins;


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private userData: any;

	constructor(private fireAuth: AngularFireAuth, public fireStore: AngularFirestore) {
		this.fireAuth.authState.subscribe((user) => {
			if (user) {
				localStorage.setItem('user', JSON.stringify(user));
				this.userData = user;
			} else {
				localStorage.removeItem('user');
			}
		});
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
