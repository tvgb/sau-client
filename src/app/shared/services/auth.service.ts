import { Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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
		});
	}

	signOut(): Promise<boolean> {
		return this.fireAuth.signOut().then(() => {
			this.isAuthenticated();
			return true;
		}).catch(() => {
			return false;
		});
	}

	isAuthenticated(): Observable<boolean> {
		return this.fireAuth.authState.pipe(
			map((user) => {
				if (user) {
					this.userData = user;
					return true;
				} else {
					return false;
				}
			})
		);
	}
}
