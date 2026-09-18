import { useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import type { MonthlyMetric, MetricKey } from '@/types';

interface AnalyticsChartProps {
  data: MonthlyMetric[];
  metric: MetricKey;
}

const metricConfig: Record<MetricKey, {
  label: string;
  unit: string;
  color: string;
  format: (n: number) => string;
}> = {
  carbon_tco2e: {
    label: 'Carbon Sequestration',
    unit: 'tCO₂e',
    color: '#6EE7A1',
    format: (n) => n.toLocaleString(),
  },
  biodiversity_index: {
    label: 'Biodiversity Index',
    unit: '',
    color: '#A7D7B8',
    format: (n) => n.toFixed(1),
  },
  ndvi: {
    label: 'NDVI',
    unit: '',
    color: '#6EE7A1',
    format: (n) => n.toFixed(2),
  },
  projected_credit_usd: {
    label: 'Projected Value',
    unit: 'USD',
    color: '#F4C95D',
    format: (n) => `$${(n / 1000).toFixed(0)}K`,
  },
};

export function AnalyticsChart({ data, metric }: AnalyticsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const config = metricConfig[metric];
    const values = data.map((d) => d[metric]);
    const months = data.map((d) => d.month);

    const options: Highcharts.Options = {
      chart: {
        type: 'area',
        backgroundColor: 'transparent',
        height: 240,
        spacing: [8, 8, 8, 0],
        animation: {
          duration: 600,
        },
        style: {
          fontFamily: 'Inter, sans-serif',
        },
      },
      title: null,
      xAxis: {
        categories: months,
        tickColor: 'rgba(255,255,255,0.06)',
        lineColor: 'rgba(255,255,255,0.06)',
        labels: {
          style: { color: '#91A49A', fontSize: '11px' },
          y: 14,
        },
        gridLineWidth: 0,
      },
      yAxis: {
        title: null,
        tickColor: 'rgba(255,255,255,0.06)',
        lineColor: 'rgba(255,255,255,0.06)',
        gridLineColor: 'rgba(255,255,255,0.04)',
        labels: {
          style: { color: '#91A49A', fontSize: '11px' },
          formatter: function () {
            const val = this.value as number;
            if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
            return val.toString();
          },
        },
        min: 0,
      },
      tooltip: {
        backgroundColor: '#13221B',
        borderColor: 'rgba(255,255,255,0.14)',
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        style: { color: '#F3F7F4', fontSize: '12px' },
        headerFormat: '<span style="font-weight:600;margin-bottom:4px;display:block">{point.key}</span>',
        pointFormatter: function () {
          const val = config.format(this.y as number);
          return `<span style="color:${config.color}">${config.label}: </span><span style="font-weight:600">${val} ${config.unit}</span>`;
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
              [0, `${config.color}40`],
              [1, `${config.color}02`],
            ],
          },
          lineColor: config.color,
          lineWidth: 2,
          marker: {
            enabled: false,
            states: {
              hover: {
                enabled: true,
                radius: 4,
                fillColor: config.color,
                lineColor: '#07110D',
                lineWidth: 2,
              },
            },
          },
          states: {
            hover: { lineWidth: 2.5 },
          },
        },
      },
      series: [
        {
          name: config.label,
          data: values,
          type: 'area',
        },
      ],
    };

    const chart = Highcharts.chart(chartRef.current, options);
    chartInstance.current = chart;

    return () => {
      chart.destroy();
      chartInstance.current = null;
    };
  }, [data, metric]);

  return <div ref={chartRef} className="w-full" />;
}
