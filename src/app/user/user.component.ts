import { Component, OnInit } from '@angular/core';
import{FormBuilder,FormGroup, Validators} from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { UserModel } from './user-dashboard.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  formValue !: FormGroup;
  userModuleObj : UserModel = new UserModel();
  userData !: any;
  showAdd !: boolean;
  showUpdate !: boolean;
  constructor(private formbuilder: FormBuilder,
    private api : ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formbuilder.group({
      name : ['', Validators.required],
      surname : ['', Validators.required],
      birthday : ['', Validators.required],
      gender : ['', Validators.required],
      phoneNumber : ['', Validators.required]
    });
    this.getAllUsers();
  }

  get f() { return this.formValue.controls; }

  clickAddUser(){
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  onSubmit(){
    if (this.formValue.valid) {
      this.userModuleObj.name = this.formValue.value.name;
      this.userModuleObj.surname = this.formValue.value.surname;
      this.userModuleObj.birthday = this.formValue.value.birthday;
      this.userModuleObj.gender = this.formValue.value.gender;
      this.userModuleObj.phoneNumber = this.formValue.value.phoneNumber;

      this.api.postUser(this.userModuleObj)
      .subscribe(res =>{
        console.log(res);
        alert("User Added Successfully")
        let ref = document.getElementById('cancel') // form closes automaticaly thanks to this
        ref?.click();
        this.formValue.reset();
        this.getAllUsers();
      },
      err=>{
        alert("Something Went wrong");
      })
    } else {
      console.log("not valid")
    }
  }

  getAllUsers(){
    this.api.getUser()
    .subscribe(res=>{
      this.userData = res;
    })
  }

  deleteUser(row : any){
    // this.api.deleteUser(row.id)
    // .subscribe(res=>{
    //   alert("User Deleted");
    //   this.getAllUsers();
    // })
  }

  onEdit(row:any){
    this.showAdd = false;
    this.showUpdate = true;
    this.formValue.controls['name'].setValue(row.name)
    this.formValue.controls['surname'].setValue(row.surname)
    this.formValue.controls['birthday'].setValue(row.birthday)
    this.formValue.controls['gender'].setValue(row.gender)
    this.formValue.controls['phoneNumber'].setValue(row.phoneNumber)
  }

  updateUserDetails(){
    this.userModuleObj.id = this.formValue.value.id;
    this.userModuleObj.name = this.formValue.value.name;
    this.userModuleObj.surname = this.formValue.value.surname;
    this.userModuleObj.birthday = this.formValue.value.birthday;
    this.userModuleObj.gender = this.formValue.value.gender;
    this.userModuleObj.phoneNumber = this.formValue.value.phoneNumber;

    this.api.updateUser(this.userModuleObj,this.userModuleObj.id)
    .subscribe(res=>{
      console.log(res);
      alert("Updated Succesfully");
      let ref = document.getElementById('cancel') // form closes automaticaly thanks to this
      ref?.click();
      this.formValue.reset();
      this.getAllUsers();
    })
  } 
}