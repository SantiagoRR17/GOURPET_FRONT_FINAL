import { Component, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { Authentication } from '../../services/authentication';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  constructor(private renderer: Renderer2, private authenticationService: Authentication, private router: Router) { }

  ngOnInit() {
    // Usa Renderer2 para añadir la clase de forma segura
    this.renderer.addClass(document.body, 'bg-gradient-primary');
  }

  onRegister(form: any): void {
    this.authenticationService.register(form.value).subscribe(
      (res) => {
        this.router.navigateByUrl('/login');
      }
    );
  }
}
