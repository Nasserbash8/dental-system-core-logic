'use client'
import { Fade } from 'react-awesome-reveal'

function OurExperience() {
  return (
    <Fade triggerOnce >
<section className="w-full px-4 py-10">
  <div className="relative w-full rounded-3xl overflow-hidden">
    {/* Background Image */}
    <img
      src="/images/img-001-copyright.jpg"
      alt="Dentist"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />

    {/* Overlay (content wrapper) */}
    <div className="relative z-10 w-full flex flex-col gap-6 py-16 px-6 sm:px-12">
      
      {/* Right Floating Box */}
      <div className="self-end max-sm:self-center">
        <div className="bg-sky-50 text-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-lg max-sm:p-4 max-sm:max-w-xs">
          <h3 className="text-6xl font-bold mb-2 max-sm:text-4xl">10</h3>
          <p className="text-lg font-medium mb-1 max-sm:text-base">سنوات من الخبرة المشتركة</p>
          <p className="text-sm max-sm:text-xs">
            يسعى فريقنا ذو الخبرة إلى توفير تجربة إيجابية وخالية من التوتر.
          </p>
        </div>
      </div>

      {/* Bottom Boxes */}
      <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1 max-sm:w-full max-sm:gap-3 max-sm:self-center">
        <Fade direction="up" triggerOnce>
          <div className="bg-gray-800 bg-opacity-90 text-white rounded-2xl p-5 w-60 shadow-lg max-sm:w-full">
            <h3 className="text-6xl font-bold mb-2 max-sm:text-4xl">3</h3>
            <p className="text-sm max-sm:text-xs">
              Convenient locations<br />across the city
            </p>
          </div>
        </Fade>

        <Fade direction="down" triggerOnce>
          <div className="bg-brand-900 text-white rounded-2xl p-5 w-60 shadow-lg h-40 max-sm:w-full max-sm:h-auto">
            <h3 className="text-6xl font-bold mb-2 max-sm:text-4xl">2</h3>
            <p className="text-sm max-sm:text-xs">
              الأطباء ذوي الخبرة<br />في خدمتك
            </p>
          </div>
        </Fade>
      </div>
    </div>
  </div>
</section>
</Fade>
  )
}

export default OurExperience