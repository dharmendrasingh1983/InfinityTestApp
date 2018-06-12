import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-emp-create',
  templateUrl: './emp-create.component.html',
  styleUrls: ['./emp-create.component.css']
})
export class EmpCreateComponent implements OnInit {
  title: string;
  constructor() {
    this.title = 'Create Employee';
  }

  ngOnInit() {
    const source = of('Hello');
    // map to inner observable and flatten
    const example = source.pipe(map(val => ` ${val} word!` ));
    // output: 'Hello World!'
    const subscribe = example.subscribe(val => console.log(val));
  }

}
