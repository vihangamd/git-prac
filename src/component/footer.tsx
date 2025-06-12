// export default function Footer() {
//   return (
//     <footer className="w-full bg-gray-200 text-center py-4 mt-8 text-sm text-gray-600">
//       © {new Date().getFullYear()} To-Do App. All rights reserved.
//     </footer>
//   );
// }

"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-200 text-center p-3 text-sm mt-auto">
      © {new Date().getFullYear()} ToDo App by You
    </footer>
  );
}
