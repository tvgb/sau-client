import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FieldTripInfo } from '../classes/FieldTripInfo';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	constructor(private fireStore: AngularFirestore, private authService: AuthService) { }

	saveNewFieldTrip(fieldTripInfo: FieldTripInfo): void {

		this.getBeitelagId().then((beitelagId) => {
			if (beitelagId) {
				const beitelagRef = this.fireStore.collection('beitelag').doc(beitelagId);
				beitelagRef.collection('fieldTrips').add(this.convertToPlainJsObject(fieldTripInfo))
				.then((docRef) => {
					console.log('Document written with ID: ', docRef.id);
				})
				.catch((error) => {
					console.error('Error adding document: ', error);
				});
			}
		});
	}

	private async getBeitelagId(): Promise<any> {
		const userId = this.authService.getUserId();
		const membersRef = this.fireStore.collection('members').ref;
		return membersRef.where('id', '==', userId).get().then((members) => {
			return members.docs[0].data()['beitelagId'];
		});
	}

	private convertToPlainJsObject(object: any): object {
		return JSON.parse(JSON.stringify(object));
	}
}
