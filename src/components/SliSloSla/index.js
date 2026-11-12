import React, {useState} from 'react';
import styles from './styles.module.css';

const ANALOGIES = {
  rail: {
    label: 'Swiss railways',
    sli: 'Share of trains less than 3 minutes late',
    slo: 'Internal target: 95% punctual',
    sla: 'Contract: money back if the train is late',
  },
  pizza: {
    label: 'Pizza courier',
    sli: 'Delivery time per order',
    slo: 'Target: 95% of pizzas in under 30 minutes',
    sla: 'Contract: late pizza is free',
  },
};

const MINUTES_PER_30_DAYS = 43200;
const SLA_VALUE = 99.5;

export default function SliSloSla() {
  const [analogy, setAnalogy] = useState('rail');
  const [slo, setSlo] = useState(99.9);
  const [downtime, setDowntime] = useState(12);

  const budget = (MINUTES_PER_30_DAYS * (100 - slo)) / 100;
  const left = Math.max(0, budget - downtime);
  const leftPercent = budget > 0 ? Math.min(100, (left / budget) * 100) : 0;
  const sli = 100 - (downtime / MINUTES_PER_30_DAYS) * 100;
  const isEmpty = downtime > budget;
  const isLow = !isEmpty && leftPercent < 25;
  const noBuffer = slo <= SLA_VALUE;
  const current = ANALOGIES[analogy];

    return (
    <div className={styles.wrapper}>
      <div className={styles.switch} role="group" aria-label="Choose an analogy">
        {Object.entries(ANALOGIES).map(([key, value]) => (
          <button
            key={key}
            type="button"
            className={key === analogy ? styles.active : ''}
            onClick={() => setAnalogy(key)}>
            {value.label}
          </button>
        ))}
      </div>

      <div className={styles.stairs}>
        <div className={`${styles.step} ${styles.slaStep}`}>
          <strong>SLA {SLA_VALUE.toFixed(2)}%</strong>
          <span>{current.sla}</span>
        </div>
        <div className={`${styles.step} ${styles.sloStep}`}>
          <strong>SLO {slo.toFixed(2)}%</strong>
          <span>{current.slo}</span>
        </div>
        <div className={`${styles.step} ${styles.sliStep}`}>
          <strong>SLI {sli.toFixed(3)}%</strong>
          <span>{current.sli}</span>
        </div>
      </div>

      <label className={styles.control}>
        SLO: {slo.toFixed(2)}%
        <input
          type="range"
          min="99"
          max="99.99"
          step="0.01"
          value={slo}
          onChange={(e) => setSlo(parseFloat(e.target.value))}
        />
      </label>
      <label className={styles.control}>
        Downtime this month: {downtime} min
        <input
          type="range"
          min="0"
          max="120"
          step="1"
          value={downtime}
          onChange={(e) => setDowntime(parseInt(e.target.value, 10))}
        />
      </label>

      <div className={styles.tankRow}>
        <div className={styles.tank} aria-hidden="true">
          <div
            className={`${styles.fill} ${isEmpty ? styles.empty : isLow ? styles.low : styles.ok}`}
            style={{height: `${Math.round(leftPercent)}%`}}
          />
        </div>
        <div>
          <div>Error budget per 30 days: <strong>{Math.round(budget)} min</strong></div>
          <div>
            {isEmpty
              ? `Over budget by ${Math.round(downtime - budget)} min`
              : `${Math.round(left)} min left`}
          </div>
          <div>
            {isEmpty
              ? 'Budget empty: stop features, stabilize first.'
              : isLow
              ? 'Careful: slow down releases.'
              : 'All good, keep shipping.'}
          </div>
          {noBuffer && (
            <div className={styles.warning}>
              The SLO is not stricter than the SLA. No buffer!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}