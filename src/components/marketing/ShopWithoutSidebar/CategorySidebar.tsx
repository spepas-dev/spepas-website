import React, { useMemo } from 'react';

import { ShopFilters } from './useShopFilters';

type Props = Pick<
  ShopFilters,
  | 'selectedCategories'
  | 'toggleCategoryFilter'
  | 'total'
  | 'categoriesLoading'
  | 'orderedCategories'
  | 'isExpanded'
  | 'toggleCategory'
  | 'updateParams'
  | 'matchingCategoryIds'
>;

const CategorySidebar: React.FC<Props> = ({
  selectedCategories,
  toggleCategoryFilter,
  total,
  categoriesLoading,
  orderedCategories,
  isExpanded,
  toggleCategory,
  updateParams,
  matchingCategoryIds
}) => {
  const hasMatches = matchingCategoryIds.size > 0;
  const selectedSet = useMemo(() => new Set(selectedCategories), [selectedCategories]);

  // Build a map of category → parent for ancestor traversal
  const parentMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const cat of orderedCategories) {
      if (cat.parentCategoryId) map.set(cat.Category_ID, cat.parentCategoryId);
    }
    return map;
  }, [orderedCategories]);

  // All ancestor IDs that lead to a matching category (walk up the tree)
  const matchingAncestorIds = useMemo(() => {
    if (!hasMatches) return new Set<string>();
    const ids = new Set<string>();
    for (const catId of matchingCategoryIds) {
      let current = parentMap.get(catId);
      while (current) {
        ids.add(current);
        current = parentMap.get(current);
      }
    }
    return ids;
  }, [matchingCategoryIds, parentMap, hasMatches]);

  // Sort: matching categories (and their ancestors) first, then the rest
  const sortedCategories = useMemo(() => {
    if (!hasMatches) return orderedCategories;

    const matchingRootIds = new Set<string>();
    for (const cat of orderedCategories) {
      if (cat.depth === 0 && (matchingCategoryIds.has(cat.Category_ID) || matchingAncestorIds.has(cat.Category_ID))) {
        matchingRootIds.add(cat.Category_ID);
      }
    }

    const groups: { rootId: string; items: typeof orderedCategories }[] = [];
    let currentGroup: (typeof groups)[0] | null = null;

    for (const cat of orderedCategories) {
      if (cat.depth === 0) {
        currentGroup = { rootId: cat.Category_ID, items: [cat] };
        groups.push(currentGroup);
      } else if (currentGroup) {
        currentGroup.items.push(cat);
      }
    }

    groups.sort((a, b) => {
      const aMatch = matchingRootIds.has(a.rootId) ? 0 : 1;
      const bMatch = matchingRootIds.has(b.rootId) ? 0 : 1;
      return aMatch - bMatch;
    });

    return groups.flatMap((g) => g.items);
  }, [orderedCategories, matchingCategoryIds, matchingAncestorIds, hasMatches]);

  return (
    <aside className="w-72 shrink-0 hidden lg:block">
      <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>

        {/* All Categories button */}
        <button
          onClick={() => updateParams({ cat: '', page: '' })}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${
            selectedCategories.length === 0
              ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          {selectedCategories.length === 0 && (
            <svg
              className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary-600)]"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          )}
          <span className="text-left flex-1">All Categories</span>
          {total > 0 && selectedCategories.length === 0 && (
            <span className="shrink-0 text-xs text-gray-400">{total}</span>
          )}
        </button>

        {/* Loading skeleton */}
        {categoriesLoading && (
          <div className="space-y-1 mt-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-7 rounded-lg bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {/* Divider + label when matches exist */}
        {!categoriesLoading && hasMatches && (
          <div className="mt-2 mb-1 px-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-primary-500)]">
              Matching categories
            </p>
          </div>
        )}

        {/* Category tree */}
        {!categoriesLoading &&
          sortedCategories.map((cat, idx) => {
            const isSelected = selectedSet.has(cat.Category_ID);
            const isMatch = matchingCategoryIds.has(cat.Category_ID);
            const isAncestor = matchingAncestorIds.has(cat.Category_ID);
            const isChild = cat.depth > 0;
            const padLeft = 12 + cat.depth * 16;

            // Auto-expand ancestors that lead to matching categories
            const parentExpanded = cat.parentCategoryId
              ? isExpanded(cat.parentCategoryId) || matchingAncestorIds.has(cat.parentCategoryId)
              : true;
            if (cat.depth > 0 && cat.parentCategoryId && !parentExpanded) return null;

            // Show "Other categories" divider
            let showDivider = false;
            if (hasMatches && cat.depth === 0) {
              const isInMatchGroup = isMatch || isAncestor;
              if (!isInMatchGroup && idx > 0) {
                const prevRoot = sortedCategories.slice(0, idx).findLast((c) => c.depth === 0);
                if (
                  prevRoot &&
                  (matchingCategoryIds.has(prevRoot.Category_ID) || matchingAncestorIds.has(prevRoot.Category_ID))
                ) {
                  showDivider = true;
                }
              }
            }

            // Checkbox icon
            const checkbox = (
              <span
                className={`shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  isSelected
                    ? 'bg-[var(--color-primary-500)] border-[var(--color-primary-500)]'
                    : isMatch
                      ? 'border-[var(--color-primary-300)] bg-[var(--color-primary-50)]'
                      : 'border-gray-300'
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </span>
            );

            return (
              <React.Fragment key={cat.Category_ID}>
                {showDivider && (
                  <div className="mt-3 mb-1 px-3 border-t border-gray-100 pt-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">Other categories</p>
                  </div>
                )}

                {cat.isParent ? (
                  <div className={cat.depth === 0 ? 'mt-1' : ''}>
                    <button
                      onClick={() => {
                        toggleCategory(cat.Category_ID);
                        toggleCategoryFilter(cat.Category_ID);
                      }}
                      style={{ paddingLeft: padLeft, paddingRight: 12 }}
                      className={`w-full flex items-center gap-1.5 py-2 rounded-lg text-sm transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                          : isAncestor || isMatch
                            ? 'text-[var(--color-primary-700)] font-medium hover:bg-[var(--color-primary-50)]/50'
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {/* Expand/collapse chevron */}
                      <svg
                        className={`w-3 h-3 shrink-0 transition-transform ${
                          isAncestor || isMatch ? 'text-[var(--color-primary-400)]' : 'text-gray-400'
                        } ${isExpanded(cat.Category_ID) || isAncestor ? 'rotate-90' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2.5"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                      {checkbox}
                      <span
                        className={`flex-1 text-left truncate ${cat.depth === 0 ? 'font-medium' : ''}`}
                        title={cat.name}
                      >
                        {cat.name}
                      </span>
                      {cat.count > 0 && (
                        <span className="shrink-0 text-xs text-gray-400 font-normal">{cat.count}</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleCategoryFilter(cat.Category_ID)}
                    style={{ paddingLeft: padLeft, paddingRight: 12 }}
                    className={`w-full flex items-center gap-2 py-1.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                        : isMatch
                          ? 'bg-[var(--color-primary-50)] text-[var(--color-primary-600)] font-medium'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                    }`}
                  >
                    {isChild && checkbox}
                    <span className="text-left truncate flex-1" title={cat.name}>
                      {cat.name}
                    </span>
                    {isMatch && !isSelected && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-primary-500)] text-white">
                        ✓
                      </span>
                    )}
                    {!isMatch && cat.count > 0 && (
                      <span className="shrink-0 text-xs text-gray-400">{cat.count}</span>
                    )}
                  </button>
                )}
              </React.Fragment>
            );
          })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
