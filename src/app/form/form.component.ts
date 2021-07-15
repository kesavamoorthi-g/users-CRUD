import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { TAABLE_HEADER } from '../constants/select-options.constant';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  public tableHead :Array<string>;
  public userList: Array<object>;
  public editUser: boolean;
  public editType: boolean;
  public submitted :boolean;
  public userForm: FormGroup;
  public userID: string;
  public spinner :boolean;
  public showForm :boolean;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService
  ) {}
  ngOnInit(): void {
    this.editUser = false;
    this.tableHead=TAABLE_HEADER;
    this.userForm = this.formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
    });
    this.getUsers();
    this.userService.triggerAfterTypeAdd();
    this.userService.typeModalObserve.subscribe(() => {
      // this.typeList=[];
      // this.getUsers();
    });
  }
  /**
   * get form controls
   */
  public get formGet() {
    return this.userForm.controls;
  }
  /**
   * load form for edit
   */
  public onEdit(data: any) {
    this.editUser = true;
    this.editType = true;
    this.userID = data?.id;
    this.userForm.patchValue({
      firstname: data?.first_name,
      lastname: data?.last_name,
      email: data?.email,
      phone: data?.phone_number,
      password: data?.password,
      city: data?.city,
      state: data?.state,
      country: data?.country,
    });
  }
  /**
   * submit form
   */
  public onSubmit() {
    this.submitted = true;
    const newUser = {
      first_name: this.userForm.value.firstname,
      last_name: this.userForm.value.lastname,
      email: this.userForm.value.email,
      phone_number: this.userForm.value.phone,
      password: this.userForm.value.password,
      city: this.userForm.value.city,
      state: this.userForm.value.state,
      country: this.userForm.value.country,
    };
    let typeOperationFunction = this.userService.addUser(newUser);
    if (this.editType) {

      const updatedUser = {
        id: this.userID,
        first_name: this.userForm.value.firstname,
        last_name: this.userForm.value.lastname,
        email: this.userForm.value.email,
        phone_number: this.userForm.value.phone,
        password: this.userForm.value.password,
        city: this.userForm.value.city,
        state: this.userForm.value.state,
        country: this.userForm.value.country,
      };
      console.log(updatedUser);
      typeOperationFunction = this.userService.editUser(updatedUser);
    }
    typeOperationFunction.subscribe((response) => {
      console.log(response.message);
      this.toastr.success(response.message);
      this.userService.triggerAfterTypeAdd();
      this.getUsers();
      this.editUser = false;
    }),
      this.userForm.reset();
  }
    /**
   * get user list
   */
  public getUsers() {
    this.userList = [];
    this.spinner = true;
    this.userService.getUserList().subscribe((response) => {

      this.userList = response['data'];
      this.userService.triggerAfterTypeAdd();
      this.spinner = false;
    });
  }
  /**
   * Delete User
   * @param {number} id
   */
  public onDelete(id: number) {
    this.userService.deleteUser(id).subscribe((response) => {
      console.log(response.message);
      this.toastr.success(response.message);
      this.getUsers();
    });
  }
  /**
   * on modal clicked
   */
  onClick(){
    this.editUser=false;
    this.editType=false;
    this.userForm.reset();
  }
}
