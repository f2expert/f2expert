import React from 'react'
import Button from './Button'

export default function Banner() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="pt-24 pb-5 px-10">
              <h1 className="text-white w-3/5 text-[60px] leading-[72px]">Your bright future is our mission</h1>
              <p className="text-gray-500 w-3/4 mt-3 mb-7">
              At F2Expert, we prioritize a learner-centric approach 
              that combines theoretical understanding with real-world application
              </p>
              <Button classes="bg-yellow-400 text-white text-sm font-medium px-10 py-4 hover:bg-yellow-600" text="Apply Now" />
            </div>
            <div className="flex justify-between px-10">
              <div className="flex gap-5 items-center">
                <div className="bg-yellow-400 w-3 h-3"> </div>
                <div className="bg-yellow-400 w-3 h-3"> </div>
                <div className="bg-yellow-400 w-3 h-3"> </div>
              </div>
              <div className="flex gap-5 text-gray-300 text-[35px]">
                <div>
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
                <div>
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </div>
    )
}
