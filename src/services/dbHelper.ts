import { DeviceInputModel } from './../app/models/deviceInput';
import { Injectable } from '@angular/core';
import { promise } from 'protractor';
import { log } from 'util';
import { resolve } from 'path';
import { truncate } from 'fs';
import { forEach } from '@angular/router/src/utils/collection';
import { InterfaceInputModel } from '../app/models/interfaceInput';




@Injectable()
export class DbHelper {
    db: any;
    databaseSync = null;
    constructor() {
        this.db = (<any>window).openDatabase('testDb', '1.0', 'InfinitLabTest', 1);
        this.CreateTable().then(X => { });
    }

    public getDb() {
        return this.db;
    }

    public insert(inputs: any): Promise<boolean> {
        return new Promise(r => {
            let query: string;
            let values = [];
            if (inputs.id === undefined || inputs.id === 0) {
                if (inputs instanceof DeviceInputModel) {
                    values = [inputs.hostName, inputs.loopback0_ipv4];
                    query = `Insert into DeviceInput(hostname,loopback0_ipv4) values(?,?);`;

                } else {
                    values = [inputs.deviceInputid, inputs.interface];
                    query = `Insert into InterfaceInput(deviceInputid,interface) values(?,?);`;
                }
            } else {
                if (inputs instanceof DeviceInputModel) {
                    values = [inputs.hostName, inputs.loopback0_ipv4, inputs.id];
                    query = `update DeviceInput set hostname=?, loopback0_ipv4=? where id=?;`;

                } else {
                    values = [inputs.interface, inputs.id];
                    query = `update InterfaceInput set interface=? where id=?;`;
                }
            }

            this.db.transaction(function (tx) {
                tx.executeSql(query, values, (data) => {
                    console.log('Device Input Data Inserted');
                    r(true);

                }, (tx, sqlError) => {
                    console.log(sqlError.message);
                    r(false);
                });
            });
        });


    }
    public getCount(tableName: string, id = 0): Promise<number> {
        return new Promise(r => {
            let result: Array<DeviceInputModel> = [];
            this.db.transaction(function (tx) {
                let query;
                if (id === 0) {
                    query = `select count(*) count from ${tableName} order by id`;
                } else {
                    query = `select count(*) count from ${tableName} where deviceInputid=${id} order by id`;
                }
                tx.executeSql(query, [], (tx, data) => {
                    console.log('Device Input Data Inserted');
                    let a = Number(data.rows[0].count);
                    r(a);
                }, (sqlError) => {
                    console.log(sqlError.message);
                    r(0);
                });
            });
        });
    }

    public selectDeviceInputes(pageSize: number, selPage: number): Promise<any> {
        return new Promise(r => {
            let result: Array<DeviceInputModel> = [];
            let start = pageSize * selPage - pageSize;

            this.db.transaction(function (tx) {
                tx.executeSql(`select  id, hostname, loopback0_ipv4 from
                 DeviceInput order by id  limit ${pageSize} offset ${start}`,
                    [], (tx, data) => {
                        console.log('Device Input Data Inserted');
                        let cnt = start + 1;
                        for (let i = 0; i < data.rows.length; i++) {
                            let model = new DeviceInputModel();
                            model.rowNumber = cnt++;
                            model.id = data.rows[i].id;
                            model.hostName = data.rows[i].hostname;
                            model.loopback0_ipv4 = data.rows[i].loopback0_ipv4;
                            result.push(model);
                        }

                        r(result);

                    }, (tx, sqlError) => {
                        console.log(sqlError.message);
                        r(result);
                    });
            });
        });
    }

