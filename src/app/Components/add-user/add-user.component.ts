import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Shared/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  addUserForm:FormGroup;
  submitted:boolean = false;
  fileName:string = ''
  uploadedFile:any
  emailText: any ='';
  isEmailExists: boolean = false;

  constructor(private fb :FormBuilder,private _toastrService: ToastrService, private userService: UserService, private router: Router) { 
    this.addUserForm =  this.fb.group({
      firstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z ,]*$')]],
      lastName: ['', [Validators.required,Validators.pattern('^[a-zA-Z ,]*$')]],
      email: ['', [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phoneNumber: ['', [Validators.required,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      isActive: ['true', Validators.required],
      image: [],
    })
  }

  get f(){ return this.addUserForm.controls}

  ngOnInit(): void {
    
  }

  uploadAvatar(file:any){
    this.uploadedFile='';
    this.fileName =  file.target.files[0].name
    var temp = file.target.files[0].name;
    if(temp.includes('.png') || temp.includes('.jpg')) {
      this.uploadedFile = file.target.files[0];
    }else{
      this._toastrService.error('Only PNG or JPG or JPEG document is allowed')
  }
}

  submitUser(){
    this.submitted = true;
    console.log(this.addUserForm.value)
    if(this.addUserForm.valid){
    var userData = new FormData();
    userData.append('firstName',this.addUserForm.controls['firstName'].value);
    userData.append('lastName',this.addUserForm.controls['lastName'].value);
    userData.append('email',this.addUserForm.controls['email'].value);    
    userData.append('phoneNumber',this.addUserForm.controls['phoneNumber'].value);    
    userData.append('isActive',this.addUserForm.controls['isActive'].value);    
    userData.append('image',this.uploadedFile);
    this.userService.addUser(userData).subscribe((user:any) =>{
      console.log(user);
      if(user.status == 200){
        this._toastrService.success('User added successfully')
        this.router.navigate(['/'])
      }

    })
    }else{
      return;
    }   

  }

  checkEmailExist(){
    var email = this.addUserForm.controls['email'].value;
    var emailObj :any = {};
    emailObj.email = email;
    this.userService.checkEmailExists(emailObj).subscribe((user:any) =>{
      if(user.status == 200){
        this.isEmailExists = true;
        this.emailText = user.message;
      }else{
        this.isEmailExists = false;
        this.emailText = null;
      }
    })
  }

}
