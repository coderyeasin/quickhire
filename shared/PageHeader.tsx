interface PageHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, sub, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-dark-text font-clash">
          {title}
        </h1>
        {sub && <p className="text-sm text-primary-gray mt-0.5">{sub}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
