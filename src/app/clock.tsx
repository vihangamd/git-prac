"use client";

import React, { useMemo } from "react";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// startTime={"14:10:00"} endTime={"18:20:00"}
interface ClockRangeChartProps {
  startTime: string;
  endTime: string;
}

const ClockRangeChart: React.FC<ClockRangeChartProps> = ({
  startTime,
  endTime,
}) => {
  const HOURS_IN_CLOCK = 12;
  const HOURS_IN_DAY = 24;
  const MINUTES_PER_HOUR = 60;
  const MINUTES_IN_12_HOURS = HOURS_IN_CLOCK * MINUTES_PER_HOUR; // 720
  const MINUTES_IN_DAY = HOURS_IN_DAY * MINUTES_PER_HOUR; // 1440
  const FULL_CIRCLE_DEGREES = 360;

  // Parse time string into total minutes since midnight
  const toMinutes = (timeStr: string) =>
    moment(timeStr, "HH:mm:ss").hours() * MINUTES_PER_HOUR +
    moment(timeStr, "HH:mm:ss").minutes();

  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  // Convert times to 12-hour clock space for rotation and arc calculations
  const startMinutes12 = startMinutes % MINUTES_IN_12_HOURS;
  const endMinutes12 = endMinutes % MINUTES_IN_12_HOURS;

  const actualRangeMinutes =
    (endMinutes - startMinutes + MINUTES_IN_DAY) % MINUTES_IN_DAY;

  // Show full circle if the range is 12 hours or more
  const showFullCircle = actualRangeMinutes >= MINUTES_IN_12_HOURS;
  const arcLength = showFullCircle
    ? MINUTES_IN_12_HOURS
    : (endMinutes12 - startMinutes12 + MINUTES_IN_12_HOURS) %
      MINUTES_IN_12_HOURS;

  const gapLength = MINUTES_IN_12_HOURS - arcLength;

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
    (startMinutes12 / MINUTES_IN_12_HOURS) * FULL_CIRCLE_DEGREES;

  // Format time in 12-hour format
  const formatTime12 = (timeStr: string) =>
    moment(timeStr, "HH:mm:ss").format("h:mm A");

  // Format range duration
  const formatDuration = () => {
    const duration = moment.duration(actualRangeMinutes, "minutes");
    const hours = duration.hours();
    const minutes = duration.minutes();
    return `${hours}h${minutes ? ` ${minutes}m` : ""}`;
  };

  // Chart options, including custom tooltip and layout
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
              `Start: ${formatTime12(startTime)} → End: ${formatTime12(
                endTime
              )} (${formatDuration()})`,
          },
        },
        legend: { display: false },
      },
      layout: { padding: 60 },
    }),
    [rotationDegrees, startTime, endTime]
  );

  // To draw clock numbers and start/end dots
  const plugins = [
    {
      id: "clockNumbersAndDots",
      afterDraw(chart: any) {
        const { ctx, width, height } = chart;
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = chart.getDatasetMeta(0).data[0].outerRadius;

        const numberOffset = radius + 25; // Distance for clock numbers
        const dotOffset = radius + 10; // Distance for start/end dots
        const dotRadius = 5;

        // Convert minutes to angle in radians for drawing
        const toRadians = (minutes: number) =>
          (minutes / MINUTES_IN_12_HOURS) * 2 * Math.PI - Math.PI / 2;

        const drawDot = (angle: number, color: string) => {
          const x = centerX + dotOffset * Math.cos(angle);
          const y = centerY + dotOffset * Math.sin(angle);
          ctx.beginPath();
          ctx.fillStyle = color;
          ctx.arc(x, y, dotRadius, 0, 2 * Math.PI);
          ctx.fill();
        };

        // Draw clock numbers (1–12) around the face
        ctx.fillStyle = "#374151";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (let hour = 1; hour <= HOURS_IN_CLOCK; hour++) {
          const angle = (hour / HOURS_IN_CLOCK) * 2 * Math.PI - Math.PI / 2;
          const x = centerX + numberOffset * Math.cos(angle);
          const y = centerY + numberOffset * Math.sin(angle);
          ctx.fillText(hour.toString(), x, y);
        }

        drawDot(toRadians(startMinutes12), "#22C55E");
        drawDot(toRadians(endMinutes12), "#EF4444");
      },
    },
  ];

  return (
    <div style={{ width: "auto", height: "auto" }}>
      <Doughnut
        key={`${startMinutes}-${endMinutes}`}
        data={data}
        options={options}
        plugins={plugins}
      />
    </div>
  );
};

export default ClockRangeChart;
