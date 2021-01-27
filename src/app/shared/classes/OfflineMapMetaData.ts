import { Coordinate } from './Coordinate';

export class OfflineMapMetaData {
	id: string;
	name: string;
	size: number; // Size of map in bytes
	downloadDate: number;
	startPos: Coordinate; // Top left map coordinate [lat, lng]
	endPos: Coordinate; // Bottom right map coordinate [lat, lng]
	deleted: boolean;
	downloadFinished: boolean;
}
