import type { ReactNode } from 'react';

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="border-b border-green/10">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-chocolate/70">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
