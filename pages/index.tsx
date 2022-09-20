import type { NextPage } from 'next'
import { Dispatch, SetStateAction, Suspense, useState } from 'react'
import { Component1 } from '../components/Component1'
import { Component2 } from '../components/Component2'
import { HugeComponent } from '../components/HugeComponent'

const Button: React.FC<{ show: boolean, setShow: Dispatch<SetStateAction<boolean>> }> = ({ show, setShow }) => (
  <button className='border border-slate-400 px-4 py-2 rounded' onClick={() => setShow((current) => !current)}>{show ? 'Hide' : 'Show'} Component2</button>
)

const Loader = () => <div className='text-blue-700'>Loading...</div>

const Home: NextPage = () => {
  const [show, setShow] = useState(false)

  return (
    <div className='min-h-screen bg-slate-300'>
      <div className='container px-10 mx-auto'>
        <h1 className='pt-20 pb-10 text-3xl'>Demo app</h1>
        <Component1 />
        <HugeComponent />
        <Button {...{ show, setShow }}/>
        {show && (
          <Suspense fallback={<Loader />}>
            <Component2 />
          </Suspense>
        )}
      </div>
    </div>
  )
}

export default Home
