import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'], // Исправлено с styleUrl на styleUrls
})
export class AppComponent {
  subscription: Subscription | null = null;

  stream$ = new Observable<string>((observer) => {
    let counter = 0;
    const intervalId = setInterval(() => {
      observer.next(`stream ${counter++}`);
    }, 1000);

    // Функция очистки, вызываемая при отписке
    return () => {
      clearInterval(intervalId);
      console.log(`Интервал очищен, intervalId: ${intervalId}`);
    };
  });

  public startStream(): void {
    if (!this.subscription) {
      // Предотвращаем множественные подписки
      this.subscription = this.stream$.subscribe((data) => {
        console.log(data);
      });
      console.log('Поток запущен');
    }
  }

  public stopStream(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      console.log('Поток завершен');
    } else {
      console.log('Нет активного потока для завершения');
    }
  }
}
