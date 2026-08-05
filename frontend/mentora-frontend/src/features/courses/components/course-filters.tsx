import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Search } from 'lucide-react';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Button } from '@shared/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';
import { useDebounce } from '@shared/hooks/use-debounce';
import { useCoursesStore } from '../store';
import {
  courseFiltersSchema,
  courseCategoryLabels,
  courseSortLabels,
  defaultCourseFilters,
  type CourseFiltersValues,
} from '../schemas';

const ANY_CATEGORY = 'any';
const DEFAULT_SORT = 'default';

export function CourseFilters() {
  const filters = useCoursesStore((state) => state.filters);
  const setFilters = useCoursesStore((state) => state.setFilters);
  const resetFilters = useCoursesStore((state) => state.resetFilters);

  const form = useForm<CourseFiltersValues>({
    resolver: zodResolver(courseFiltersSchema),
    defaultValues: filters,
  });

  const search = form.watch('search');
  const category = form.watch('category');
  const priceMin = form.watch('priceMin');
  const priceMax = form.watch('priceMax');
  const sort = form.watch('sort');
  const debouncedSearch = useDebounce(search, 300);
  // Цену дебаунсим тем же образом, что и поиск (спецификация требует
  // debounce только для поля поиска, но текстовый ввод цены — тоже
  // keystroke-driven, без debounce каждая цифра слала бы отдельный запрос).
  const debouncedPriceMin = useDebounce(priceMin, 300);
  const debouncedPriceMax = useDebounce(priceMax, 300);

  // Живое обновление UI-стора фильтров: текстовый ввод (поиск, цена) — с
  // debounce ~300ms, выборы из Select — сразу. CourseGrid читает filters
  // из стора и триггерит перезапрос через TanStack Query (ключ кэша
  // меняется вместе с filters) — без ручного fetch/useEffect на стороне
  // server-state.
  useEffect(() => {
    setFilters({
      search: debouncedSearch,
      category,
      priceMin: debouncedPriceMin,
      priceMax: debouncedPriceMax,
      sort,
    });
  }, [debouncedSearch, category, debouncedPriceMin, debouncedPriceMax, sort, setFilters]);

  function handleReset() {
    form.reset(defaultCourseFilters);
    resetFilters();
  }

  return (
    <form
      className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-6"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="space-y-1.5 lg:col-span-2">
        <Label htmlFor="course-search">Поиск</Label>
        <div className="relative">
          <Search
            className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
            aria-hidden="true"
          />
          <Input
            id="course-search"
            placeholder="Название или описание курса"
            className="pl-9"
            {...form.register('search')}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="course-category">Категория</Label>
        <Select
          value={category || ANY_CATEGORY}
          onValueChange={(value) =>
            form.setValue(
              'category',
              value === ANY_CATEGORY ? '' : (value as CourseFiltersValues['category']),
            )
          }
        >
          <SelectTrigger id="course-category">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ANY_CATEGORY}>Все категории</SelectItem>
            {Object.entries(courseCategoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="course-price-min">Цена от</Label>
        <Input
          id="course-price-min"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          {...form.register('priceMin')}
        />
        {form.formState.errors.priceMin && (
          <p className="text-destructive text-xs">{form.formState.errors.priceMin.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="course-price-max">Цена до</Label>
        <Input
          id="course-price-max"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="1000"
          {...form.register('priceMax')}
        />
        {form.formState.errors.priceMax && (
          <p className="text-destructive text-xs">{form.formState.errors.priceMax.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="course-sort">Сортировка</Label>
        <Select
          value={sort || DEFAULT_SORT}
          onValueChange={(value) =>
            form.setValue('sort', value === DEFAULT_SORT ? '' : (value as CourseFiltersValues['sort']))
          }
        >
          <SelectTrigger id="course-sort">
            <SelectValue placeholder="По умолчанию" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={DEFAULT_SORT}>По умолчанию</SelectItem>
            {Object.entries(courseSortLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="lg:col-span-6">
        <Button type="button" variant="ghost" size="sm" onClick={handleReset}>
          Сбросить фильтры
        </Button>
      </div>
    </form>
  );
}
