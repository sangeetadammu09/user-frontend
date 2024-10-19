import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../Shared/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  userList:any = []
  userDeletedId: any;
  showUpdateModal:boolean = false;
  showDeleteModal: boolean= false;
  @ViewChild('closeDeleteModal') closeDeleteModal:any;
  @ViewChild('closeUpdateModal') closeUpdateModal:any;
  editUserForm:FormGroup;
  submitted:boolean = false;
  fileName:string = ''
  uploadedFile:any
  userId: string = '';
  previewImageUrl: any;
  emailText: any ='';
  isEmailExists: boolean = false;
  selectedUser: any = {};

  constructor(private userService: UserService, private toastrService : ToastrService, 
    private fb : FormBuilder, private _toastrService:ToastrService) { 
    this.editUserForm =  this.fb.group({
      firstName: ['', [Validators.required,Validators.pattern('^[a-zA-Z ,]*$')]],
      lastName: ['', [Validators.required,Validators.pattern('^[a-zA-Z ,]*$')]],
      email: ['', [Validators.required,  Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      phoneNumber: ['', [Validators.required,  Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      isActive: ['true', Validators.required],
      image: [],
    })
  }

  get f(){ return this.editUserForm.controls}

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList(){
    this.userService.getAllUsers().subscribe((users:any) => {
      console.log(users,'users')
      if(users.status ==200){
         this.userList = users.data
      }
    })
  }

  openUserModal(item:any){
    this.selectedUser = item;
  }

  openUpdateModal(item:any){
    console.log(item)
    this.previewImageUrl = item.imageUrl
    var fileName = item.avatar.split('/')[2];
    this.fileName = fileName;
    this.showUpdateModal = true;
    this.showDeleteModal = false;
    this.userId = item._id;
    
    this.editUserForm.patchValue({
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      phoneNumber: item.phoneNumber,
      isActive: JSON.stringify(item.isActive),

    })
   
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

  updateUser(){
    this.submitted = true;
    if(this.editUserForm.valid){
    var userData = new FormData();
    userData.append('firstName',this.editUserForm.controls['firstName'].value);
    userData.append('lastName',this.editUserForm.controls['lastName'].value);
    userData.append('email',this.editUserForm.controls['email'].value);    
    userData.append('phoneNumber',this.editUserForm.controls['phoneNumber'].value);    
    userData.append('isActive',this.editUserForm.controls['isActive'].value);    
    userData.append('image',this.uploadedFile);
    this.userService.updateUser(this.userId,userData).subscribe((user:any) =>{
      console.log(user);
      if(user.status == 200){
        this.uploadedFile='';
        this._toastrService.success('User updated successfully')
        this.getUserList();
        this.closeUpdateModal.nativeElement.click();
      }

    })
    }else{
      return;
    }   

  }

  openDeleteModal(user:any){
     this.userDeletedId = user._id;
     this.showUpdateModal = false;
     this.showDeleteModal = true;
  }


  deleteUser(){
     this.userService.deleteUser(this.userDeletedId).subscribe((user:any) => {
        if(user.status ==200){
          this.toastrService.success('User deleted successfully');
          this.closeDeleteModal.nativeElement.click();
          this.getUserList()
        }
     })
  }

  checkEmailExist(){
    var email = this.editUserForm.controls['email'].value;
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
