import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Feed } from './feed.service';
import Pusher from 'pusher-js';
@Injectable({
  providedIn: 'root'
})
export class PusherService {
  // declare const Pusher: any;

  private subject: Subject<Feed> = new Subject<Feed>();

  private pusherClient: Pusher;

  constructor() {
    this.pusherClient = new Pusher(environment.pusher.key, { cluster: environment.pusher.cluster });

    const channel = this.pusherClient.subscribe('realtime-feeds');

    channel.bind(
      'posts',
      (data: { title: string; body: string; time: string }) => {
        this.subject.next(new Feed(data.title, data.body, new Date(data.time)));
      }
    );
  }

  getFeedItems(): Observable<Feed> {
    return this.subject.asObservable();
  }
}