import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceHolderDirective } from "../shared/placeholder/placeholder.directive";
import { Store } from "@ngrx/store";

import * as fromApp from '../store/app.reducer';
import * as AuthActions from './store/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy{
    isLoginMode = true;
    isLoading = false;
    error: string = null;

    @ViewChild(PlaceHolderDirective) alertHost: PlaceHolderDirective;

    private closeSub: Subscription;
    private storeSub: Subscription;


    constructor(
       private componentFactoryResolver: ComponentFactoryResolver,
       private store: Store<fromApp.AppState>){}


    ngOnInit(): void {
     this.storeSub =  this.store.select('auth').subscribe(authState => {
        this.isLoading = authState.loading;
        this.error = authState.authError;
        if(this.error){
          this.showErrorAlert(this.error);
        }
      });
    }


    onHandleError(){
        this.store.dispatch(new AuthActions.ClearError());
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

        if(this.isLoginMode){
           //authObservable = this.authService.login(email,password);
           this.store.dispatch(new AuthActions.LoginStart({email: email,password: password}));
        }
        else{
            //authObservable = this.authService.signup(email,password);
            this.store.dispatch(new AuthActions.SignupStart({email: email,password: password}));
        }

        // authObservable.subscribe(
        //     (response) => {
        //     console.log(response);
        //     this.isLoading = false;
        //     this.router.navigate(['/recipes']);
        //     },
        //     (errorMessage) => {
        //         console.log(errorMessage);
        //         this.error = errorMessage;
        //         this.showErrorAlert(errorMessage);
        //         this.isLoading = false;
        //     }
        // );

        form.reset();
    }


    ngOnDestroy(){
      if(this.closeSub){
           this.closeSub.unsubscribe();
      }

      if(this.storeSub){
        this.storeSub.unsubscribe();
      }
    }
}
