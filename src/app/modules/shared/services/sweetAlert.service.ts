import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from '../auth/userInfoService';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class alert {
  //convert date enums




  public constructor(
    public router: Router,

  ) { }


  //api response alert
  responseAlert(text, icon) {
    Swal.fire({
      text: text,
      icon: icon
    })
  }

  opensweetalert() {
    Swal.fire({
      text: 'Hello!',
      icon: 'success'
    });
  }
  opensweetalertdng() {
    Swal.fire('Oops...', 'Something went wrong!', 'error')
  }


  FunctionByConfirm(val) {
    let value = val
    return value;
  }

  opensweetalertcst() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.value) {


        // this.FunctionByConfirm(true)

        // Swal.fire(
        //   'Deleted!',
        //   'Your imaginary file has been deleted.',
        //   'success'
        // )
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // this.FunctionByConfirm(false)

        // Swal.fire(
        //   'Cancelled',
        //   'Your imaginary file is safe :)',
        //   'error'
        // )
      }
    })
  }


  actionResponse(message, icon) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: message
    })

  }

  actionNotification(message, icon) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 10000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })

    Toast.fire({
      icon: icon,
      title: message
    })

  }

}
