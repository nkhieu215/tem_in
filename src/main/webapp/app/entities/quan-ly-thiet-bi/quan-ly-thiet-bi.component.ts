import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { AccountService } from 'app/core/auth/account.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

@Component({
  selector: 'jhi-quan-ly-thiet-bi',
  templateUrl: './quan-ly-thiet-bi.component.html',
  styleUrls: ['./quan-ly-thiet-bi.component.scss'],
})
export class QuanLyThietBiComponent implements OnInit {
  listOfGroupMachineURL = this.applicationConfigService.getEndpointFor('api/scan-group-machines');
  listOfMachineURL = this.applicationConfigService.getEndpointFor('api/scan-machines');
  listOfMachineAddURL = this.applicationConfigService.getEndpointFor('api/nhom-thiet-bi');
  addNewMachineURL = this.applicationConfigService.getEndpointFor('api/scan-machines');
  getListOfMachineURL = this.applicationConfigService.getEndpointFor('api/nhom-thiet-bi');
  predicate!: string;
  ascending!: boolean;
  itemsPerPage = ITEMS_PER_PAGE;
  page?: number;

  popupThemMoiNhomThietBi = false;
  popupNhomThietBi = false;
  popupThemMoiThietBi = false;
  popupConfirmSave = false;
  popupConfirmSave2 = false;
  popupConfirmSave3 = false;
  popupConfirmSave4 = false;
  popupConfirmDelete = false;

  // formSearch = this.formBuilder.group({
  //   groupName: '',
  //   createedAt: '',
  //   updatedAt: '',
  //   username: '',
  //   groupStatus: '',
  // });
  // acount
  account: any;
  currentDate: Date = new Date();
  @Input() groupId = '';
  @Input() groupName = '';
  @Input() createAt = this.currentDate;
  @Input() updatedAt = this.currentDate;
  @Input() userName = '';
  @Input() groupStatus = 0;
  @Input() machineId = '';
  @Input() machineName = '';
  @Input() statusMachine = '';
  @Input() itemPerPage = 10;
  @Input() itemPerPageThietBiAdd = 10;
  @Input() itemPerPageThietBi = 10;
  @Input() itemPerPageThietBiKhaiBao = 10;

  @Input() statusName = '';
  //list goi y
  listUsername: any[] = [];
  listOfNameGroupMachine: any[] = [];
  // quản lý thiết bị
  listOfGroupMachine: any[] = [];
  listOfGroupMachineAdd: any[] = [];
  groupMachine: any;
  // Thiet bi
  listOfMachines: any[] = [];
  listOfMachineAdd: any[] = [];
  machines: any;
  selectedMachines: any[] = [];
  // sharedSelectedMachines: any[] = []
  // listOfMachinesInGroup: any[] = []

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected modalService: NgbModal,
    protected formBuilder: FormBuilder,
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,

