import { Injectable } from '@angular/core';
import { FilesystemDirectory, FilesystemEncoding, Plugins, StatResult } from '@capacitor/core';
import { OfflineMapMetaData } from '../classes/OfflineMapMetaData';

const { Filesystem } = Plugins;

@Injectable({
	providedIn: 'root'
})
export class FileSystemService {

	private readonly FILESYSTEM_DIRECTORY = FilesystemDirectory.External;
	private readonly FILESYSTEM_ENCODING = FilesystemEncoding.UTF8;

	constructor() { }

	async readFile(path: string): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			Filesystem.readFile({
				directory: this.FILESYSTEM_DIRECTORY,
				path,
				encoding: this.FILESYSTEM_ENCODING
			}).then((res) => {
				resolve(JSON.parse(res.data) as OfflineMapMetaData);
			}).catch((err) => {
				reject(`Error while reading file: ${path}. ${err}`);
			});
		});

		return promise;
	}

	async readDirectory(path: string): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			Filesystem.readdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path,
			}).then((res) => {
				resolve(res.files);
			}).catch((err) => {
				reject(`Error while reading directory: ${path}. ${err}`);
			});
		});

		return promise;
	}

	async writeFile(path: string, data: any, recursive: boolean): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			Filesystem.writeFile({
				directory: this.FILESYSTEM_DIRECTORY,
				path,
				data: JSON.stringify(data),
				recursive,
				encoding: this.FILESYSTEM_ENCODING
			}).then((res) => {
				resolve(res);
			}).catch((err) => {
				reject(`Error while writing file: ${path}, with data: ${JSON.stringify(data)}. ${err}`);
			});
		});

		return promise;
	}

	async makeDirectory(path: string, recursive: boolean): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			Filesystem.mkdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path,
				recursive
			}).then((res) => {
				resolve(res);
			}).catch((err) => {
				reject(`Error while making directory: ${path}. ${err}`);
			});
		});

		return promise;
	}

	async removeDirectory(path: string, recursive: boolean): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			Filesystem.rmdir({
				directory: this.FILESYSTEM_DIRECTORY,
				path,
				recursive
			}).then((res) => {
				resolve(res);
			}).catch((err) => {
				reject(`Error while removing directory: ${path}. ${err}`);
			});
		});

		return promise;
	}

	async fileExists(path: string): Promise<boolean> {
		const promise = new Promise<boolean>((resolve, reject) => {
			Filesystem.stat({
				directory: this.FILESYSTEM_DIRECTORY,
				path
			}).then(() => {
				resolve(true);
			}).catch(() => {
				resolve(false);
			});
		});

		return promise;
	}

	async getFileStat(path: string): Promise<StatResult> {
		const promise = new Promise<StatResult>((resolve, reject) => {
			Filesystem.stat({
				directory: this.FILESYSTEM_DIRECTORY,
				path
			}).then((res) => {
				resolve(res);
			}).catch((err) => {
				reject(`Error while getting file stat: ${path}. ${err}`);
			});
		});

		return promise;
	}
}
