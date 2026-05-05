import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface Alert {
  type: "success" | "danger" | "warning" | "info" | "primary" | "secondary" | "light" | "dark";
  message: string;
}

@Injectable({ providedIn: "root" })
export class NotificationService {
  private alertSubject = new BehaviorSubject<Alert | null>(null);
  alert$ = this.alertSubject.asObservable();

  show(type: Alert["type"], message: string, duration: number = 5000) {
    this.alertSubject.next({ type, message });
    if (duration > 0) {
      setTimeout(() => this.clear(), duration);
    }
  }

  success(message: string) {
    this.show("success", message);
  }

  error(message: string) {
    this.show("danger", message);
  }

  clear() {
    this.alertSubject.next(null);
  }
}
