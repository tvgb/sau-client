export class OfflineMapMetaData {
	name: string;
	size: number; // Size of map in bytes
	downloadDate: number;
	startLatLng: [number, number]; // Top left map coordinate [lat, lng]
	endLatLng: [number, number]; // Bottom right map coordinate [lat, lng]
}
