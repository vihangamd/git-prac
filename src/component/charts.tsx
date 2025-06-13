"use client";
import React, { useEffect, useState } from "react";

type Time = {
  hours: number;
  minutes: number;
  period: "AM" | "PM";
};

function to24HourFormat({ hours, minutes, period }: Time): number {
  const hr = hours % 12;
  return (period === "AM" ? hr : hr + 12) * 60 + minutes;
}

function timeToAngle(hours: number, minutes: number) {
  const totalMinutes = (hours % 12) * 60 + minutes;
  return (totalMinutes / 720) * 360 - 90;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (Math.PI / 180) * angleDeg;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  let sweep = endAngle - startAngle;
  if (sweep <= 0) sweep += 360;
  const largeArcFlag = sweep > 180 ? "1" : "0";
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export default function ClockChart({
  startTime = { hours: 4, minutes: 30, period: "AM" },
  endTime = { hours: 3, minutes: 30, period: "PM" },
  showAllNumbers = false,
}: {
  startTime: Time;
  endTime: Time;
  showAllNumbers?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const width = 300;
  const height = 300;
  const radius = 90;
  const labelRadius = 120;
  const center = { x: width / 2, y: height / 2 };

  const startTotal = to24HourFormat(startTime);
  const endTotal = to24HourFormat(endTime);

  const startAngle = timeToAngle(Math.floor(startTotal / 60), startTotal % 60);
  const endAngle = timeToAngle(Math.floor(endTotal / 60), endTotal % 60);

  const nowHours = currentTime.getHours();
  const nowMinutes = currentTime.getMinutes();
  const currentAngle = timeToAngle(nowHours % 12 || 12, nowMinutes);

  const renderTimeLabel = (totalMinutes: number, time: Time, color: string) => {
    const angle = timeToAngle(Math.floor(totalMinutes / 60), totalMinutes % 60);
    const { x, y } = polarToCartesian(
      center.x,
      center.y,
      labelRadius + 10,
      angle
    );
    const label = `${time.hours}:${time.minutes.toString().padStart(2, "0")} ${
      time.period
    }`;
    return (
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="12"
        fill={color}
      >
        {label}
      </text>
    );
  };

  const getDisplayedHourNumbers = () => {
    if (showAllNumbers) {
      return Array.from({ length: 12 }, (_, i) => i + 1);
    }
    const startHour = startTime.hours % 12 || 12;
    const endHour = endTime.hours % 12 || 12;

    const all = new Set<number>();
    all.add(startHour);
    all.add((startHour % 12) + 1);
    all.add(endHour);
    all.add((endHour % 12) + 1);
    return Array.from(all);
  };

  const shownHours = getDisplayedHourNumbers();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="block mx-auto"
    >
      {/* <svg width={width} height={height}> */}
      {/* Base circle */}
      <circle
        cx={center.x}
        cy={center.y}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth="20"
        fill="none"
      />

      {/* Active time arc */}
      <path
        d={describeArc(center.x, center.y, radius, startAngle, endAngle)}
        stroke="#60a5fa"
        strokeWidth="20"
        fill="none"
      />

      {/* Current time red hand */}
      <line
        x1={center.x}
        y1={center.y}
        x2={polarToCartesian(center.x, center.y, radius, currentAngle).x}
        y2={polarToCartesian(center.x, center.y, radius, currentAngle).y}
        stroke="#f43f5e"
        strokeWidth="3"
      />

      {/* Hour Numbers */}
      {shownHours.map((hour) => {
        const angle = timeToAngle(hour, 0);
        const { x, y } = polarToCartesian(
          center.x,
          center.y,
          labelRadius,
          angle
        );
        return (
          <text
            key={hour}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#333"
          >
            {hour}
          </text>
        );
      })}

      {/* Start & End Labels */}
      {renderTimeLabel(startTotal, startTime, "#16a34a")}
      {renderTimeLabel(endTotal, endTime, "#dc2626")}
    </svg>
  );
}
