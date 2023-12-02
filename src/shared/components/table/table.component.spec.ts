import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../services/product.service';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const productServiceMock = {
    getProducts: jasmine.createSpy('getProducts').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load table data on init', () => {
    const testData = [
      {
        id: '1',
        name: 'Product 1',
        description: 'Description 1',
        logo: 'url',
        date_release: new Date(),
        date_revision: new Date(),
      },
      {
        id: '2',
        name: 'Product 2',
        description: 'Description 2',
        logo: 'url',
        date_release: new Date(),
        date_revision: new Date(),
      },
    ];

    productServiceMock.getProducts.and.returnValue(of(testData));

    component.ngOnInit();

    expect(component.originalTableData).toEqual(testData);
    expect(component.tableData).toEqual(testData);
  });

  it('should set current page', () => {
    const page = 2;
    component.setCurrentPage(page);
    expect(component.currentPage).toEqual(page);
  });

  it('should handle page size change', () => {
    const newPageSize = 10;
    component.onPageSizeChange(newPageSize);
    expect(component.pageSize).toEqual(newPageSize);
    expect(component.currentPage).toEqual(1);
  });

  it('should close modal on closeModal', () => {
    component.closeModal();

    expect(component.isModalOpen).toBeFalse();
  });
});
