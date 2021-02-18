import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Plugins } from '@capacitor/core';
import * as firebase from 'firebase/app';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

const { Network } = Plugins;


@Injectable({
	providedIn: 'root'
})
export class AuthService {

	private userData: any;

	constructor(private fireAuth: AngularFireAuth, public fireStore: AngularFirestore) { }

	signIn(email: string, password: string): Promise<boolean> {
		return this.fireAuth.signInWithEmailAndPassword(email, password)
		.then(() => {
			return true;
		}).catch(() => {
			return false;
		}).finally(() => {
			this.isAuthenticated();
		});
	}

	signOut(): Promise<boolean> {
		return this.fireAuth.signOut().then(() => {
			return true;
		}).catch(() => {
			return false;
		}).finally(() => {
			this.isAuthenticated();
		});
	}

	isAuthenticated(): Promise<boolean> {
		return Network.getStatus().then((status) => {
			if (status.connected) {
				return this.fireAuth.authState.toPromise().then((user) => {
					if (user) {
						localStorage.setItem('user', JSON.stringify(user));
						this.userData = user;
						return true;
					} else {
						localStorage.removeItem('user');
						return false;
					}
				});
			} else {
				return this.checkLocalStorage();
			}
		});
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
