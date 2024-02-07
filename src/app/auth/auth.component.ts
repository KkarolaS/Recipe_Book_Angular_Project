import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isLoggingMode = false;
  logForm: FormGroup;
  isLogging = false;
  error: string = null;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoggingMode = !this.isLoggingMode;
  }

  ngOnInit(): void {
    this.logForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    const email = this.logForm.value['email'];
    const password = this.logForm.value['password'];
    this.isLogging = true;

    let authObs: Observable<AuthResponseData>;

    if (this.isLoggingMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLogging = false;
        this.router.navigate(['/recipes']);
      },
      (error) => {
        console.log(error);

        this.error = error;
        this.isLogging = false;
      }
    );

    this.logForm.reset();
  }
}