    protected accountService: AccountService
  ) {}

  loadPage(page?: number, dontNavigate?: boolean): void {
    // this.isLoading = true;
    // const pageToLoad: number = page ?? this.page ?? 1;
    // this.lenhSanXuatService
    //   .query({
    //     page: pageToLoad - 1,
    //     size: this.itemsPerPage,
    //   })
    //   .subscribe({
    //     next: (res: HttpResponse<ILenhSanXuat[]>) => {
    //       this.isLoading = false;
    //       this.onSuccess(res.body, res.headers, pageToLoad, !dontNavigate);
    //     },
    //     error: () => {
    //       this.isLoading = false;
    //       this.onError();
    //     },
    //   });
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      this.account = account;
      // console.log('acc', this.account);
    });
    this.http.get<any>(this.listOfGroupMachineURL).subscribe(res => {
      this.listOfGroupMachine = res;
      this.listOfNameGroupMachine = res;
      for (let i = 0; i < this.listOfGroupMachine.length; i++) {
        this.listOfGroupMachine[i].statusName = this.listOfGroupMachine[i].groupStatus === 1 ? 'Active' : 'Deactive';
      }
      const map = new Map();
      this.listOfGroupMachine.map(s => map.set(s.username, { Name: s.username }));
      this.listUsername = Array.from(map.values());
      // console.log('TB', this.listUsername);
    });

    // this.listOfMachinesInGroup = this.sharedSelectedMachines
  }
  // tim kiem function
  search(): void {
    this.listOfGroupMachine = this.listOfNameGroupMachine.filter(
      item => item.groupName.includes(this.groupName) && item.username.includes(this.userName) && item.statusName.includes(this.statusName)
    );
  }
  //Cập nhật trạng thái khi thêm mới nhóm thiết bị
  updateStatus(): void {
    this.groupStatus = this.statusName === 'Active' ? 1 : 0;
  }

  openPopupThemMoiNhomThietBi(): void {
    this.popupThemMoiNhomThietBi = true;

    // this.http.post<any>(this.listOfGroupMachineURL, this.listOfGroupMachineAdd).subscribe(() => {
    //   console.log('them moi nhom thiet bi', this.listOfGroupMachineAdd);
    // });

    // this.http.post<any>(this.listOfGroupMachineURL, this.listOfGroupMachineAdd).subscribe(() => {
    //   // console.log("them moi nhom thiet bi", this.listOfGroupMachineAdd)
    // })
  }

  closePopupThemMoiNhomThietBi(): void {
    this.popupThemMoiNhomThietBi = false;
  }

  openPopupNhomThietBi(groupId: any): void {
    this.popupNhomThietBi = true;
    //hàm trả về giá trị index của phần tử chứa thông tin group id truyền vào
    const index = this.listOfGroupMachine.findIndex(item => item.groupId === groupId);
    console.log('index', index);

    // trả về thông tin phần tử tại vị trí  index
    this.groupMachine = this.listOfGroupMachine[index];
    console.log('nhom machine:', this.groupMachine);

    this.http.get<any>(`${this.listOfMachineURL}/${groupId as string}`).subscribe(res => {
      this.listOfMachines = res;
      // console.log('machine', this.listOfMachines);
    });
  }

  closePopupNhomThietBi(): void {
    this.popupNhomThietBi = false;
  }

  openPopupThemMoiThietBi(): void {
    this.listOfMachineAdd = [];
    this.popupThemMoiThietBi = true;
    this.http.get<any>(this.listOfMachineAddURL).subscribe(res => {
      this.listOfMachineAdd = res;
      console.log('machine:', res);
    });
  }

  closePopupThemMoiThietBi(): void {
    this.popupThemMoiThietBi = false;
  }

  openPopupConfirmSave(): void {
    this.popupConfirmSave = true;
  }

  closePopupConfirmSave(): void {
    this.popupConfirmSave = false;
  }

  openPopupConfirmSave2(): void {
    this.popupConfirmSave2 = true;
  }

  closePopupConfirmSave2(): void {
    this.popupConfirmSave2 = false;
  }

  openPopupConfirmSave3(): void {
    this.popupConfirmSave3 = true;
  }

  closePopupConfirmSave3(): void {
    this.popupConfirmSave3 = false;
  }

  openPopupConfirmSave4(): void {
    this.popupConfirmSave4 = true;
  }

  closePopupConfirmSave4(): void {
    this.popupConfirmSave4 = false;
  }

  openPopupConfirmDelete(): void {
    this.popupConfirmDelete = true;
  }

  closePopupConfirmDelete(): void {
    this.popupConfirmDelete = false;
  }

  updateSelectedMachines(machine: any, event: any): void {
    if (event.target.checked) {
      this.selectedMachines.push(machine);
    } else {
      this.selectedMachines = this.selectedMachines.filter(m => m.id !== machine.id);
    }
    console.log('select', this.selectedMachines);
  }

  saveSelectedMachines(): void {
    this.listOfMachines = this.selectedMachines.map(machine => ({
      groupId: this.groupId,
      machineId: machine.id,
      machineName: machine.maThietBi,
    }));
    this.closePopupThemMoiThietBi();
    this.closePopupConfirmSave3();
    console.log('list machine', this.listOfMachines);
  }

  isMachineSelected(machine: any): any {
    // console.log('machine', machine.machineId)
    return this.selectedMachines.some(m => m.id === machine.id);
  }
  // cập nhật thông tin nhóm thiết bị
  updateGroupMachine(): void {
    console.log('tesst', this.groupMachine);
    const currentTime = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.groupMachine.updateAt = currentTime;
    this.groupMachine.username = this.account.login;
    //api cập nhật thông tin nhóm thiết bị
    this.http.put<any>(this.listOfGroupMachineURL, this.groupMachine).subscribe(() => {
      alert('update thành công');
    });
  }

  addNewGroupMachine(): void {
    const dataToSend = {
      groupName: this.groupName,
      createAt: this.currentDate,
      updateAt: this.currentDate,
      username: this.account.login,
      groupStatus: this.groupStatus,
      thietBis: this.listOfMachines,
    };
    this.http.post<any>(this.listOfGroupMachineURL, dataToSend).subscribe(res => {
      console.log('them moi nhom thiet bi', res);
      this.groupId = res;
    });
    this.popupConfirmSave2 = false;
  }

  addNewMachine(): void {
    this.http.post<any>(this.addNewMachineURL, this.listOfMachines).subscribe(() => {
      console.log('them moi thiet bi', this.listOfMachines);
    });
    // window.location.reload();
  }

  updateMachine(): void {
    const currentTime = formatDate(Date.now(), 'yyyy-MM-dd HH:mm:ss', 'en-US');
    this.machines.updateAt = currentTime;
    this.machines.username = this.account.login;
    this.http.put<any>(this.addNewMachineURL, this.machines).subscribe(() => {
      alert('update thành công');
    });
  }
}
