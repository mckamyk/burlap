import {trpc} from './trpc'

export const RecordList = () => {
  const {data} = trpc.getRaws.useQuery();

  return (
    <div>
      {data && data.map(d => (
        <div>{d.description}</div>
      ))}
    </div>
  )
}
