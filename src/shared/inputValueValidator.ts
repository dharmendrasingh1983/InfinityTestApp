import { forEach } from '@angular/router/src/utils/collection';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';



@Directive({
    selector: '[appInputValidateor]',
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: InputValueValidator,
        multi: true
    }]
})
export class InputValueValidator implements Validator {
    validate(control: AbstractControl): { [key: string]: any; } {
        try {
            if (control.value === null || control.value === undefined) {
                return control.value;
            }
            let val = control.value as string;
            if (val.indexOf('Loopback') !== 0) {
                return { 'notMatch': 'initial' };
            }
            let chknum = val.replace('Loopback', '');
            let numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            if (chknum.length !== 3) { return { 'notMatch': 'numberes' }; }
            for (let i = 0; i < chknum.length; i++) {
                let ch = chknum[i];
                if (numArray.indexOf(ch) !== -1) {
                    if (i === 0) {
                        if (chknum[i] === '0') {
                            return { 'notMatch': 'numberes' };
                        }
                    }

                } else {
                    return { 'notMatch': 'numberes' };
                }
            }
        }
        catch (e) {
            let a = e;
        }

        return null;
    }

}
