export default function Q3Table({ columns = [], rows = [] }) {
  return (
    <>
      <div className="q3-card q3-scroll">
        <table className="q3">
          <thead>
            <tr>
              {columns.map((c, i) => (
                <th key={i} className={c.align === 'right' ? 'num' : (c.className || '')}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr key={row.id ?? row.name ?? rIdx}>
                {columns.map((c, cIdx) => {
                  const val = c.render ? c.render(row, rIdx) : row[c.key];
                  const cls = c.align === 'right' ? 'num' : c.className || '';
                  return <td key={cIdx} className={cls}>{val}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
