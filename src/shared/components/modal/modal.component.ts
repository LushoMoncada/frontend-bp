import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  @Input() data: any;
  @Output() closeModalEvent = new EventEmitter();
  @Output() deleteData = new EventEmitter();

  private productService = inject(ProductService);
  private unsubscribe$ = new Subject();

  closeModal() {
    this.closeModalEvent.emit();
  }

  preventClosing(event: Event) {
    event.stopPropagation();
  }

  onDeleteProduct(id: string) {
    this.productService
      .deleteProduct(id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        error: () => {
          this.deleteData.emit();
          this.closeModal();
        },
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.complete();
  }
}
