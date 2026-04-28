import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observer, Observable, Subscription } from 'rxjs';

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
    // Предотвращаем множественные подписки
    if (!this.subscription) {
      const observer: Observer<string> = {
        next: (value: string) => {
          console.log(`value: ${value}`);
        },
        error: (error: any) => {
          console.log(`error: ${error}`);
        },
        complete: () => {
          console.log("'complete' has been called");
        },
      };
      // this.subscription = this.stream$.subscribe((data) => {
      //   console.log(data);
      // });
      this.subscription = this.stream$.subscribe(observer);
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
