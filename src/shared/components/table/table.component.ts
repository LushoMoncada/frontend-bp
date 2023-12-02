import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { IProduct } from '../../models/product.model';
import { iconMenu, tableHeaders } from './const';
import { ModalComponent } from '../modal/modal.component';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, RouterModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent {
  private productService = inject(ProductService);
  private unsubscribe$ = new Subject();
  readonly iconMenu = iconMenu;

  tableHeaders = tableHeaders;
  searchData: string = '';
  selectedRow?: IProduct;
  isModalOpen = false;
  trustedSvgContent;
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = 5;
  currentPage: number = 1;
  tableData: IProduct[] = [];
  originalTableData: IProduct[] = [];
  search: string = '';

  constructor(private sanitizer: DomSanitizer, private router: Router) {
    this.trustedSvgContent = this.sanitizer.bypassSecurityTrustHtml(
      this.iconMenu
    );
  }

  get startIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex(): number {
    return Math.min(
      this.startIndex + this.pageSize - 1,
      this.tableData.length - 1
    );
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.tableData.length / this.pageSize);
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  ngOnInit() {
    this.loadTableData();
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.currentPage = 1;
  }

  isDate(value: any): value is Date {
    return value instanceof Date;
  }

  loadTableData(): void {
    this.productService
      .getProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data && data.length) {
          const transformedData = data.map((product) => ({
            ...product,
            date_release: new Date(product.date_release),
            date_revision: new Date(product.date_revision),
          }));
          this.originalTableData = transformedData;
          this.tableData = this.originalTableData;
        }
      });
  }

  onSearch(): void {
    if (this.search.trim() === '') {
      this.tableData = [...this.originalTableData];
    } else {
      const searchTermLowerCase = this.search.toLowerCase();

      this.tableData = this.originalTableData.filter((item) =>
        this.containsKeyword(item, searchTermLowerCase)
      );
    }
  }

  containsKeyword(item: IProduct, searchTermLowerCase: string): boolean {
    return (
      item.name.toLowerCase().includes(searchTermLowerCase) ||
      item.description.toLowerCase().includes(searchTermLowerCase)
    );
  }

  onEditProduct(data: IProduct) {
    this.router.navigate(['/form', { data: JSON.stringify(data) }]);
  }

  openModal(data: IProduct) {
    this.selectedRow = data;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}
