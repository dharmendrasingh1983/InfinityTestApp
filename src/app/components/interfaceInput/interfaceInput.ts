
import { Component, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { InterfaceInputModel } from '../../models/interfaceInput';
import { DbHelper } from '../../../services/dbHelper';
import { NgForm } from '@angular/forms';




@Component({
    selector: 'interfaceInput-selector',
    templateUrl: 'interfaceInput.html'
})
export class InterfaceInputComponent {
    closeResult: string;
    @Input() deviceInput: any;
    interfacesInputs: Array<InterfaceInputModel> = [];
    interfaceInput: InterfaceInputModel = new InterfaceInputModel();;
    pages = 1;
    pagesNum;
    pageSize = 8;
    selPage: any = 1;
    isdisbleNext = false;
    isdisablePre = false;
    buttonLabel = 'Add';
    constructor(private modalService: NgbModal, private sqlHelper: DbHelper) {


    }

    // #region Popup Open
    private openDialog(content) {
        let item = this.deviceInput;
        this.interfaceInput.loopback0_ipv4 = item.loopback0_ipv4;
        this.interfaceInput.deviceInputid = item.id;
        this.calulatePages();
        this.modalService.open(content, { size: 'lg', backdrop: 'static' }).result.then((result) => {
            // Something to do
        }, (reason) => {
            // this.closeResult = this.getDismissReason(reason);
        });
    }

    // #endregion




    private async onSubmit(form: NgForm) {
        if (form.valid) {
            if (this.interfaceInput.id === undefined || this.interfaceInput.id === 0) {
                let firstFieldCheck = await this.sqlHelper.isUnique('interface', 'InterfaceInput', this.interfaceInput.interface);
                if (firstFieldCheck) {
                    alert('The Interface should be unique.');
                    return;
                }
            }
            this.sqlHelper.insert(this.interfaceInput).then(x => {
                this.calulatePages();
                let model = new InterfaceInputModel();
                model.deviceInputid = this.deviceInput.id;
                model.loopback0_ipv4 = this.deviceInput.loopback0_ipv4;
                this.interfaceInput = model;
                this.buttonLabel = 'Add';
                form.reset();
            });
        }
    }

    private calulatePages() {
        this.pagesNum = [];
        this.sqlHelper.getCount('InterfaceInput', this.deviceInput.id).then(x => {
            if (x > 0) {
                this.pages = Math.floor(x / this.pageSize);
                if ((x % this.pageSize) > 0) {
                    this.pages++;
                }
            }
            for (let i = 1; i <= this.pages; i++) {
                this.pagesNum.push(i);
            }
            this.comInit();
        });



    }
    private async comInit() {
        this.disableNextPre();
        this.sqlHelper.selectInterfaceInputes(this.pageSize, this.selPage, this.deviceInput.id).then(result => {
            this.interfacesInputs = result;
        });
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
            }
        } else {
            if (this.selPage < this.pages) {
                this.selPage++;
            }
        }
        this.comInit();
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
        this.sqlHelper.deleteItem(item).then(x => {
            this.calulatePages();
        });
    }

    private editAnItem(item) {
        let model = new InterfaceInputModel();
        model.id = item.id;
        model.interface = item.interface;
        model.loopback0_ipv4 = item.loopback0_ipv4;
        this.interfaceInput = model;
        this.buttonLabel = 'Update';
    }

    private clearItem() {
        let model = new InterfaceInputModel();
        model.deviceInputid = this.deviceInput.id;
        model.loopback0_ipv4 = this.deviceInput.loopback0_ipv4;
        this.interfaceInput = model;
        this.buttonLabel = 'Add';
    }
}


