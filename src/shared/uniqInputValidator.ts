import { promise } from 'protractor';
import { Validator, NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { Directive, HostBinding, ElementRef } from '@angular/core';


@Directive({
    selector: '[uniqInputValidate]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: UniqInputValidator,
        multi: true
    }]
})
export class UniqInputValidator implements Validator {
    constructor(private el: ElementRef) {

    }
    validate(c: AbstractControl): { [key: string]: any; } {
        let a = this.isVaid();
        if (!a) {
            return { 'uniqueVialation': true };
        }
        return null;
    }

    isVaid() {
        let a = this.el.nativeElement.attributes.TableAndField.value;
        // there may be write some unique key validate code,
        // but it will give many  requeests on database so i am not doing this,
        // so  i will check only on submit button.
        return true;
    }



}
