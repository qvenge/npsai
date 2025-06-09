'use client';

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, type TooltipProps
} from 'recharts';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Checkbox } from '@/shared/ui/checkbox';
import { capitalize } from '@/shared/lib';

import { normalizeChartData } from './lib';
import styles from './chart.module.scss';

const COLORS = {
  positive: "#22c55e",    // зеленый
  neutral: "#fbbf24",     // оранжевый
  negative: "#ef4444",    // красный
  spam: "#3b82f6"         // синий
};

const initialLines = [
  {
    key: 'positive',
    name: 'Положительные',
    color: COLORS.positive,
    active: true
  },
  {
    key: 'neutral',
    name: 'Нейтральные',
    color: COLORS.neutral,
    active: true
  },
  {
    key: 'negative',
    name: 'Отрицательные',
    color: COLORS.negative,
    active: true
  },
  {
    key: 'spam',
    name: 'Спам',
    color: COLORS.spam,
    active: true
  },
];

export function Chart({data: rawData}: any) {
  const [lines, setLines] = useState(initialLines);

  const { data, domain } = useMemo(() => {
    // const lastDate = new Date();
    // const date = new Date(lastDate.getFullYear(), lastDate.getMonth() - 3, 1);
    // const rawData: any = {last_date: lastDate.toISOString(), first_date: date.toISOString(), positive: [], neutral: [], negative: [], spam: []}

    // while (date <= lastDate) {
    //   rawData.positive.push(Math.round(Math.random() * 100));
    //   rawData.neutral.push(Math.round(Math.random() * 100));
    //   rawData.negative.push(Math.round(Math.random() * 100));
    //   rawData.spam.push(Math.round(Math.random() * 100));
    //   date.setDate(date.getDate() + 1);
    // }

    return  normalizeChartData(rawData);
  }, [rawData]);

  const handleCheckboxChange = (key: string) => {
    setLines((prevLines) =>
      prevLines.map((line) => {
        if (line.key === key) {
          return { ...line, active: !line.active };
        }
        return line;
      })
    );
  };

  const formatter = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit'
  })

  return (
    <div className={styles.root}>
      <h2 className={styles.title}>График</h2>
      <div className={styles.checkboxes}>
        {lines.map(({ key, name, active }) => (
          <Checkbox
            key={key}
            className={clsx(styles.checkbox, styles[`checkbox${capitalize(key)}`])}
            label={name}
            checked={active}
            onChange={handleCheckboxChange.bind(null, key)}
          />
        ))}
      </div>
      <div>
        <ResponsiveContainer width="100%" height={440}>
          <LineChart
            data={data}
            // margin={{ top: 40, right: 30, left: 10, bottom: 10 }}
            margin={{ top: 0, right: 0, left: 0, bottom: 26 }}
          >
            <Tooltip content={TooltipContent}/>
            <CartesianGrid
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="label"
              hide={true}
            />
            <YAxis
              domain={domain}
              axisLine={false}
              tickLine={false}
              tickMargin={20}
              tick={CustomizedTickLabel({ anchor: 'middle', style: { transform: 'translateY(-10px)' } })}
            />
            {lines.map(({ key, name, color, active }) => (
              <Line
                style={active ? {} : { display: 'none' }}
                key={key}
                // type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 0 }}
                name={name}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
        <div className={styles.xAxis}>
          {data.map((item: any, index: number) => (
            <div className={styles.tickLabel} key={item.label} style={{position: 'relative'}}>
              {(index === 0 || index === Math.round(data.length / 2) || index === data.length - 1) &&
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    transform: index === 0 ? '' : (index === data.length - 1 ? 'translateX(-100%)' : 'translateX(-50%)'),
                    top: 0,
                    // textAlign: 'center',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {JSON.parse(item.date).map((date: string) => formatter.format(new Date(date))).join(' - ') || item.date}
                </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomizedTickLabel({anchor, style}: {anchor: 'start' | 'middle' | 'end', style?: any}) {
  return (props: any) => {
    const { x, y, stroke, payload } = props;

    return (
      <text
        className={styles.tickLabel}
        x={x}
        y={y}
        dy={16}
        style={{...style, display: payload.value ? 'block' : 'none'}}
        // fill={stroke}
        // fontSize={13}
        textAnchor={anchor ?? 'middle'}
      >
        {payload.value}
      </text>
    );
  };
}

const TooltipContent = ({ active, payload, label, ...props }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <div className={styles.tooltipLabel}>{label}</div>
        <div className={styles.tooltipItems}>
          {
            payload.map((item: any) => (
              <div
                className={styles.tooltipItem}
                key={item.name}
                // @ts-ignore
                style={{ '--tooltip-item-color': item.color }}
              >
                <div className={styles.tooltipItemName}>{item.name}</div>
                <div className={styles.tooltipItemValue}>{item.value}</div>
              </div>
            ))
          }
        </div>
      </div>
    );
  }

  return null;
};