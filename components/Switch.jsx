import { useState } from 'react'

export default function Switch() {
  const [ enabled, setEnabled ] = useState(false);

  return (
    <>
      <label for='checkMode'>
        <div className='flex gap-[1.2rem]'>
          <span className={enabled ? `text-white` : `text-neutral-800`}>查詢</span>
          <div className="relative flex flex-col items-center justify-center overflow-hidden">
            <div className="flex">
              <label class="inline-flex relative items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={enabled}
                  id="checkMode"
                />
                <div onClick={() => setEnabled(!enabled)}
                  className="w-10 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-[16px] after:absolute after:top-0.5 after:left-[2px] after:bg-white
                  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                ></div>
                {/* <span className='absolute border-2 invisible peer-checked:visible rounded-full h-[0.6rem] w-[0.6rem] left-[0.3rem] pointer-events-none'></span>
                <span className='absolute border-[0.1rem] peer-checked:invisible rounded-full h-[0.6rem] w-0 left-7 border-white pointer-events-none'></span> */}
              </label>
            </div>
          </div>
          <span className={enabled ? `text-neutral-800` : `text-white`}>編輯</span>
        </div>
      </label>
    </>
  )
}

// className="w-11 h-6 bg-gray-200 rounded-full peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
