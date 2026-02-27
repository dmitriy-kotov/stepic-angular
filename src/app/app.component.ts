import { Component, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  deleteElementNumber: number = 0;
  content1 = 'Содержимое content 1';
  content2 = 'Содержимое content 2';
  content3 = 'Содержимое content 3';

  isVisible = true;
  templates: TemplateRef<any>[] = [];

  @ViewChild('template1') myTemplate1!: TemplateRef<any>;
  @ViewChild('template2') myTemplate2!: TemplateRef<any>;
  @ViewChild('template3') myTemplate3!: TemplateRef<any>;

  ngAfterViewInit() {
    this.templates = [this.myTemplate1, this.myTemplate2, this.myTemplate3];
  };

  public deleteElement(): void {
    if(this.deleteElementNumber > 0 && this.deleteElementNumber < 4) {
      this.templates.splice(this.deleteElementNumber - 1, 1);
    } else {
      alert("Число выходит за рамки от 1 до 3")
    }
  };

  changeVisible() {
    this.isVisible = !this.isVisible;
  };
}
