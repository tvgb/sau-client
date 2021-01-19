import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { DownloadProgressionData } from 'src/app/shared/classes/DownloadProgressionData';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { MapService } from '../map/services/map.service';
import { OptionsModalPage } from './options-modal/options-modal.page';

@Component({
	selector: 'app-offline-maps',
	templateUrl: './offline-maps.page.html',
	styleUrls: ['./offline-maps.page.scss'],
})
export class OfflineMapsPage {


	offlineMaps: OfflineMapMetaData[];
	downloadProgressions: DownloadProgressionData[] = [];

	constructor(private mapService: MapService, private navController: NavController, private modalController: ModalController) { }

	ionViewWillEnter() {
		this.mapService.getOfflineMapsMetaData().then(res => {
			if (res) {
				this.offlineMaps = res;
			}
		});

		this.mapService.getCurrentlyDownloading().subscribe((res: DownloadProgressionData[]) => {
			if (res) {
				this.downloadProgressions = res;
			}
		});

		this.mapService.mapsUpdated().subscribe(() => {
			this.mapService.getOfflineMapsMetaData().then(offlineMaps => {
				if (offlineMaps) {
					this.offlineMaps = offlineMaps;
				}
			});
		});
	}

	async openOptionsMenu() {
		const modal = await this.modalController.create({
			component: OptionsModalPage,
			cssClass: 'options-menu'
		});
		return await modal.present();
	}

	hideProgressBar(mapName: string): boolean {
		for (const downloadProgression of this.downloadProgressions) {
			if (downloadProgression.offlineMapMetaData.name === mapName) {
				return false;
			}
		}

		return true;
	}

	getMapFileSize(bytes: number): string {
		return `${Math.round(bytes / 100000) / 10} MB`;
	}

	getDownloadCompletionRate(mapName: string): number {
		const downloadProgressionData = this.downloadProgressions.find(d => d.offlineMapMetaData.name === mapName);
		if (downloadProgressionData) {
			return downloadProgressionData.downloadedTiles / downloadProgressionData.totalTiles;
		}

		return 0;
	}

	plusButtonClicked(): void {
		this.navController.navigateForward('/download-map');
	}
}
