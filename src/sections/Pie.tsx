import {ResponsivePie} from '@nivo/pie'
import { trpc } from '../trpc'
import { FilterOptions } from '../App'
import type { RouterOutputs } from '../trpc'

type Datum = {
  id: string;
  label: string;
  value: number;
  color?: string;
}

const chartifyData = (data: RouterOutputs['getPieValues']): Datum[] => {
  return [
    {
      id: 'low', label: 'Low',
      value: data.low,
      // color: "rgb(32 41 55)" //gray-800
      color: 'rgb(107,114,128)' // gray-500
    }, {
      id: 'medium', label: 'Medium',
      value: data.medium,
      color: 'rgb(107,114,128)' // gray-500
    }, {
      id: 'high', label: "High",
      value: data.high,
      color: 'rgb(234,179,8)' // yellow-500
    }, {
      id: 'critical', label: "Critical",
      value: data.critical,
      color: 'rgb(239,68,68)' // red-500
    }
  ].filter(d => d.value)
}


export const SeverityPie = ({filters}: {filters: FilterOptions}) => {
  const {data} = trpc.getPieValues.useQuery(filters)


  return (
    <div className="h-[412px] flex items-center justify-center">
      <div className="h-[375px] w-full">
        {data && (
          <ResponsivePie
            data={chartifyData(data)}
            colors={{datum: 'data.color'}}
            borderColor={{from: 'color', modifiers: [['darker', 0.2]]}}
            innerRadius={.6}
            cornerRadius={5}
            padAngle={1.5}
            margin={{top: 20, bottom: 20}}
            borderWidth={2}
            arcLinkLabel={"label"}
            arcLinkLabelsColor={{from: 'color'}}
            arcLinkLabelsTextColor={{from: 'color'}}
            arcLinkLabelsThickness={2}
          />
        )}
      </div>
    </div>
  )
}

