// import React from "react";
// import { render, screen } from "@testing-library/react";
// import ClockRangeChart, {
//   toMinutes,
//   formatTime12,
//   formatDuration,
// } from "../component/ClockCards";

// describe("ClockRangeChart helpers", () => {
//   it("converts time to minutes correctly", () => {
//     expect(toMinutes("14:10:00")).toBe(14 * 60 + 10);
//     expect(toMinutes("00:00:00")).toBe(0);
//     expect(toMinutes("23:59:00")).toBe(23 * 60 + 59);
//   });

//   it("formats time to 12-hour format", () => {
//     expect(formatTime12("14:10:00")).toBe("2:10 PM");
//     expect(formatTime12("00:00:00")).toBe("12:00 AM");
//     expect(formatTime12("12:00:00")).toBe("12:00 PM");
//   });

//   it("formats duration correctly", () => {
//     expect(formatDuration(120)).toBe("2h");
//     expect(formatDuration(150)).toBe("2h 30m");
//     expect(formatDuration(60)).toBe("1h");
//     expect(formatDuration(0)).toBe("0h");
//   });
// });

// describe("ClockRangeChart component", () => {
//   it("renders without crashing", () => {
//     render(<ClockRangeChart startTime="14:10:00" endTime="18:20:00" />);
//     // Chart renders a canvas
//     expect(screen.getByRole("img")).toBeInTheDocument();
//   });
// });
