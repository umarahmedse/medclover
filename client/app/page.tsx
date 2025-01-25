import { BarChartStacked } from "@/components/bar-chart";
import { RadialChartStacked } from "@/components/radial-chart-stacked";
import { TableCases } from "@/components/table-cases";

export default function Page() {
  return (
    <>
      <div className="flex items-center flex-wrap lg:flex-nowrap gap-1 p-4">
        <RadialChartStacked
          title="Current Cases"
          subtitle="This Month"
          chartFooter="Cases"
          chartFirstColor="#51cf66"
          chartSecondColor="#c0eb75"
        />
        <BarChartStacked />
        <RadialChartStacked
          chartFooter="Cases"
          title="Cases Closed"
          subtitle="This Month"
          chartFirstColor="#51cf66"
          chartSecondColor="#c0eb75"
        />
      </div>
      <div className="p-4">
        <TableCases />
      </div>
    </>
  );
}
