import { DeviceInputModel } from './../../models/deviceInput';
import { Component, OnInit, Input } from '@angular/core';
import { DbHelper } from '../../../services/dbHelper';
import { NgForm, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';





@Component({
    selector: 'deviceInput-selector',
    templateUrl: 'deviceInput.html'

})
export class DeviceInputComponent implements OnInit {
    deviceInputs: Array<DeviceInputModel> = [];
    deviceInput: DeviceInputModel;
    pages = 1;
    pagesNum;
    pageSize = 8;
    selPage: any = 1;
    isdisbleNext = false;
    isdisablePre = false;
    buttonLabel = 'Add';
    ngOnInit() {
        this.calulatePages();
    }
    private async comInit() {
        this.disableNextPre();
        this.dbHelper.selectDeviceInputes(this.pageSize, this.selPage).then(result => {
            this.deviceInputs = result;
        });
    }

    private async calulatePages() {
        this.pagesNum = [];
        let recNum = await this.dbHelper.getCount('DeviceInput');
        if (recNum > 0) {
            this.pages = Math.floor(recNum / this.pageSize);
            if ((recNum % this.pageSize) > 0) {
                this.pages++;
            }
        }
        for (let i = 1; i <= this.pages; i++) {
            this.pagesNum.push(i);
        }
        this.comInit();
    }

    constructor(private dbHelper: DbHelper) {
        this.deviceInput = new DeviceInputModel();
    }

    private async onSubmit(form: NgForm) {
        if (form.valid) {
            if (this.deviceInput.id === undefined || this.deviceInput.id === 0) {
                let firstFieldCheck = await this.dbHelper.isUnique('hostname', 'DeviceInput', this.deviceInput.hostName);
                if (firstFieldCheck) {
                    alert('the Hostname should be unique.');
                    return;
                }
                let seconFieldCheck = await this.dbHelper.isUnique('loopback0_ipv4', 'DeviceInput', this.deviceInput.loopback0_ipv4);
                if (seconFieldCheck) {
                    alert('the Loopback should be unique.');
                    return;
                }
            }
            this.dbHelper.insert(this.deviceInput).then((result) => {
                if (result) {
                    this.calulatePages();
                    this.deviceInput = new DeviceInputModel();
                    form.reset();
                    this.buttonLabel = 'Add';
                }
            });
        }
    }

    private pageChanged(event) {
        // this.selPage = Number(event.target.value);
        this.comInit();
    }

    private valueChanged(newValue) {
        let nval = parseInt(newValue);
        if (nval.toString() !== 'NaN') {
            this.pageSize = nval;
            this.calulatePages();
            this.selPage = 1;
        }
    }

    private changPage(dirction) {
        if (dirction === 'pervious') {
            if (this.selPage > 1) {
                this.selPage--;
                this.comInit();
            }
        } else {
            if (this.selPage < this.pages) {
                this.selPage++;
                this.comInit();
            }
        }
    }

    private disableNextPre() {
        this.isdisablePre = false;
        this.isdisbleNext = false;
        if (this.selPage === 1) {
            this.isdisablePre = true;
        }
        if (this.selPage === this.pages) {
            this.isdisbleNext = true;
        }
    }

    private deleteDeviceInput(item) {
        this.dbHelper.deleteItem(item).then(x => {
            this.calulatePages();
        });
    }

    private editAnItem(item) {
        let model = new DeviceInputModel();
        model.id = item.id;
        model.hostName = item.hostName;
        model.loopback0_ipv4 = item.loopback0_ipv4;
        this.deviceInput = model;
        this.buttonLabel = 'Update';
    }

    private clearItem() {
        this.deviceInput = new DeviceInputModel();
        this.buttonLabel = 'Add';
    }
}
