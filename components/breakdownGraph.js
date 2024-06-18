import { useRef, useEffect } from 'react';
import { Chart } from 'chart.js/auto';

export default function BreakdownGraph({ typeLabels, typeData }) {
   const chartRef = useRef(null);

   useEffect(() => {
      console.log(typeLabels);
      console.log(typeData);
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
                     color: 'white',
                     borderColor: 'black',
                     borderWidth: 1,
                  },
               ],
            },
            options: {
            },
         });

         chartRef.current.chart = newChart;
      }
   }, [typeData, typeLabels]);

   return (
      <div className='flex flex-col justify-center items-center' style={{position: 'relative', width: '30vw', height: '30vh'}}>
         <canvas ref={chartRef} />
      </div>
   )
}