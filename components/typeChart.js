import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function TypeChart({ typeData, typeLabels }) {
   const chartRef = useRef(null);

   useEffect(() => {

      if (chartRef.current) {
         if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
         }

         const context = chartRef.current.getContext('2d');

         const newChart = new Chart(context, {
            type: 'doughnut',
            data: {
               labels: typeLabels,
               datasets: [
                  {
                     label: 'Type Count',
                     data: typeData,
                     backgroundColor: ['#cc4a21', '#9b1d14', '#802d73', '#ac97a1'],
                     borderColor: 'black',
                     borderWidth: 1,
                  },
               ],
            },
            options: {
               plugins: {
                  legend: {
                     labels: {
                        color: 'white',
                        font: {
                           size: 15
                        }
                     }
                  }
               }
            }
         });

         chartRef.current.chart = newChart;
      }
   }, [typeData]);

   return (
      <div className='flex flex-col justify-center items-center' style={{position: 'relative', width: '25vw', height: '25vh'}}>
         <canvas ref={chartRef} />
      </div>
   )
}