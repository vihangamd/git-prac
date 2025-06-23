// "use client";

// import React, { useMemo } from "react";
// import moment from "moment";
// import { Doughnut } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// interface ClockRangeChartProps {
//   startTime: string;
//   endTime: string;
// }

// export const HOURS_IN_CLOCK = 12;
// export const HOURS_IN_DAY = 24;
// export const MINUTES_PER_HOUR = 60;
// export const MINUTES_IN_12_HOURS = HOURS_IN_CLOCK * MINUTES_PER_HOUR; // 720
// export const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_PER_HOUR; // 1440
// export const FULL_CIRCLE_DEGREES = 360;

// // Export helpers for unit test
// export const toMinutes = (timeStr: string) =>
//   moment(timeStr, "HH:mm:ss").hours() * MINUTES_PER_HOUR +
//   moment(timeStr, "HH:mm:ss").minutes();

// export const formatTime12 = (timeStr: string) =>
//   moment(timeStr, "HH:mm:ss").format("h:mm A");

// export const formatDuration = (actualRangeMinutes: number) => {
//   const duration = moment.duration(actualRangeMinutes, "minutes");
//   const hours = duration.hours();
//   const minutes = duration.minutes();
//   return `${hours}h${minutes ? ` ${minutes}m` : ""}`;
// };

// const ClockRangeChart: React.FC<ClockRangeChartProps> = ({
//   startTime,
//   endTime,
// }) => {
//   const startMinutes = toMinutes(startTime);
//   const endMinutes = toMinutes(endTime);

//   const startMinutes12 = startMinutes % MINUTES_IN_12_HOURS;
//   const endMinutes12 = endMinutes % MINUTES_IN_12_HOURS;

//   const actualRangeMinutes =
//     (endMinutes - startMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY;

//   const showFullCircle = actualRangeMinutes >= MINUTES_IN_12_HOURS;
//   const arcLength = showFullCircle
//     ? MINUTES_IN_12_HOURS
//     : (endMinutes12 - startMinutes12 + MINUTES_IN_12_HOURS) %
//       MINUTES_IN_12_HOURS;

//   const gapLength = MINUTES_IN_12_HOURS - arcLength;

//   const data = useMemo(
//     () => ({
//       datasets: [
//         {
//           data: [arcLength, gapLength],
//           backgroundColor: ["#5289e7", "#E5E7EB"],
//           borderWidth: 0,
//           customLabels: [
//             { type: "range", startTime, endTime, showFullCircle },
//             { type: "gap" },
//           ],
//         },
//       ],
//     }),
//     [arcLength, gapLength, startTime, endTime, showFullCircle]
//   );

//   const rotationDegrees =
//     (startMinutes12 / MINUTES_IN_12_HOURS) * FULL_CIRCLE_DEGREES;

//   const options = useMemo(
//     () => ({
//       rotation: rotationDegrees,
//       circumference: FULL_CIRCLE_DEGREES,
//       cutout: "80%",
//       plugins: {
//         tooltip: {
//           enabled: true,
//           filter: (ctx: any) =>
//             ctx.dataset.customLabels[ctx.dataIndex]?.type === "range",
//           callbacks: {
//             label: () =>
//               `Start: ${formatTime12(startTime)} → End: ${formatTime12(
//                 endTime
//               )} (${formatDuration(actualRangeMinutes)})`,
//           },
//         },
//         legend: { display: false },
//       },
//       layout: { padding: 60 },
//     }),
//     [rotationDegrees, startTime, endTime, actualRangeMinutes]
//   );

//   const plugins = [
//     {
//       id: "clockNumbersAndDots",
//       afterDraw(chart: any) {
//         const { ctx, width, height } = chart;
//         const centerX = width / 2;
//         const centerY = height / 2;
//         const radius = chart.getDatasetMeta(0).data[0].outerRadius;

//         const numberOffset = radius + 25;
//         const dotOffset = radius + 10;
//         const dotRadius = 5;

//         const toRadians = (minutes: number) =>
//           (minutes / MINUTES_IN_12_HOURS) * 2 * Math.PI - Math.PI / 2;

//         const drawDot = (angle: number, color: string) => {
//           const x = centerX + dotOffset * Math.cos(angle);
//           const y = centerY + dotOffset * Math.sin(angle);
//           ctx.beginPath();
//           ctx.fillStyle = color;
//           ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
//           ctx.fill();
//         };

//         ctx.fillStyle = "#374151";
//         ctx.font = "bold 14px sans-serif";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         for (let hour = 1; hour <= HOURS_IN_CLOCK; hour++) {
//           const angle = (hour / HOURS_IN_CLOCK) * 2 * Math.PI - Math.PI / 2;
//           const x = centerX + numberOffset * Math.cos(angle);
//           const y = centerY + numberOffset * Math.sin(angle);
//           ctx.fillText(hour.toString(), x, y);
//         }

//         drawDot(toRadians(startMinutes12), "#22C55E");
//         drawDot(toRadians(endMinutes12), "#EF4444");
//       },
//     },
//   ];

//   return (
//     <div style={{ width: "auto", height: "auto" }}>
//       <Doughnut
//         key={`${startMinutes}-${endMinutes}`}
//         data={data}
//         options={options}
//         plugins={plugins}
//       />
//     </div>
//   );
// };

