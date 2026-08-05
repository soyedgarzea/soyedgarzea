'use client';

import { useId, useRef } from 'react';
import type { ProductReviewDialogProps } from './product-review-dialog.types';

export function ProductReviewDialog({ locale, productName, review }: ProductReviewDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const es = locale === 'es';

  return (
    <>
      <button
        aria-haspopup='dialog'
        className='review-preview'
        onClick={() => dialogRef.current?.showModal()}
        type='button'
      >
        <span>{review}</span>
        <strong>{es ? 'Leer reseña completa →' : 'Read full review →'}</strong>
      </button>

      <dialog
        aria-labelledby={titleId}
        className='review-dialog'
        onClick={event => {
          if (event.target === event.currentTarget) {
            event.currentTarget.close();
          }
        }}
        ref={dialogRef}
      >
        <div className='review-dialog-content'>
          <form method='dialog'>
            <button
              aria-label={es ? 'Cerrar reseña' : 'Close review'}
              type='submit'
            >
              ×
            </button>
          </form>
          <p className='eyebrow'>{es ? 'Reseña completa' : 'Full review'}</p>
          <h2 id={titleId}>{productName}</h2>
          <p>{review}</p>
        </div>
      </dialog>
    </>
  );
}
