import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from 'src/app/student';
import { StudentService } from 'src/app/student.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-show-student-details',
  templateUrl: './show-student-details.component.html',
  styleUrls: ['./show-student-details.component.css']
})
export class ShowStudentDetailsComponent implements OnInit {
  config: any;
  collection = { count: 60, data: [] };

  isMasterSel: boolean;
  categoryList: any;
  checkedCategoryList: any;
  angForm: FormGroup;
  single_student_data: Student = new Student();
  student: Student = new Student();
  currentIndex = -1;
  page = 1;
  count = 60;
  pageSize = 3;
  // pageSizes = [3,6,9,12,15,18,21,24,27,30]
  offset: any;
  searchKey = "";
  totalRecord = 0;
  itemsperpage = "";

  constructor(public studentService: StudentService, public router: Router, private fb: FormBuilder) {
    this.isMasterSel = true;

    this.categoryList = [
      { id: 1, value: 'StudentId', isSelected: true },
      { id: 2, value: 'FirstName', isSelected: true },
      { id: 3, value: 'LastName', isSelected: true },
      { id: 4, value: 'BatchId', isSelected: true },
      { id: 5, value: 'Gender', isSelected: true },

    ];

    this.getCheckedItemList();
  }

  checkUncheckAll() {
    for (var i = 0; i < this.categoryList.length; i++) {
      this.categoryList[i].isSelected = this.isMasterSel;
    }
    this.getCheckedItemList();
  }

  onCheckboxSelect() {
    this.isMasterSel = this.categoryList.every(function (item: any) {
      return item.isSelected == true;
    })
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedCategoryList = [];
    for (var i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].isSelected)
        this.checkedCategoryList.push(this.categoryList[i].value);
    }
  }




  pageChanged(event) {
    this.page = event;
    this.getallStudentDetails();
  }

  ngOnInit(): void {
    this.getallStudentDetails();
    
  }
  getallStudentDetails() {

    this.offset = ((this.page - 1) * this.pageSize);
    this.studentService.getStudentDetails(this.offset, this.pageSize).subscribe((data: Student[]) => {
      this.collection.data = data;
    })
    this.getRecord();
  }

  getRecord() {

    this.studentService.getRecordCount().subscribe((rowCount: number) => {
      this.collection.count = rowCount;
    });
  }

  viewSingleStudentDetail(id: string) {
    this.studentService.getStudentById(id).subscribe((data) => {
      this.single_student_data = data;
    })
  }

  go(id: string) {
    this.router.navigate(['/ShowStudent/', id]);
  }

  deleteStudentDetails(id: string) {
    if (confirm("Are you sure to delete")) {
      this.studentService.deleteStudentDetails(id).subscribe(
        () => this.refreshComponent())
    }
  }

  refreshComponent() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/ShowStudentDetails']);
    });
  }

  // handlePageSizeChange(event: any) {
  //   this.pageSize = event.target.value;
  //   this.page = 1;
  //   this.getallStudentDetails();
  // }


  showSearch() {
    
    this.studentService.getStudentById(this.searchKey).subscribe((data) => {
      this.collection.data =  [data];
    })
  }



}
