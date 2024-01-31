import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { QRCodeComponent } from '../qr-code-reader/qr-code-reader.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  public accomodation!: FormControl;
  public Form: FormGroup = this.fb.group({
    hotelId: this.auth.getHotelId(),
    reservationId: this.fb.control(null, [Validators.required]),
    surname: this.fb.control(null, [Validators.required])
  })

  @Output() Submit = new EventEmitter()

  onSubmit() {
    this.Submit.emit(this.Form.value);
  }

  public onQRCode() {

    // this.api.getQRCode().subscribe(console.log)
    const dialogRef = this.dialog.open(QRCodeComponent);
    dialogRef.componentInstance.onSuccessEvent.subscribe( (data: string) => {
      dialogRef.close();
    })
  
  }

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.accomodation = this.Form.get('accomodation') as FormControl;
  }

}
