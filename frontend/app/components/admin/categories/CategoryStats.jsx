export default function CategoryStats({ statsQuery }) {
  const { stats, isError, error, isLoading } = statsQuery;
  if (isLoading) return <>Loading stats...</>;
  if (isError) return <>{error}, failed to get stats</>;

  const cards = [
    {
      label: "Total Categories",
      value: stats.totalCategories,
    },
    { label: "Root Categories", value: stats.rootCategories },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {cards.map((stat) => (
        <div
          key={stat.label}
          className="bg-(--color-card) border border-badge rounded-xl p-4"
        >
          <p className="text-sm text-secondary-text">{stat.label}</p>
          <p className="text-2xl font-bold text-(--color-primary-text) mt-1">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
