import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { AuthResponseData, AuthService } from "./auth.service";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;

    constructor(private authService: AuthService , private router: Router, private componentFactoryResolver: ComponentFactoryResolver){}


    onHandleError(){
        this.error = null;
    }

    showErrorAlert(message : string){

        const alertCompFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCompFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }


    onSwitchMode(){
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
        if(!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        this.isLoading = true;

        let authObservable: Observable<AuthResponseData>;

        if(this.isLoginMode){
           authObservable = this.authService.login(email,password);
        }
        else{
            authObservable = this.authService.signup(email,password);
        }

        authObservable.subscribe(
            (response) => {
            console.log(response);
            this.isLoading = false;
            this.router.navigate(['/recipes']);
            },
            (errorMessage) => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );

        form.reset();
    }


    ngOnDestroy(){
       if(this.closeSub){
           this.closeSub.unsubscribe();
       }
    }
}