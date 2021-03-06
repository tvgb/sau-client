import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Filesystem, FilesystemDirectory, FilesystemEncoding, KeyboardResize } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CheckableEarTag, EarTagInfo } from 'src/app/shared/classes/EarTagInfo';
import { SetEarTagInfos } from 'src/app/shared/store/sheepInfo.actions';
import { SheepInfoState } from 'src/app/shared/store/sheepInfo.state';
import { v4 as uuidv4 } from 'uuid';
import { Plugins} from '@capacitor/core';

const {Keyboard} = Plugins;

@Component({
	selector: 'app-ear-tag',
	templateUrl: './ear-tag.component.html',
	styleUrls: ['./ear-tag.component.scss'],
})
export class EarTagComponent implements OnInit {

	constructor(private formBuilder: FormBuilder, private store: Store, private platform: Platform) {
		this.newEarTagForm = this.formBuilder.group({
			owner: ['', Validators.required],
		});
	}

	@Input() formWidth: number;

	private earTagsPath = '/appData/earTags/';
	colour: string;
	pickingColour = false;
	coloursPicked: string[] = [];
	newEarTagForm: FormGroup;
	createNewEarTag = false;

	checkableEartags: CheckableEarTag[] = [];
	earTagsInfos: EarTagInfo[] = [];

	@Select(SheepInfoState.getEarTagInfos) earTagInfos$: Observable<EarTagInfo[]>;

	ngOnInit() {
		Filesystem.readFile({
			path: this.earTagsPath,
			directory: FilesystemDirectory.External,
		}).then(res => {
			this.earTagsInfos = res.data as unknown as EarTagInfo[];
			this.checkableEartags = this.earTagsInfos.map(earTagInfo => {
				return {
					...earTagInfo,
					isChecked: false
				};
			});
		}).catch(_ => {
			this.checkableEartags = [];
			this.earTagsInfos = [];
		});
	}

	ionViewWillEnter() {
		Keyboard.addListener('keyboardWillShow', () => {
			Keyboard.setResizeMode({mode: KeyboardResize.None});
		});
	}

	onColourPicked(): void {
		this.coloursPicked.push(this.colour);
		this.colour = undefined;
		this.pickingColour = false;
	}

	onCheckChange(checkableEartag: CheckableEarTag): void {
		checkableEartag.isChecked = !checkableEartag.isChecked;
		const checkedEarTags = this.checkableEartags.filter(earTag => earTag.isChecked).map(earTag => {
			return { id: earTag.id, owner: earTag.owner, colours: earTag.colours } as EarTagInfo;
		});
		this.store.dispatch(new SetEarTagInfos({earTagInfos: checkedEarTags}));
	}

	onSaveNewEarTagButtonClicked(): void {
		if (this.newEarTagForm.valid) {
			const newEarTag: EarTagInfo = {
				owner: this.newEarTagForm.controls.owner.value,
				colours: this.coloursPicked,
				id: uuidv4()
			};

			this.earTagsInfos.push(newEarTag);
			this.checkableEartags.push({...newEarTag, isChecked: false});
			this.saveNewEarTag(this.earTagsInfos);

			this.coloursPicked = [];
			this.newEarTagForm.reset();
			this.createNewEarTag = false;
		}
	}

	private saveNewEarTag(earTagInfo: EarTagInfo[]): void {
		Filesystem.writeFile({
			data: earTagInfo as any,
			path: this.earTagsPath,
			directory: FilesystemDirectory.External,
			encoding: FilesystemEncoding.UTF8,
			recursive: true
		});
	}

	pickedColourClicked(colour: string): void {
		this.coloursPicked = this.coloursPicked.filter(c => c !== colour);
	}
}
