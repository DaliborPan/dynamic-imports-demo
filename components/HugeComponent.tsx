import * as _ from 'lodash'

export const HugeComponent = () => {
  const three = _.add(1, 2)

  return (
    <div>
      <span>This is component, that uses lodash</span>
      <span>1 + 2 = {three}</span>
    </div>
  )
}
