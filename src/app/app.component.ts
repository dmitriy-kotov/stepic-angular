import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FormsModule, NgForm} from "@angular/forms";
import { CommonModule } from "@angular/common";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  onSubmit(form: NgForm) {
    console.log(`Вы ввели имя ${form.value.firstField}, а так же email ${form.value.email} in form "${form.name}"`);
    alert(`Вы ввели имя ${form.value.firstField}, а так же email ${form.value.email} in form "${form.name}"`);
  };
}
