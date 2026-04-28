import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, Subscription, fromEvent, fromEventPattern } from 'rxjs';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  subscription: Subscription | null = null;

  // Создаём поток событий движения мыши
  stream$: Observable<MouseEvent> = fromEvent<MouseEvent>(
    document,
    'mousemove'
  );
  mouseMoveStream$: Observable<any> = fromEventPattern(
    (handler) => document.addEventListener('mousemove', handler),
    (handler) => {
      document.removeEventListener('mousemove', handler);
      console.log('"removeEventListener" have been called');
    }
  );

  // Объект для хранения координат мыши
  coordinates: { x: number; y: number } | null = null;

  public startStream(): void {
    if (!this.subscription) {
      // Предотвращаем множественные подписки
      // this.subscription = this.stream$.subscribe({
      this.subscription = this.mouseMoveStream$.subscribe({
        next: (event) => {
          this.coordinates = { x: event.clientX, y: event.clientY };
          console.log(`Координаты мыши: (${event.clientX}, ${event.clientY})`);
        },
        error: (err) => console.error('Ошибка потока:', err),
        complete: () => {
          console.log('Поток завершен');
          this.subscription = null; // Сбрасываем подписку после завершения
        },
      });
      console.log('Поток запущен');
    }
  }

  // Метод для остановки потока (опционально)
  public stopStream(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      console.log('Поток остановлен');
    }
  }

  // Отписываемся от потока при уничтожении компонента
  ngOnDestroy(): void {
    this.stopStream();
  }
}