    private async CreateTable() {
        return new Promise((x) => {
            this.db.transaction(function (tx) {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS DeviceInput (id integer primary key AUTOINCREMENT, hostname varchar(250),
            loopback0_ipv4 varchar(15));`, [],
                    function (sqlTx, sqlResult) {
                        if (sqlResult.rows.length === 0) {
                        }

                    },
                    function (sqlTransaction, sqlError) {
                        console.log(sqlError.message);
                        x(false);
                    });

                tx.executeSql(`CREATE TABLE IF NOT EXISTS InterfaceInput (id integer primary key AUTOINCREMENT, deviceInputid integer,
                interface varchar(15));`, [],
                    function (sqlTx, sqlResult) {
                        if (sqlResult.rows.length === 0) {
                            x(true);
                        }

                    },
                    function (sqlTransaction, sqlError) {
                        console.log(sqlError.message);
                        x(false);
                    });

                    tx.executeSql(`CREATE TABLE IF NOT EXISTS Employee (id integer primary key AUTOINCREMENT, firstName varchar(200),
                        lastName varchar(150),gender varchar(10), dateOfBirth datetime, phone varchar(10),email varchar(255),depId integer);`, [],
                            function (sqlTx, sqlResult) {
                                if (sqlResult.rows.length === 0) {
                                    x(true);
                                }
        
                            },
                            function (sqlTransaction, sqlError) {
                                console.log(sqlError.message);
                                x(false);
                            });
            });
        });

    }

    isUnique(fieldName: string, tableName: string, fieldValue: string): Promise<boolean> {
        return new Promise(r => {
            this.db.transaction(function (tx) {
                let query = `select count(*) count from ${tableName} where ${fieldName} like '${fieldValue}' COLLATE NOCASE`;
                tx.executeSql(query,
                    [], (tx, data) => {
                        console.log('selected Data');
                        let result = Number(data.rows[0].count);
                        r(result > 0);

                    }, (tx, sqlError) => {
                        console.log(sqlError.message);
                        r(false);
                    });
            });
        });
    }

    selectInterfaceInputes(pageSize: number, selPage: number, id: number): Promise<any> {
        return new Promise(r => {
            let result: Array<InterfaceInputModel> = [];
            let start = pageSize * selPage - pageSize;

            this.db.transaction(function (tx) {
                tx.executeSql(`select  InterfaceInput.id, interface, loopback0_ipv4 from
                InterfaceInput inner join DeviceInput on InterfaceInput.deviceInputid=DeviceInput.id
                where DeviceInput.id=${id} order by InterfaceInput.id
                 limit ${pageSize} offset ${start}`,
                    [], (tx, data) => {
                        console.log('Device Input Data Inserted');
                        let cnt = start + 1;
                        for (let i = 0; i < data.rows.length; i++) {
                            let model = new InterfaceInputModel();
                            model.rowNumber = cnt++;
                            model.id = data.rows[i].id;
                            model.interface = data.rows[i].interface;
                            model.loopback0_ipv4 = data.rows[i].loopback0_ipv4;
                            result.push(model);
                        }

                        r(result);

                    }, (tx, sqlError) => {
                        console.log(sqlError.message);
                        r(result);
                    });
            });
        });
    }
    deleteItem(item: any): Promise<any> {
        return new Promise(r => {
            let query: string;
            let query2: string;
            if (item instanceof DeviceInputModel) {
                query = `delete from DeviceInput where id=${item.id} `;
                query2 = `delete from InterfaceInput where deviceInputid=${item.id};`;
            } else {
                query = `delete from InterfaceInput where id=${item.id};`;
            }
            this.db.transaction(function (tx) {
                tx.executeSql(query,
                    [], (tx, data) => {
                        console.log('seccuss');
                        if (query2 === undefined) {
                            r(true);
                        }

                    }, (tx, sqlError) => {
                        console.log(sqlError.message);
                        r(false);
                    });
            });
            if (query2 !== undefined) {
                this.db.transaction(function (tx) {
                    tx.executeSql(query2,
                        [], (tx, data) => {
                            console.log('seccuss');
                            r(true);
                        }, (tx, sqlError) => {
                            console.log(sqlError.message);
                            r(false);
                        });
                });
            }

        });
    }
}

