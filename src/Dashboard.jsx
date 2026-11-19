import React, { useEffect, useMemo, useState } from 'react';
import api from './api/axios';
import './Dashboard.css';

const money = (value) => `$${Number(value || 0).toFixed(2)}`;

function ChartCard({ number, title, subtitle, type = 'bar', children, wide = false }) {
  return (
    <article className={`chart-card ${wide ? 'chart-wide' : ''}`}>
      <div className="chart-heading">
        <div>
          <p className="chart-index">Query {String(number).padStart(2, '0')}</p>
          <h2>{title}</h2>
        </div>
        {subtitle && <span className="chart-subtitle">{subtitle}</span>}
      </div>
      <div className={`chart-body chart-${type}`}>{children}</div>
    </article>
  );
}

function HorizontalBars({ items, valueKey, labelKey = 'name', formatter = money, maxValue, color = '#8e7ad7' }) {
  const safeItems = items.slice(0, 8);
  const max = maxValue || Math.max(...safeItems.map((item) => Number(item[valueKey] || item[valueKey] === 0 ? item[valueKey] : 0)), 1);

  return (
    <div className="horizontal-bars">
      {safeItems.map((item, index) => {
        const value = Number(item[valueKey] || 0);
        return (
          <div className="horizontal-bar-row" key={`${item[labelKey]}-${index}`}>
            <div className="horizontal-bar-meta">
              <span>{item[labelKey] || 'Uncategorized'}</span>
              <strong>{formatter(value)}</strong>
            </div>
            <div className="horizontal-bar-track">
              <div className="horizontal-bar-fill" style={{ width: `${Math.max((value / max) * 100, 2)}%`, background: color }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ColumnBars({ items, labelKey, valueKey, formatter = money, color = '#8e7ad7' }) {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);
  return (
    <div className="column-bars">
      {items.map((item, index) => {
        const value = Number(item[valueKey] || 0);
        return (
          <div className="column-bar-item" key={`${item[labelKey]}-${index}`}>
            <span className="column-value">{formatter(value)}</span>
            <div className="column-bar-track">
              <div className="column-bar-fill" style={{ height: `${Math.max((value / max) * 100, 3)}%`, background: color }} />
            </div>
            <span className="column-label">{item[labelKey]}</span>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ items, labelKey, valueKey, formatter = money }) {
  const width = 700;
  const height = 220;
  const padding = 28;
  const safeItems = items.slice(0, 12);
  const values = safeItems.map((item) => Number(item[valueKey] || 0));
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = safeItems.map((item, index) => {
    const x = safeItems.length === 1 ? width / 2 : padding + (index * (width - padding * 2)) / (safeItems.length - 1);
    const y = height - padding - ((Number(item[valueKey] || 0) - min) / range) * (height - padding * 2);
    return { x, y, item };
  });
  const line = points.map((point) => `${point.x},${point.y}`).join(' ');
  const area = points.length ? `${padding},${height - padding} ${line} ${width - padding},${height - padding}` : '';

  return (
    <div className="line-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Line chart">
        <defs>
          <linearGradient id="lineArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8e7ad7" stopOpacity=".24" />
            <stop offset="100%" stopColor="#8e7ad7" stopOpacity=".02" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((lineIndex) => (
          <line key={lineIndex} x1={padding} x2={width - padding} y1={padding + lineIndex * ((height - padding * 2) / 3)} y2={padding + lineIndex * ((height - padding * 2) / 3)} className="grid-line" />
        ))}
        {points.length > 1 && <polygon points={area} fill="url(#lineArea)" />}
        {points.length > 1 && <polyline points={line} fill="none" stroke="#7d68cd" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />}
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="5" fill="#fff" stroke="#7d68cd" strokeWidth="3" />
            {(index === 0 || index === points.length - 1 || points.length <= 6) && (
              <text x={point.x} y={height - 7} textAnchor="middle" className="svg-label">{String(point.item[labelKey]).slice(0, 10)}</text>
            )}
          </g>
        ))}
      </svg>
      {safeItems.length === 1 && <div className="line-single-value">{formatter(values[0])}</div>}
    </div>
  );
}

function DonutChart({ items, labelKey, valueKey }) {
  const total = items.reduce((sum, item) => sum + Number(item[valueKey] || 0), 0) || 1;
  let current = 0;
  const colors = ['#8e7ad7', '#69a6df', '#f0ad66', '#62bd91', '#df7e99', '#7387bd'];
  const stops = items.map((item, index) => {
    const start = (current / total) * 100;
    current += Number(item[valueKey] || 0);
    const end = (current / total) * 100;
    return `${colors[index % colors.length]} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="donut-layout">
      <div className="donut" style={{ background: `conic-gradient(${stops})` }}>
        <div className="donut-hole"><strong>{total}</strong><span>items</span></div>
      </div>
      <div className="donut-legend">
        {items.map((item, index) => (
          <div className="donut-legend-row" key={`${item[labelKey]}-${index}`}>
            <span className="legend-dot" style={{ background: colors[index % colors.length] }} />
            <span>{item[labelKey]}</span>
            <strong>{item[valueKey]}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

function GaugeChart({ value, label }) {
  const numericValue = Number(value || 0);
  return (
    <div className="gauge">
      <svg viewBox="0 0 240 135" role="img" aria-label={label}>
        <path d="M 25 115 A 95 95 0 0 1 215 115" fill="none" stroke="#edf0f5" strokeWidth="18" strokeLinecap="round" />
        <path d="M 25 115 A 95 95 0 0 1 215 115" fill="none" stroke="#8e7ad7" strokeWidth="18" strokeLinecap="round" pathLength="100" strokeDasharray={`${Math.min(numericValue, 100)} 100`} />
      </svg>
      <strong>{label}</strong>
    </div>
  );
}

function Dashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    api.get('/products/queries')
      .then(({ data }) => {
        if (active) setResults(data.data || {});
      })
      .catch((requestError) => {
        if (!active) return;

        const status = requestError.response?.status;
        const serverMessage = requestError.response?.data?.message;

        if (status >= 500) {
          setError('The analytics API is unavailable. Start MySQL in Laragon, then refresh this page.');
        } else if (serverMessage) {
          setError(serverMessage);
        } else {
          setError('Could not reach the analytics API. Make sure Laravel is running on port 8000.');
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const products = useMemo(() => results?.name_and_price || [], [results]);
  const productsWithCategory = useMemo(() => results?.products_with_category || [], [results]);
  const orderedProducts = results?.products_ordered_by_price || [];
  const firstFive = results?.first_five_products || [];
  const priceFiltered = useMemo(() => results?.price_greater_than_or_equal || [], [results]);
  const electronics = results?.electronics || [];
  const categories = results?.avg_per_category || [];
  const totals = results?.sum_per_category || [];
  const minimums = results?.min_per_category || [];
  const sortedAverages = results?.avg_per_category_sorted || [];
  const electronicsAndBooks = results?.electronics_and_books || [];

  const categoryCounts = useMemo(() => {
    const counts = {};
    productsWithCategory.forEach((product) => {
      const name = product.category?.name || 'Uncategorized';
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [productsWithCategory]);

  const filteredPrices = useMemo(
    () => priceFiltered.slice(0, 10).map((product) => ({ name: product.name, price: product.price })),
    [priceFiltered],
  );

  if (loading) {
    return <main className="dashboard-shell"><div className="loading-state">Loading analytics...</div></main>;
  }

  if (error) {
    return <main className="dashboard-shell"><div className="error-state">{error}</div></main>;
  }

  return (
    <main className="dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Commerce overview</p>
          <h1>Product intelligence</h1>
          <p className="header-copy">A clear view of your catalog performance and pricing signals.</p>
        </div>
        <div className="header-status"><span /> Live data</div>
      </header>

      <section className="charts-grid" aria-label="All backend query charts">
        <ChartCard number={1} title="Name and price" subtitle={`${products.length} records`} type="line" wide>
          <LineChart items={products.slice(0, 12)} labelKey="name" valueKey="price" />
        </ChartCard>

        <ChartCard number={2} title="Products by category" subtitle="Distribution" type="donut">
          <DonutChart items={categoryCounts} labelKey="name" valueKey="count" />
        </ChartCard>

        <ChartCard number={3} title="Price, lowest to highest" subtitle="Ascending" type="line" wide>
          <LineChart
            items={orderedProducts.slice(0, 12).map((item, index) => ({ name: item.name, rank: index + 1 }))}
            labelKey="name"
            valueKey="rank"
            formatter={(value) => `#${value}`}
          />
        </ChartCard>

        <ChartCard number={4} title="First five products" subtitle="Limited query" type="columns">
          <ColumnBars items={firstFive.map((item) => ({ name: item.name, price: item.price }))} labelKey="name" valueKey="price" />
        </ChartCard>

        <ChartCard number={5} title="Prices at least $3" subtitle={`${priceFiltered.length} matches`} type="bars">
          <HorizontalBars items={filteredPrices} labelKey="name" valueKey="price" />
        </ChartCard>

        <ChartCard number={6} title="Electronics products" subtitle={`${electronics.length} matches`} type="columns">
          <ColumnBars items={electronics.slice(0, 8).map((item) => ({ name: item.name, price: item.price }))} labelKey="name" valueKey="price" color="#69a6df" />
        </ChartCard>

        <ChartCard number={7} title="Catalog value" subtitle="SUM(price)" type="gauge">
          <GaugeChart value={100} label={money(results?.sum)} />
        </ChartCard>

        <ChartCard number={8} title="Average price" subtitle="AVG(price)" type="gauge">
          <GaugeChart value={Math.min(Number(results?.avg || 0) * 10, 100)} label={money(results?.avg)} />
        </ChartCard>

        <ChartCard number={9} title="Highest price" subtitle="MAX(price)" type="gauge">
          <GaugeChart value={100} label={money(results?.max)} />
        </ChartCard>

        <ChartCard number={10} title="Lowest price" subtitle="MIN(price)" type="gauge">
          <GaugeChart value={Math.max(Number(results?.min || 0) * 10, 5)} label={money(results?.min)} />
        </ChartCard>

        <ChartCard number={11} title="Total price per category" subtitle="SUM + GROUP BY" type="bars" wide>
          <HorizontalBars items={totals} labelKey="name" valueKey="total_price" maxValue={Math.max(...totals.map((item) => Number(item.total_price || 0)), 1)} />
        </ChartCard>

        <ChartCard number={12} title="Average price per category" subtitle="AVG + GROUP BY" type="columns" wide>
          <ColumnBars items={categories.map((item) => ({ name: item.name, value: item.avg_price }))} labelKey="name" valueKey="value" color="#69a6df" />
        </ChartCard>

        <ChartCard number={13} title="Lowest price per category" subtitle="MIN + GROUP BY" type="bars">
          <HorizontalBars items={minimums} labelKey="name" valueKey="min_price" formatter={money} color="#62bd91" />
        </ChartCard>

        <ChartCard number={14} title="Averages sorted" subtitle="ASC order" type="line" wide>
          <LineChart items={sortedAverages.map((item) => ({ name: item.name, value: item.avg_price }))} labelKey="name" valueKey="value" />
        </ChartCard>

        <ChartCard number={15} title="Electronics and books" subtitle="AVG filtered categories" type="bars">
          <HorizontalBars items={electronicsAndBooks} labelKey="name" valueKey="avg_price" formatter={money} color="#f0ad66" />
        </ChartCard>
      </section>
    </main>
  );
}

export default Dashboard;
