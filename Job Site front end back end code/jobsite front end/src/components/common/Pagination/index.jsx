import React from 'react';
import PropTypes from 'prop-types';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  EllipsisHorizontalIcon 
} from '@heroicons/react/24/outline';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  compact = false,
  className = '',
}) => {
  if (!totalPages || totalPages <= 1) return null;

  // Generate page range with ellipsis
  const generatePageNumbers = () => {
    const totalNumbers = siblingCount * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, 'ellipsis', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [firstPageIndex, 'ellipsis', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [firstPageIndex, 'ellipsis', ...middleRange, 'ellipsis', lastPageIndex];
    }
  };

  const pageNumbers = generatePageNumbers();

  const baseButtonClasses = 'flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const pageButtonClasses = (isActive) => 
    `min-w-10 h-10 rounded-2xl border-2 ${
      isActive
        ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-transparent shadow-md'
        : 'bg-white text-neutral-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
    }`;

  const navButtonClasses = (isDisabled) =>
    `px-4 py-2 rounded-2xl border-2 ${
      isDisabled
        ? 'text-neutral-400 border-amber-100 bg-amber-50/30'
        : 'text-amber-700 border-amber-200 bg-white hover:bg-amber-50 hover:border-amber-300'
    }`;

  const ellipsisClasses = 'min-w-10 h-10 flex items-center justify-center text-neutral-500';

  return (
    <nav 
      className={`flex items-center justify-between ${compact ? 'gap-2' : 'gap-4'} ${className}`} 
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <button
        className={`${baseButtonClasses} ${navButtonClasses(currentPage === 1)}`}
        aria-label="Previous page"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronLeftIcon className="w-4 h-4 mr-1" />
        {!compact && 'Previous'}
      </button>

      {/* Page Numbers */}
      <ul className="flex items-center gap-2 list-none p-0 m-0" role="list">
        {/* First Page (if enabled) */}
        {showFirstLast && currentPage > siblingCount + 2 && (
          <li>
            <button
              className={`${baseButtonClasses} ${pageButtonClasses(currentPage === 1)}`}
              onClick={() => onPageChange(1)}
              aria-label="Go to first page"
            >
              1
            </button>
          </li>
        )}

        {/* Page Numbers */}
        {pageNumbers?.map((pageNum, index) => {
          if (pageNum === 'ellipsis') {
            return (
              <li key={`ellipsis-${index}`}>
                <span className={ellipsisClasses} aria-hidden="true">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </span>
              </li>
            );
          }

          const page = Number(pageNum);
          const isActive = currentPage === page;

          return (
            <li key={page}>
              <button
                aria-current={isActive ? 'page' : undefined}
                className={`${baseButtonClasses} ${pageButtonClasses(isActive)}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Last Page (if enabled) */}
        {showFirstLast && currentPage < totalPages - siblingCount - 1 && (
          <li>
            <button
              className={`${baseButtonClasses} ${pageButtonClasses(currentPage === totalPages)}`}
              onClick={() => onPageChange(totalPages)}
              aria-label="Go to last page"
            >
              {totalPages}
            </button>
          </li>
        )}
      </ul>

      {/* Next Button */}
      <button
        className={`${baseButtonClasses} ${navButtonClasses(currentPage === totalPages)}`}
        aria-label="Next page"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        {!compact && 'Next'}
        <ChevronRightIcon className="w-4 h-4 ml-1" />
      </button>

      {/* Page Info (for accessibility) */}
      <div className="sr-only">
        Page {currentPage} of {totalPages}
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  compact: PropTypes.bool,
  className: PropTypes.string,
};

Pagination.defaultProps = {
  siblingCount: 1,
  showFirstLast: true,
  compact: false,
};

export default Pagination;