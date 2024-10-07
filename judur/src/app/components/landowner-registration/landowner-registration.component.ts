import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-landowner-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent], // Ensure ReactiveFormsModule is imported
  templateUrl: './landowner-registration.component.html',
  styleUrls: ['./landowner-registration.component.css']
})
export class LandownerRegistrationComponent {
  landDonationForm: FormGroup;
  selectedFile: File | null = null;
  user: any;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.landDonationForm = this.fb.group({
      description: ['', Validators.required],
      land_size: ['', [Validators.required, Validators.min(1)]],
      address: ['', Validators.required],
      proof_of_ownership: [null, Validators.required],
      status_id: [1, Validators.required]
    });

    this.user = this.authService.getUserData();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      this.landDonationForm.patchValue({ proof_of_ownership: this.selectedFile });
    }
  }

  onSubmit(): void {
    if (this.landDonationForm.invalid) {
      this.landDonationForm.markAllAsTouched();
      console.error('Form is invalid.');
      return;
    }

    const formData = new FormData();
    formData.append('description', this.landDonationForm.get('description')?.value);
    formData.append('land_size', this.landDonationForm.get('land_size')?.value);
    formData.append('address', this.landDonationForm.get('address')?.value);
    formData.append('status_id', this.landDonationForm.get('status_id')?.value);

    if (this.selectedFile) {
      formData.append('proof_of_ownership', this.selectedFile, this.selectedFile.name);
    }

    this.authService.donateLand(formData).subscribe(
      (response: any) => {
        console.log('Land donated successfully!', response);
        
        // SweetAlert2 for success message
        Swal.fire({
          icon: 'success',
          title: 'Land Donation Successful!',
          text: 'Your land donation has been submitted successfully.',
          confirmButtonText: 'View Donation History'
        }).then((result) => {
          if (result.isConfirmed) {
          
            this.router.navigate(['/donation-history']);
          }
        });
        
        this.landDonationForm.reset();
      },
      (error: any) => {
        console.error('Error donating land:', error);
        
        // SweetAlert2 for error message
        Swal.fire({
          icon: 'error',
          title: 'Land Donation Failed',
          text: 'An error occurred while donating land. Please try again.',
        });
      }
    );
  }
}
