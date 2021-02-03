import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
	selector: 'app-colour-picker',
	templateUrl: './colour-picker.component.html',
	styleUrls: ['./colour-picker.component.scss'],
})
export class ColourPickerComponent implements AfterViewInit {

	@Input() width: number;
	@Input() height: number;

	@ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
	private ctx: CanvasRenderingContext2D;
	private selectedX: number;
	private selectedY: number;

	@Output() colour: EventEmitter<string> = new EventEmitter();
	@Output() colourPicked: EventEmitter<void> = new EventEmitter();

	constructor() { }

	ngAfterViewInit(): void {
		this.draw();
	}

	draw(): void {
		if (!this.ctx) {
			this.ctx = this.canvas.nativeElement.getContext('2d');
		}

		const width = this.canvas.nativeElement.width;
		const height = this.canvas.nativeElement.height;
		this.ctx.clearRect(0, 0, width, height);

		// Dette blir kanskje brukt i framtiden.
		// const white = this.ctx.createLinearGradient(0, 0, 0, height);
		// white.addColorStop(0, `rgba(255, 255, 255, 1)`);
		// white.addColorStop(0.3, `rgba(255, 255, 255, 0`);

		// const gradB = this.ctx.createLinearGradient(0, 0, 0, height);
		// gradB.addColorStop(0.7, `rgba(0, 0, 0, 0)`);
		// gradB.addColorStop(1, `rgba(0, 0, 0, 1)`);

		const gradient = this.ctx.createLinearGradient(0, 0, width, 0);

		const opacity = 0.7;

		gradient.addColorStop(0, `rgba(255, 0, 0, ${opacity})`);
		gradient.addColorStop(0.17, `rgba(255, 255, 0, ${opacity})`);
		gradient.addColorStop(0.34, `rgba(0, 255, 0, ${opacity})`);
		gradient.addColorStop(0.51, `rgba(0, 255, 255, ${opacity})`);
		gradient.addColorStop(0.68, `rgba(0, 0, 255, ${opacity})`);
		gradient.addColorStop(0.85, `rgba(255, 0, 255, ${opacity})`);
		gradient.addColorStop(1, `rgba(255, 0, 0, ${opacity})`);

		this.ctx.beginPath();

		this.ctx.fillStyle = gradient;
		// Dette også!
		// this.ctx.fillRect(0, 0, width, height);
		// this.ctx.fillStyle = white;
		// this.ctx.fillRect(0, 0, width, height);
		// this.ctx.fillStyle = gradB;
		// this.ctx.fillRect(0, 0, width, height);
		// this.ctx.globalCompositeOperation = 'mutliply';
		this.ctx.fillRect(0, 0, width, height);
		// this.ctx.globalCompositeOperation = 'source-over';
		this.ctx.closePath();

		if (this.selectedX && this.selectedY) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = 'white';
			this.ctx.lineWidth = 1;
			this.ctx.rect(this.selectedX - 10, this.selectedY - 10, 20, 20);
			this.ctx.stroke();
			this.ctx.closePath();
		  }
	}

	onPanMove(e: any): void {
		this.selectedX = e.srcEvent.offsetX;
		this.selectedY = e.srcEvent.offsetY;
		this.draw();
		this.emitColor(this.selectedX, this.selectedY);
	}

	onPanEnd(): void {
		this.colourPicked.emit();
	}

	emitColor(x: number, y: number): void {
		const rgbaColor = this.getColorAtPosition(x, y);
		this.colour.emit(rgbaColor);
	}

	getColorAtPosition(x: number, y: number): string {
		const imageData = this.ctx.getImageData(x, y, 1, 1).data;
		console.log('rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)');
		return 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
	}
}
