import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { AppService } from '../app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    validateForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private msg: NzMessageService,
        private appSrv: AppService,
        private router: Router
    ) {}

    ngOnInit(): void {
        if(sessionStorage.getItem('m5-token') != null) {
            this.router.navigateByUrl('/admin');
            return;
        }
        if(localStorage.getItem('__m5_account') && localStorage.getItem('__m5_password')) {
            this.validateForm = this.fb.group({
                username: [localStorage.getItem('__m5_account'), [Validators.required]],
                password: [localStorage.getItem('__m5_password'), [Validators.required]]
            });
        } else {
            this.validateForm = this.fb.group({
                username: ['', [Validators.required]],
                password: ['', [Validators.required]]
            });
        }
    }

    submitForm(): void {
        if(!this.validateForm.valid) {
            this.msg.error('用户名和账号不能为空');
            return;
        }
        let payload = {
            username: this.validateForm.value['username'],
            password: this.validateForm.value['password']
        }
        let loading = this.msg.loading('正在登陆');
        this.appSrv.login(payload).subscribe(res => {
            if(res.code === 1) {
                sessionStorage.setItem('m5-token', res.data);
                this.msg.remove(loading.messageId);
                this.router.navigateByUrl('/admin');

                localStorage.setItem('__m5_account', this.validateForm.value['username']);
                localStorage.setItem('__m5_password', this.validateForm.value['password']);

                return;
            }
            this.msg.error('用户名或密码错误,登陆失败');
        }, err => this.msg.error('登陆失败'));
        this.router.navigateByUrl('/admin');
    }

}