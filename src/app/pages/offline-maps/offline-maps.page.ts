import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AnimationController, Animation, ModalController, NavController } from '@ionic/angular';
import { DownloadProgressionData } from 'src/app/shared/classes/DownloadProgressionData';
import { OfflineMapMetaData } from 'src/app/shared/classes/OfflineMapMetaData';
import { MapService } from '../map/services/map.service';
const { App } = Plugins;

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
	selectedMapId: string;
	newMapName: string;

	@ViewChild('backdrop') backdrop: ElementRef;
	@ViewChild('optionsMenu') optionsMenu: ElementRef;

	constructor(
		private mapService: MapService,
		private navController: NavController,
		private animationCtrl: AnimationController,
		private cd: ChangeDetectorRef) {
	}

	ionViewWillEnter() {
		this.setOfflineMaps();

		this.mapService.getCurrentlyDownloading().subscribe((res: DownloadProgressionData[]) => {
			if (res) {
				this.downloadProgressions = res;
				this.cd.detectChanges();
			}
		});

		this.mapService.mapsUpdated().subscribe(() => {
			this.setOfflineMaps().then(() => {
				this.cd.detectChanges();
			});
		});
	}

	showOptionsMenu(selectedMapId: string): void {
		this.selectedMapId = selectedMapId;

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
		if (!this.selectedMapId) {
			return;
		}
		this.setSelectedMapName();
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

	hideProgressBar(mapId: string): boolean {
		for (const downloadProgression of this.downloadProgressions) {
			if (downloadProgression.offlineMapMetaData.id === mapId) {
				return false;
			}
		}

		return true;
	}

	changeOfflineMapName(): void {
		if (!this.selectedMapId) {
			return;
		}

		this.hideOptionsMenu();
		this.mapService.changeMapName(this.selectedMapId, this.newMapName).then(() => {
			this.setOfflineMaps();
		});
	}

	deleteOfflineMap(): void {
		if (!this.selectedMapId) {
			return;
		}
		this.hideOptionsMenu();
		this.offlineMaps = this.offlineMaps.filter(om => om.id !== this.selectedMapId);
		this.mapService.deleteOfflineMap(this.selectedMapId);
		this.selectedMapId = null;
	}

	updateOfflineMap(): void {
		if (!this.selectedMapId) {
			return;
		}

		this.hideOptionsMenu();
		this.mapService.updateOfflineMap(this.selectedMapId);
		this.selectedMapId = null;
	}

	getMapFileSize(bytes: number): string {
		return `${Math.round(bytes / 100000) / 10} MB`;
	}

	getDownloadCompletionRate(mapId: string): number {
		const downloadProgressionData = this.downloadProgressions.find(d => d.offlineMapMetaData.id === mapId);
		if (downloadProgressionData) {
			return downloadProgressionData.downloadedTiles / downloadProgressionData.totalTiles;
		}

		return 0;
	}

	plusButtonClicked(): void {
		this.navController.navigateForward('/download-map');
	}

	getMapInfoText(mapId: string): string {
		const downloadProgressionData = this.downloadProgressions.find(d => d.offlineMapMetaData.id === mapId);
		const metaData = this.offlineMaps.find(m => m.id === mapId);

		if (!downloadProgressionData) {
			const date = new Date(metaData.downloadDate);
			return `Oppdatert: ${date.toLocaleDateString('nb-NO')}`;
		} else if (this.getDownloadCompletionRate(mapId) < 1) {
			return 'Laster ned';
		} else if (this.getDownloadCompletionRate(mapId) === 1) {
			return 'Klargjør kart';
		}
	}

	private setSelectedMapName(): void {
		if (this.selectedMapId && this.offlineMaps.length > 0) {
			this.newMapName = this.offlineMaps.find(om => om.id === this.selectedMapId).name;
			return;
		}

		this.newMapName = '';
	}

	private async setOfflineMaps(): Promise<void> {
		return this.mapService.getOfflineMapsMetaData().then(res => {
			if (res) {
				this.offlineMaps = res.filter(m => !m.deleted).sort(this.sortFunction);
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
