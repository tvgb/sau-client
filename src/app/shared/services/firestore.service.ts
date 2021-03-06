import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FieldTripInfo } from '../classes/FieldTripInfo';
import { Beitelag } from '../interfaces/beitelag';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class FirestoreService {

	constructor(private fireStore: AngularFirestore, private authService: AuthService) { }

	async saveNewFieldTrip(fieldTripInfo: FieldTripInfo): Promise<boolean> {

		const fti = {...fieldTripInfo};
		const userId = this.authService.getUserId();
		fti.overseerId = userId;

		return this.getBeitelagId(userId).then((beitelagId) => {
			if (beitelagId) {
				const beitelagRef = this.fireStore.collection('beitelag').doc(beitelagId);
				return beitelagRef.collection('fieldTrips').add(this.convertToPlainJsObject(fti))
				.then(() => {
					return true;
				})
				.catch((error) => {
					console.error('Error adding document: ', error);
					return false;
				});
			}
		});
	}

	async getCurrentUser(userId: string): Promise<any> {
		const membersRef = this.fireStore.collection('members').ref;
		return membersRef.where('id', '==', userId).get().then((members) => {
			return members.docs[0].data();
		});
	}

	async getFieldTrips(): Promise<FieldTripInfo[]> {
		const userId = this.authService.getUserId();

		return this.getBeitelagId(userId).then(async (beitelagId) => {
			const beitelagRef = this.fireStore.collection('beitelag').doc(beitelagId).ref;

			const beitelag = (await beitelagRef.get()).data() as Beitelag;

			if (beitelag.farmers.includes(userId)) {
				return beitelagRef.collection('fieldTrips').get().then((fieldTrips) => {
					return fieldTrips.docs.map(doc => doc.data()) as FieldTripInfo[];
				});
			} else {
				return beitelagRef.collection('fieldTrips').where('overseerId', '==', userId).get().then((fieldTrips) => {
					return fieldTrips.docs.map(doc => doc.data()) as FieldTripInfo[];
				});
			}
		});
	}

	private async getBeitelagId(userId: string): Promise<any> {
		const membersRef = this.fireStore.collection('members').ref;
		return membersRef.where('id', '==', userId).get().then((members) => {
			return members.docs[0].data()['beitelagId'];
		});
	}

	private convertToPlainJsObject(object: any): object {
		return JSON.parse(JSON.stringify(object));
	}
}
