import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  isLoggingMode = false;
  logForm: FormGroup;
  isLogging = false;

  constructor(private authService: AuthService) {}

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
    if (this.isLoggingMode) {
      //...
    } else {
      this.authService.signup(email, password).subscribe(
        (resData) => {
          console.log(resData);
          this.isLogging = false;
        },
        (error) => {
          console.error(error);
          this.isLogging = false;
        }
      );
    }
    this.logForm.reset();
  }
}
