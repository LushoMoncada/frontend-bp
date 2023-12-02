import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { of, Subject } from 'rxjs';
import { ProductService } from '../../services/product.service';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  const productServiceMock = {
    deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit closeModalEvent on closeModal', () => {
    const closeModalEventSpy = spyOn(component.closeModalEvent, 'emit');
    component.closeModal();
    expect(closeModalEventSpy).toHaveBeenCalled();
  });

  it('should emit deleteData and closeModal on onDeleteProduct error', () => {
    const deleteDataSpy = spyOn(component.deleteData, 'emit');
    const closeModalEventSpy = spyOn(component.closeModalEvent, 'emit');
    const id = '1';

    productServiceMock.deleteProduct.and.returnValue(
      new Subject<any>().asObservable()
    );

    component.onDeleteProduct(id);

    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(id);
    expect(deleteDataSpy).toHaveBeenCalled();
    expect(closeModalEventSpy).toHaveBeenCalled();
  });
});
