import { Link } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";
import { Sparkles } from "lucide-react";
import Model from "./model";
import InstallPrompt from "./Installprompt";

function Page() {
  return (
    <>
      <section className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 lg:gap-12 pt-8 sm:pt-14 lg:pt-20">
          <div className="flex flex-col gap-5 sm:gap-6 lg:max-w-xl text-left">
            <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              New season
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)]">
              Comfort and style for every step
            </h1>

            <p className="text-base sm:text-lg text-zinc-200/95 max-w-lg leading-relaxed drop-shadow-md">
              Premium picks built for long days—cushioning that holds up, silhouettes
              that work everywhere, and details you will notice every time you lace up.
            </p>

            <div className="flex flex-col flex-wrap items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:gap-4">
              <Link
                to="/list"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 to-amber-500 px-7 py-3.5 text-base font-bold text-zinc-900 shadow-lg shadow-amber-900/30 transition hover:brightness-105 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                Shop collection
                <MdArrowOutward
                  className="text-xl transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                Contact us
              </Link>
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 sm:gap-4 max-w-md border-t border-white/15 pt-6">
              <div>
                <dt className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Styles
                </dt>
                <dd className="text-lg sm:text-xl font-bold text-white">120+</dd>
              </div>
              <div>
                <dt className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Brands
                </dt>
                <dd className="text-lg sm:text-xl font-bold text-white">Top picks</dd>
              </div>
              <div>
                <dt className="text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Support
                </dt>
                <dd className="text-lg sm:text-xl font-bold text-white">24/7</dd>
              </div>
            </dl>
          </div>

          <div className="relative w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none lg:w-[min(52vw,640px)] shrink-0">
            <div
              className="relative mx-auto flex max-h-[min(70vh,560px)] min-h-[320px] w-full flex-col overflow-hidden rounded-[2rem] border border-white/20 bg-zinc-900/40 p-1 shadow-2xl shadow-black/50 backdrop-blur-sm sm:min-h-[380px] sm:rounded-[2.5rem] lg:aspect-square lg:max-h-[min(72vh,600px)]"
              aria-hidden
            >
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-amber-400/15 via-transparent to-indigo-500/10" />
              <div className="relative flex min-h-0 flex-1 flex-col rounded-[inherit] bg-cover bg-center bg-[url('./bg99.png')] px-2 pb-6 pt-2 sm:px-4 sm:pb-8 sm:pt-3">
                <Model />
              </div>
            </div>
          </div>
        </div>
      </section>
      <InstallPrompt />
    </>
  );
}

export default Page;
