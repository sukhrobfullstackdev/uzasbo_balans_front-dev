import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, ResponsiveContainer } from "recharts";

const data = [
  {
    name: "Page A",
    uv: 4000,
    id: 1
  },
  {
    name: "Page B",
    uv: 3000.25
  },
  {
    name: "Page C",
    uv: 2000
  },
  {
    name: "Page D",
    uv: 2780
  },
  {
    name: "Page E",
    uv: 1890
  },
  {
    name: "Page F",
    uv: 2390
  },
  {
    name: "Page G",
    uv: 3490
  }
];

const DrillDownRechart = () => {
  const tickFormatter = (e) => {
    return new Intl.NumberFormat("ru-RU", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(e);
  };

  const handleClick = (e) => {
    console.log(e);
  };

  return (
    <ResponsiveContainer width='100%' height={600}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis type="number" allowDecimals tickFormatter={tickFormatter} />
        <YAxis type="category" dataKey="name" />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={tickFormatter} />
        <Bar dataKey="uv" fill="#82ca9d" onClick={handleClick}>
          <LabelList
            dataKey="uv"
            position="insideRight"
            formatter={tickFormatter}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default DrillDownRechart;
