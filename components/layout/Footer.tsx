import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-espresso border-t border-dourado">
      <div className="px-5 py-16 md:py-20 text-center">
        <div className="flex justify-center mb-2">
          <Image
            src="/logo-lt.png"
            alt="LT Studio"
            width={99}
            height={54}
            className="opacity-80"
          />
        </div>
        <p className="font-sans text-cream-text/70 text-[10px] tracking-widest uppercase">
          Moda Feminina · Personal Styling
        </p>
      </div>
    </footer>
  )
}
