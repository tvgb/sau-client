import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	constructor(private fireStore: AngularFirestore) { }

	addSomeData(): void {
		this.fireStore.collection('users').add({
			first: 'Ada',
			last: 'Lovelace',
			born: 1815
		})
		.then((docRef) => {
			console.log('Document written with ID: ', docRef.id);
		})
		.catch((error) => {
			console.error('Error adding document: ', error);
		});
	}
}
