import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  Observable,
  Observer,
  Subscription,
  fromEvent,
  fromEventPattern,
  throttleTime,
  scan,
} from 'rxjs';
import { JsonPipe } from '@angular/common';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnDestroy {
  subscription: Subscription | null = null;
  mouseClickedSubscription: Subscription | null = null;

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
  mouseClickedStream$: Observable<number> = fromEvent(document, 'click').pipe(
    throttleTime(1000),
    scan((count) => count + 1, 0)
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

      this.mouseClickedSubscription = this.mouseClickedStream$.subscribe(
        (count) => console.log(`Clicked ${count} times`)
      );
      this.subscription.add(this.mouseClickedSubscription);
    }
  }

  // Метод для остановки потока (опционально)
  public stopStream(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      console.log(`Поток остановлен, mouseClickedSubscription.closed: ${this.mouseClickedSubscription?.closed}`);
    }
  }

  // Отписываемся от потока при уничтожении компонента
  ngOnDestroy(): void {
    this.stopStream();
  }

  startMyExample() {
    console.log('On startMyExample()');
    const source$ = of(1, 2, 3, 4, 5).pipe(
      map((value) => {
        if (value === 3) {
          throw new Error('Ошибка при обработке значения 3');
        }
        return value * 2;
      }),
      catchError((error) => {
        console.error('Произошла ошибка:', error.message);
        // throw new Error(error);

        // return throwError(
        //   () => new Error('Ошибка обработана, создан новый поток без значений, но уже с "этой" ошибкой')
        // );

        // return of(3, 4, 'Ошибка обработана, поток продолжается');
        return of(-1, -2, -3 /*, 'Ошибка обработана, поток продолжается' */);
      })
    );

    // source$.subscribe((result) => {
    //   console.log(result);
    // });

    const observer: Observer<number> = {
      next: (value: number) => {
        console.log(`value: ${value}`);
      },

      error: (error: any) => {
        console.error(`error: ${error}`);
      },

      complete: () => {
        console.log("'complete' has been called");
      },
    };
    source$.subscribe(observer);

    console.log(`mouseClickedSubscription.closed: ${this.mouseClickedSubscription?.closed}`);
    this.mouseClickedSubscription?.unsubscribe();
  }
}
