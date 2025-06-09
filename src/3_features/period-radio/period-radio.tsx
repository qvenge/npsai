'use client';

import { useEffect, useState, useRef } from 'react';
import { usePeriod } from '@/shared/api';
import { CustomPeriod } from '@/shared/api/review/period';
import { Dropdown, Icon, Button } from '@/shared/ui';
import { CaretRightBold, CaretLeftBold } from '@/shared/ds/icons';
import styles from './period-radio.module.scss';

import Calendar from 'react-calendar';

// import 'react-calendar/dist/Calendar.css';
import './datepicker.scss';

type DateValuePiece = Date | null;

type DateValue = DateValuePiece | [DateValuePiece, DateValuePiece];

const periodsInit = {
  all: 'Все',
  week: 'Неделя',
  month: 'Месяц',
  year: 'Год',
  custom: 'Выбрать'
};

const customPeriodFormatter = new Intl.DateTimeFormat('ru', {
  year: '2-digit',
  month: '2-digit',
  day: '2-digit'
});

export function PeriodRadio() {
  const togglerRef = useRef<HTMLInputElement>(null);
  const [query, setPeriod] = usePeriod();
  const [periods]= useState(Object.entries(periodsInit).map(([id, label]) => ({id, label})));
  const [isDatepickerOpen, setIsDatepickerOpen] = useState(false);

  const [customPeriod, setCustomPeriod] = useState<DateValue>(new Date());

  useEffect(() => {
    if (query?.period == null) {
      setPeriod('all');
    }
  }, [query]);

  const handleChangePeriod = (e: any) => {
    const period = e.target.value as keyof typeof periodsInit;

    if (period === 'custom') {
      setIsDatepickerOpen(true);
      return;
    }
    else {
      setPeriod(period);
    }
  };

  const handleDatepickerClose = () => {
    setIsDatepickerOpen(false);
  };

  const handleDateChange = (value: any) => {
    setCustomPeriod(value);
    // setIsDatepickerOpen(false);
  };

  const handleDatepickerApply = () => {
    if (Array.isArray(customPeriod)) {
      const value = JSON.stringify(customPeriod.filter(Boolean).map((date) => date?.toISOString())) as CustomPeriod;
      setPeriod(value);
      setIsDatepickerOpen(false); 
    }
  };

  const printCustomPeriod = (_from?: string | null, _to?: string | null) => {
    const from = _from ? new Date(_from) : new Date();
    const to = _to ? new Date(_to) : new Date();

    return `${customPeriodFormatter.format(from)} - ${customPeriodFormatter.format(to)}`;
  }

  const toggleDatePicker = () => {
    setIsDatepickerOpen(true);
  }

  return (
    <div className={styles.root}>
    <fieldset className={styles.wrapper}>
      {periods.map((period) => (
        <div key={period.id} className={styles.periodItem}>
          <input
            ref={togglerRef}
            id={`period-radio-${period.id}`}
            type="radio"
            name="period"
            value={period.id}
            checked={period.id === query?.period}
            onChange={handleChangePeriod}
          />
          {period.id === 'custom' && query?.period === 'custom' ? (
            <label
              className={styles.periodItemLabel}
              htmlFor={`period-radio-${period.id}`}
              onClick={query?.period === 'custom' ? toggleDatePicker : undefined}
            >
              {printCustomPeriod(query?.period_from, query?.period_to)}
            </label>
          ) : (
            <label
              className={styles.periodItemLabel}
              htmlFor={`period-radio-${period.id}`}
            >
              {period.label}
            </label>
          )}
        </div>
      ))}
    </fieldset>
      <Dropdown
        togglerRef={togglerRef}
        className={styles.dropdown}
        isOpen={isDatepickerOpen}
        onClose={handleDatepickerClose}
      >
        <div className={styles.datepicker}>
          <Calendar
            maxDate={new Date()}
            selectRange={true}
            onChange={handleDateChange}
            value={customPeriod}
            minDetail='month'
            prev2Label={null}
            next2Label={null}
            prevLabel={
              <Icon
                src={CaretLeftBold}
                width={16}
                height={16}
              />
            }
            nextLabel={
              <Icon
                src={CaretRightBold}
                width={16}
                height={16}
              />
            }
          />
          <div className={styles.datepickerControls}>
            <Button type="tertiary" size="s" onClick={handleDatepickerClose}>Отменить</Button>
            <Button type="primary" size="s" onClick={handleDatepickerApply}>Применить</Button>
          </div>
        </div>
      </Dropdown>
    </div>
  );
}