// export default ClockRangeChart;

"use client";

import React, { useMemo } from "react";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useClockMode } from "../app/page"; 
ChartJS.register(ArcElement, Tooltip, Legend);

interface ClockRangeChartProps {
  startTime: string;
  endTime: string;
}

const ClockRangeChart: React.FC<ClockRangeChartProps> = ({
  startTime,
  endTime,
}) => {
  const is24Hour = useClockMode(); 

  const HOURS_IN_CLOCK = is24Hour ? 24 : 12;
  const MINUTES_PER_HOUR = 60;
  const MINUTES_IN_CLOCK = HOURS_IN_CLOCK * MINUTES_PER_HOUR;
  const MINUTES_IN_DAY = 24 * MINUTES_PER_HOUR;
  const FULL_CIRCLE_DEGREES = 360;

  const toMinutes = (timeStr: string) =>
    moment(timeStr, "HH:mm:ss").hours() * MINUTES_PER_HOUR +
    moment(timeStr, "HH:mm:ss").minutes();

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  // Convert to current clock mode (12 or 24)
  const startMinutesClock = startMinutes % MINUTES_IN_CLOCK;
  const endMinutesClock = endMinutes % MINUTES_IN_CLOCK;

  const actualRangeMinutes =
    (endMinutes - startMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY;

  const showFullCircle = actualRangeMinutes >= MINUTES_IN_CLOCK;
  const arcLength = showFullCircle
    ? MINUTES_IN_CLOCK
    : (endMinutesClock - startMinutesClock + MINUTES_IN_CLOCK) %
      MINUTES_IN_CLOCK;

  const gapLength = MINUTES_IN_CLOCK - arcLength;

  const data = useMemo(
    () => ({
      datasets: [
        {
          data: [arcLength, gapLength],
          backgroundColor: ["#5289e7", "#E5E7EB"],
          borderWidth: 0,
          customLabels: [
            { type: "range", startTime, endTime, showFullCircle },
            { type: "gap" },
          ],
        },
      ],
    }),
    [arcLength, gapLength, startTime, endTime, showFullCircle]
  );

  const rotationDegrees =
    (startMinutesClock / MINUTES_IN_CLOCK) * FULL_CIRCLE_DEGREES;

  const formatTime12 = (timeStr: string) =>
    moment(timeStr, "HH:mm:ss").format("h:mm A");

  const formatTime24 = (timeStr: string) =>
    moment(timeStr, "HH:mm:ss").format("HH:mm");

  const formatDuration = () => {
    const duration = moment.duration(actualRangeMinutes, "minutes");
    const hours = duration.hours();
    const minutes = duration.minutes();
    return `${hours}h${minutes ? ` ${minutes}m` : ""}`;
  };

  const options = useMemo(
    () => ({
      rotation: rotationDegrees,
      circumference: FULL_CIRCLE_DEGREES,
      cutout: "80%",
      plugins: {
        tooltip: {
          enabled: true,
          filter: (ctx: any) =>
            ctx.dataset.customLabels[ctx.dataIndex]?.type === "range",
          callbacks: {
            label: () =>
              `Start: ${
                is24Hour ? formatTime24(startTime) : formatTime12(startTime)
              } → End: ${
                is24Hour ? formatTime24(endTime) : formatTime12(endTime)
              } (${formatDuration()})`,
          },
        },
        legend: { display: false },
      },
      layout: { padding: 60 },
    }),
    [rotationDegrees, startTime, endTime, is24Hour,formatDuration]
  );

  const plugins = [
    {
      id: "clockNumbersAndDots",
      afterDraw(chart: any) {
        const { ctx, width, height } = chart;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = chart.getDatasetMeta(0).data[0].outerRadius;

        const numberOffset = radius + 25;
        const dotOffset = radius + 10;
        const dotRadius = 5;

        const toRadians = (minutes: number) =>
          (minutes / MINUTES_IN_CLOCK) * 2 * Math.PI - Math.PI / 2;

        const drawDot = (angle: number, color: string) => {
          const x = centerX + dotOffset * Math.cos(angle);
          const y = centerY + dotOffset * Math.sin(angle);
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
        };

        // 🕒 Draw clock numbers dynamically
        ctx.fillStyle = "#374151";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let hour = 0; hour < HOURS_IN_CLOCK; hour++) {
          const displayHour = is24Hour ? hour : hour === 0 ? 12 : hour;
          const angle = (hour / HOURS_IN_CLOCK) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + numberOffset * Math.cos(angle);
          const y = centerY + numberOffset * Math.sin(angle);
          ctx.fillText(displayHour.toString(), x, y);
        }

        drawDot(toRadians(startMinutesClock), "#22C55E");
        drawDot(toRadians(endMinutesClock), "#EF4444");
      },
    },
  ];

  return (
    <div style={{ width: "auto", height: "auto" }}>
      <Doughnut
        key={`${startMinutes}-${endMinutes}-${is24Hour}`}
        data={data}
        options={options}
        plugins={plugins}
      />
    </div>
  );
};

export default ClockRangeChart;
