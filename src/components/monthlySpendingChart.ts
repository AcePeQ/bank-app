import type { MonthlySpending } from '../types/dashboard'
import Chart from 'chart.js/auto'
import { formatCurrency } from '../utils/formats';


export function createSpendingChart(chartCanvas: HTMLCanvasElement, data: MonthlySpending, currency: string) {
  const labels = data.categories.map(category => category.category);
  const values = data.categories.map(category => category.amount);

  const ariaLabelString = data.categories.map(category => {
    return `${category.category}: ${formatCurrency(category.amount, currency)}`
  })
  chartCanvas.setAttribute("aria-label", "Monthly spending: " + ariaLabelString.join(", ") + ". Total: " + formatCurrency(data.spent, currency));

  return new Chart(chartCanvas, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#1a1c1c",
            padding: 16,
            font: {
              size: 18,
              family: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
              weight: "normal",
            },
            usePointStyle: true,
            pointStyle: "circle",
          }
        },
        tooltip: {
          titleAlign: "center",
          bodyAlign: "center",
          displayColors: false,
          titleFont: {
            size: 16
          },
          titleMarginBottom: 8,
          bodyFont: {
            size: 16
          },
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || '';

              if (label) {
                label += ': ';
              }
              if (typeof context.parsed === 'number') {
                label += formatCurrency(context.parsed, currency);
              }
              return label;
            },

          }
        }
      }
    }
  })
}