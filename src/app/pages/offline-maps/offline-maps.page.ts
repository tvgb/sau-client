import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { cordovaInstance } from '@ionic-native/core';
import { AnimationController, Animation, ModalController, NavController } from '@ionic/angular';
import { DownloadProgressionData } from 'src/app/shared/classes/DownloadProgressionData';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { MapService } from '../map/services/map.service';

@Component({
	selector: 'app-offline-maps',
	templateUrl: './offline-maps.page.html',
	styleUrls: ['./offline-maps.page.scss'],
})
export class OfflineMapsPage {

	optionsMenuHidden = true;
	changeNameBoxHidden = true;
	offlineMaps: OfflineMapMetaData[];
	downloadProgressions: DownloadProgressionData[] = [];
	selectedMapName: string;

	@ViewChild('backdrop') backdrop: ElementRef;
	@ViewChild('optionsMenu') optionsMenu: ElementRef;

	constructor(private mapService: MapService, private navController: NavController, private animationCtrl: AnimationController) { }

	ionViewWillEnter() {
		this.setOfflineMaps();

		this.mapService.getCurrentlyDownloading().subscribe((res: DownloadProgressionData[]) => {
			if (res) {
				this.downloadProgressions = res;
			}
		});

		this.mapService.mapsUpdated().subscribe(() => {
			this.setOfflineMaps();
		});
	}



	showOptionsMenu(selectedMapName: string): void {
		this.selectedMapName = selectedMapName;

		this.optionsMenuHidden = false;
		const showBackdropAnimation = this.getShowBackdropAnimation();
		const showOptionsMenuAnimation = this.animationCtrl.create()
			.addElement(this.optionsMenu.nativeElement)
			.duration(200)
			.easing('cubic-bezier(0, 0, 0.58, 1)')
			.fromTo('transform', 'translateY(0px)', `translateY(-100%)`);

		this.animationCtrl.create()
			.addAnimation([showBackdropAnimation, showOptionsMenuAnimation])
			.play();
	}

	hideOptionsMenu(hideBackdrop: boolean = true): void {
		const animations: Animation[] = [];

		if (this.optionsMenuHidden && !this.changeNameBoxHidden) {
			this.changeNameBoxHidden = true;
		}

		animations.push(
			this.animationCtrl.create()
				.addElement(this.optionsMenu.nativeElement)
				.duration(200)
				.fromTo('transform', 'translateY(-100%)', `translateY(0px)`)
		);

		if (hideBackdrop) {
			animations.push(this.getHideBackdropAnimation());
		}

		this.animationCtrl.create()
			.addAnimation(animations)
			.play().then(() => {
				this.optionsMenuHidden = true;
			});
	}

	showChangeNameBox(): void {
		if (!this.selectedMapName) {
			return;
		}
		this.hideOptionsMenu(false);
		this.changeNameBoxHidden = false;
	}

	private getShowBackdropAnimation(): Animation {
		return this.animationCtrl.create()
		.addElement(this.backdrop.nativeElement)
		.duration(200)
		.fromTo('opacity', '0', '1');
	}

	private getHideBackdropAnimation(): Animation {
		return this.animationCtrl.create()
		.addElement(this.backdrop.nativeElement)
		.duration(200)
		.fromTo('opacity', '1', '0');
	}

	hideProgressBar(mapName: string): boolean {
		for (const downloadProgression of this.downloadProgressions) {
			if (downloadProgression.offlineMapMetaData.name === mapName) {
				return false;
			}
		}

		return true;
	}

	deleteOfflineMap(): void {
		if (!this.selectedMapName) {
			return;
		}
		this.hideOptionsMenu();
		this.offlineMaps = this.offlineMaps.filter(om => om.name !== this.selectedMapName);
		this.mapService.deleteOfflineMap(this.selectedMapName);
		this.selectedMapName = null;
	}

	updateOfflineMap(): void {
		if (!this.selectedMapName) {
			return;
		}

		this.hideOptionsMenu();
		this.mapService.updateOfflineMap(this.selectedMapName);
		this.selectedMapName = null;
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

	private setOfflineMaps(): void {
		this.mapService.getOfflineMapsMetaData().then(res => {
			if (res) {
				this.offlineMaps = res.sort(this.sortFunction);
			}
		});
	}

	private sortFunction(a: OfflineMapMetaData, b: OfflineMapMetaData): number {
		if (a.downloadDate > b.downloadDate) {
			return -1;
		}
		if (a.downloadDate < b.downloadDate) {
			return 1;
		}
		return 0;
	}
}
