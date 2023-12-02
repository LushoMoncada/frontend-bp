import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  Observable,
  Subject,
  debounceTime,
  map,
  of,
  switchMap,
  takeUntil,
} from 'rxjs';
import { IdValidatorService } from '../../../shared/services/idValidator.service';
import { ProductService } from '../../../shared/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IProduct } from '../../../shared/models/product.model';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent {
  private idValidatorService = inject(IdValidatorService);
  private productService = inject(ProductService);
  private unsubscribe$ = new Subject();

  formGroup: FormGroup;
  revisionDate?: Date;
  editData: any;
  showEdit = false;

  constructor(
    private fb: FormBuilder,
    private activeteRoute: ActivatedRoute,
    private router: Router
  ) {
    this.formGroup = this.fb.group({
      id: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        [this.idValidator(this.idValidatorService)],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      date_release: ['', [Validators.required, this.dateReleaseValidator()]],
      date_revision: [{ value: '', disabled: true }],
    });

    this.formGroup
      .get('date_release')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value: any) => {
        const releaseDate = new Date(value);
        this.revisionDate = new Date(
          releaseDate.getFullYear() + 1,
          releaseDate.getMonth(),
          releaseDate.getDate() + 1
        );

        this.formGroup
          .get('date_revision')
          ?.setValue(this.revisionDate.toISOString().split('T')[0]);
      });
  }

  ngOnInit(): void {
    this.activeteRoute.paramMap.subscribe((params) => {
      const data = params.get('data');
      if (data) {
        this.showEdit = true;
        this.editData = JSON.parse(data);

        this.formGroup.patchValue({
          id: this.editData.id,
          name: this.editData.name,
          description: this.editData.description,
          logo: this.editData.logo,
          date_release: new Date(this.editData.date_release),
        });
      }
    });
  }

  private idValidator(
    idValidatorService: IdValidatorService
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;

      return of(id).pipe(
        debounceTime(500),
        switchMap((idValue) => idValidatorService.getVerification(idValue)),
        map((data) => (data ? { idExist: true } : null))
      );
    };
  }

  private dateReleaseValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const currentDate = new Date();
      const selectedDate = new Date(control.value);

      if (selectedDate <= currentDate) {
        return {
          dateReleaseInvalid: true,
        };
      }

      return null;
    };
  }

  getErrorMessage(fieldName: string, min?: string, max?: string): string {
    const fieldControl = this.formGroup.get(fieldName);
    const errorMessages: any = {
      idExist: 'El ID ya existe.',
      minlength: `Este campo debe tener ${min} y ${max} caracteres.`,
      maxlength: `Este campo debe tener ${min} y ${max} caracteres.`,
      required: 'Este es un campo requerido.',
      dateReleaseInvalid: 'La Fecha debe ser igual o mayor a la fecha actual',
    };

    if (!fieldControl?.errors) {
      return '';
    }

    const errorKey = Object.keys(fieldControl.errors)[0];
    return errorMessages[errorKey];
  }

  isInvalid(fieldName: string): boolean {
    const fieldControl = this.formGroup.get(fieldName);
    return fieldControl
      ? fieldControl.invalid && (fieldControl.dirty || fieldControl.touched)
      : false;
  }

  onCreateProduct() {
    if (this.formGroup.invalid) {
      return;
    }
    const { date_revision, ...params } = this.formGroup.value;

    this.productService
      .createProduct({
        ...params,
        date_revision: this.revisionDate?.toISOString().split('T')[0],
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe();
  }

  onEditProduct() {
    const { date_revision, ...params } = this.formGroup.value;

    this.productService
      .editProduct({
        ...params,
        date_revision: this.revisionDate?.toISOString().split('T')[0],
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  onResetForm(): void {
    this.formGroup.reset();
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
  }
}
