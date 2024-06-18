import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function LevelChart({ levelData, levelLabels }) {
   const chartRef = useRef(null);

   useEffect(() => {

      if (chartRef.current) {
         if (chartRef.current.chart) {
            chartRef.current.chart.destroy();
         }

         const context = chartRef.current.getContext('2d');

         const newChart = new Chart(context, {
            type: 'bar',
            data: {
               labels: levelLabels,
               datasets: [
                  {
                     label: 'Quantity',
                     data: levelData,
                     backgroundColor: 'aqua',
                     borderColor: 'teal',
                     borderWidth: 1,
                  },
               ],
            },
            options: {
               scales: {
                  x: {
                     type: 'category'
                  },
                  y: {
                     beginAtZero: true
                  }
               }
            }
         });

         chartRef.current.chart = newChart;
      }
   }, [levelData]);

   return (
      <div className='flex flex-col justify-center items-center' style={{position: 'relative', width: '25vw', height: '25vh'}}>
         <canvas ref={chartRef} />
      </div>
   )
}